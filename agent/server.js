import express from "express";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import {
  coachReply,
  validateIdea,
  designEvent,
} from "./lib/demoEngine.js";
import { callLLM, llmStatus } from "./lib/llm.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(express.json({ limit: "1mb" }));
app.use(express.static(join(__dirname, "public")));

const PORT = process.env.PORT || 3000;

/**
 * Each route tries the real LLM first (if an API key is configured) and
 * gracefully falls back to a deterministic, on-brand demo engine so the
 * reviewer can run everything without any keys or accounts.
 */

app.get("/api/status", (_req, res) => {
  res.json(llmStatus());
});

app.post("/api/chat", async (req, res) => {
  const message = String(req.body?.message || "").trim();
  const history = Array.isArray(req.body?.history) ? req.body.history : [];
  if (!message) return res.status(400).json({ error: "message is required" });

  const system = `You are the Founder School Companion, the AI mentor for Aalto University Founder School.
Voice: bold, warm, action-oriented, concise. You train the next wave of ambitious founders.
Always end with one concrete next step the founder can take in the next 48 hours.
Keep answers under 180 words unless asked for more.`;

  try {
    const llm = await callLLM({
      system,
      messages: [...history, { role: "user", content: message }],
    });
    if (llm) return res.json({ reply: llm, source: "llm" });
  } catch (err) {
    console.error("LLM chat error:", err.message);
  }
  res.json({ reply: coachReply(message), source: "demo" });
});

app.post("/api/validate", async (req, res) => {
  const idea = String(req.body?.idea || "").trim();
  if (!idea) return res.status(400).json({ error: "idea is required" });

  const system = `You are a sharp, supportive startup idea evaluator for Aalto Founder School.
Return ONLY valid JSON (no markdown) matching:
{
  "headline": string,
  "score": number (0-100),
  "problem": string,
  "audience": string,
  "valueProp": string,
  "risks": [string, string, string],
  "experiments": [string, string, string],
  "founderSchoolFit": string
}
"experiments" must be cheap tests doable in under one week. Be honest but encouraging.`;

  try {
    const llm = await callLLM({
      system,
      messages: [{ role: "user", content: `Evaluate this startup idea:\n${idea}` }],
      json: true,
    });
    if (llm) {
      const parsed = safeJson(llm);
      if (parsed) return res.json({ result: parsed, source: "llm" });
    }
  } catch (err) {
    console.error("LLM validate error:", err.message);
  }
  res.json({ result: validateIdea(idea), source: "demo" });
});

app.post("/api/event", async (req, res) => {
  const topic = String(req.body?.topic || "").trim();
  const format = String(req.body?.format || "Founder Talk").trim();
  const audience = String(req.body?.audience || "Aalto students & founders").trim();
  if (!topic) return res.status(400).json({ error: "topic is required" });

  const system = `You are an event producer for Aalto Founder School (events like "Founder Talks").
Return ONLY valid JSON (no markdown) matching:
{
  "title": string,
  "tagline": string,
  "speakerBrief": string,
  "agenda": [{"time": string, "item": string}],
  "promo": {"instagram": string, "email": string, "poster": string},
  "metrics": [string, string, string],
  "checklist": [string, string, string, string]
}
Be concrete, energetic, and realistic for a campus startup event.`;

  try {
    const llm = await callLLM({
      system,
      messages: [
        {
          role: "user",
          content: `Design a ${format} on "${topic}" for ${audience}.`,
        },
      ],
      json: true,
    });
    if (llm) {
      const parsed = safeJson(llm);
      if (parsed) return res.json({ result: parsed, source: "llm" });
    }
  } catch (err) {
    console.error("LLM event error:", err.message);
  }
  res.json({ result: designEvent(topic, format, audience), source: "demo" });
});

function safeJson(text) {
  try {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start === -1 || end === -1) return null;
    return JSON.parse(text.slice(start, end + 1));
  } catch {
    return null;
  }
}

app.listen(PORT, () => {
  const status = llmStatus();
  console.log(`\n  Founder School Companion running → http://localhost:${PORT}`);
  console.log(
    `  Mode: ${status.enabled ? `LLM (${status.model})` : "DEMO (no API key — fully functional offline)"}\n`
  );
});
