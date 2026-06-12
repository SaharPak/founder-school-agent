# Founder School: Application Assignment

**Sahar Pakseresht · Ecosystem & Events Coordinator, Aalto University Founder School**

> *"If you are interested in this role, make it yours! Make use of your agency,
> ambition and energy to proactively produce something… Aalto Founder School is
> for people of action."* (the job posting)

So I built a working AI agent that helps founders take action.

## 🤖 Founder School Agent → [`/agent`](./agent)

A real, runnable web app with three tools:

- **Founder Coach**: a bold, action-first AI mentor
- **Idea Validator**: structured feedback + cheap experiments to run this week
- **Event Architect**: generates full event plans (run-of-show, promo kit,
  metrics) for Founder Talks and workshops

It runs **fully offline with one command** (no API key needed), and switches to
live LLM answers when you add one.

> **Live demo:** _add your Render URL here after deploying (see "Deploy" below)._

## Try it locally

Requirements: **Node.js 20+**.

```bash
git clone https://github.com/SaharPak/founder-school-companion.git
cd founder-school-companion/agent
npm install
npm start
# → open http://localhost:3000
```

That's it, no API key required (it runs in demo mode). To enable live Claude
answers, add a key:

```bash
OPENAI_API_KEY=sk-... npm start
```

## Deploy (one click)

This repo includes a `render.yaml` blueprint, so you can host it for free on
[Render](https://render.com):

1. Click **New → Blueprint** in Render and point it at this repository.
2. Render reads `render.yaml`, builds, and gives you a public URL.
3. (Optional) To enable live mode, set `OPENAI_API_KEY` in the service's
   **Environment** tab. Without it, the deployed app runs in demo mode.

## Why this

Founder School is for people of action, so I shipped software instead of
describing it. The **Event Architect** tool turns a topic into a ready-to-ship
event kit (run-of-show, promo copy, and metrics) in seconds, exactly the kind
of leverage a small, fast-moving events team needs.

Idea → working software. That's the loop I'd bring to the team.

## Repository map

```
career-ops/
├── README.md                 ← you are here
├── render.yaml               ← one-click deploy blueprint
└── agent/                    ← the AI agent (runnable web app)
    ├── server.js
    ├── lib/{llm.js, demoEngine.js}
    ├── public/{index.html, styles.css, app.js, assets/}
    └── README.md
```
