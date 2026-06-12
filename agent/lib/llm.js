/**
 * Thin OpenAI-compatible chat client.
 *
 * Works with OpenAI, Azure OpenAI, OpenRouter, Groq, or a local Ollama/LM Studio
 * server — anything that speaks the /chat/completions schema. Configure via env:
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
    messages: [{ role: "system", content: system }, ...messages],
  };
  if (json) body.response_format = { type: "json_object" };

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
