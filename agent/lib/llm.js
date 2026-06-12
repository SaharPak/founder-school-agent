/**
 * Thin OpenAI-compatible chat client.
 *
 * Works with OpenAI, Azure OpenAI, OpenRouter, Groq, or a local Ollama/LM Studio
 * server. Anything that speaks the /chat/completions schema. Configure via env:
 *
 *   OPENAI_API_KEY   required to enable real LLM calls
 *   OPENAI_BASE_URL  default https://api.openai.com/v1
 *   OPENAI_MODEL     default gpt-4o-mini
 *
 * If no key is set, callLLM() returns null and the app falls back to the
 * deterministic demo engine so the project always runs.
 */

const API_KEY = process.env.OPENAI_API_KEY;
const BASE_URL = (process.env.OPENAI_BASE_URL || "https://api.openai.com/v1").replace(/\/$/, "");
const MODEL = process.env.OPENAI_MODEL || "gpt-4o-mini";

export function llmStatus() {
  return { enabled: Boolean(API_KEY), model: MODEL, baseUrl: BASE_URL };
}

export async function callLLM({ system, messages, json = false }) {
  if (!API_KEY) return null;

  const body = {
    model: MODEL,
    temperature: json ? 0.4 : 0.7,
    max_tokens: 1200,
    messages: [{ role: "system", content: system }, ...messages],
  };
  // Anthropic's OpenAI-compatible endpoint ignores response_format, so we only
  // send it to true OpenAI-style providers. For all providers we also instruct
  // JSON in the prompt and extract it defensively, so this is just an optimization.
  if (json && !/anthropic/i.test(BASE_URL)) {
    body.response_format = { type: "json_object" };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);

  try {
    const res = await fetch(`${BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => "");
      throw new Error(`LLM ${res.status}: ${detail.slice(0, 200)}`);
    }

    const data = await res.json();
    return data?.choices?.[0]?.message?.content?.trim() || null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Streaming variant: async generator that yields text tokens as they arrive.
 * Parses the OpenAI-compatible Server-Sent Events stream. Throws if the request
 * fails before any token, so the caller can fall back to the demo engine.
 */
export async function* streamLLM({ system, messages }) {
  if (!API_KEY) return;

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.7,
      max_tokens: 1200,
      stream: true,
      messages: [{ role: "system", content: system }, ...messages],
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`LLM ${res.status}: ${detail.slice(0, 200)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed.startsWith("data:")) continue;
      const payload = trimmed.slice(5).trim();
      if (payload === "[DONE]") return;
      try {
        const token = JSON.parse(payload)?.choices?.[0]?.delta?.content;
        if (token) yield token;
      } catch {
        // ignore keep-alive / partial lines
      }
    }
  }
}
