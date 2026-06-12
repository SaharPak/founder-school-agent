# Founder School Companion

An AI agent that helps founders move from **idea → event**. Built as the
application assignment for Aalto University Founder School's
*Ecosystem & Events Coordinator* role.

It bundles three tools into one agent:

| Tool | What it does | Why it matters for this role |
| --- | --- | --- |
| 💬 **Founder Coach** | Conversational mentor in Founder School's bold, action-first voice. Always ends with a concrete next step. | Empowering future founders is the core of the role. |
| 🔍 **Idea Validator** | Turns a raw idea into structured feedback: problem, audience, value prop, risks, and cheap experiments to run this week. | Helps the community move faster — the Founder School way. |
| 🎤 **Event Architect** | Generates a full event plan (title, speaker brief, run-of-show, promo kit, metrics, checklist) for a Founder Talk / workshop. | Directly mirrors the job: producing, communicating, and measuring events. |

## Why it's built this way

- **Runs with zero setup.** With no API key it uses a deterministic, on-brand
  engine so a reviewer can `npm install && npm start` and immediately use every
  feature. This was a deliberate design choice — the demo should never depend on
  someone else's credentials.
- **Production-shaped, not a toy.** API keys live server-side (never exposed to
  the browser), requests time out, structured tools return validated JSON, and
  the LLM layer is provider-agnostic (OpenAI / OpenRouter / Groq / Azure / Ollama).

## Run it

```bash
cd agent
npm install
npm start
# open http://localhost:3000
```

### Optional: live LLM answers

```bash
cp .env.example .env       # then add your key
# or just export it inline:
OPENAI_API_KEY=sk-... npm start
```

The header pill shows whether you're in **Demo** or **Live** mode.

## Project layout

```
agent/
├── server.js            # Express app + 3 API routes (LLM → demo fallback)
├── lib/
│   ├── llm.js           # OpenAI-compatible client (provider-agnostic)
│   └── demoEngine.js    # deterministic on-brand responder (offline mode)
└── public/
    ├── index.html       # single-page UI
    ├── styles.css       # light theme using Aalto's real design tokens
    ├── app.js           # tabs, chat, and tool rendering
    └── assets/
        └── aalto_en.svg # official Aalto "A!" logo (unaltered trademark)
```

## Design

The UI follows Aalto University's actual visual identity — extracted from the
live Founder School site: Inter typeface with tight heading letter-spacing, the
official "A!" logo, arrow-prefixed underline links, and Aalto's design tokens
(`#151515` ink, highlight blue `#46A5FF`, yellow `#f7e159`) rendered as a clean
**light theme**.

## Tech

Node.js + Express, vanilla JS frontend (no build step), native `fetch`.
Intentionally dependency-light so it's fast to read, run, and trust.
