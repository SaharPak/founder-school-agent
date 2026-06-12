# Founder School — Application Assignment

**Sahar Pakseresht · Ecosystem & Events Coordinator, Aalto University Founder School**

> *"If you are interested in this role, make it yours! Make use of your agency,
> ambition and energy to proactively produce something… Aalto Founder School is
> for people of action."* — the job posting

So I built a working AI agent that helps founders take action.

## 🤖 Founder School Companion → [`/agent`](./agent)

A real, runnable web app with three tools:

- **Founder Coach** — a bold, action-first AI mentor
- **Idea Validator** — structured feedback + cheap experiments to run this week
- **Event Architect** — generates full event plans (run-of-show, promo kit,
  metrics) for Founder Talks and workshops

It runs **fully offline with one command** (no API key needed), and switches to
live LLM answers when you add one.

```bash
cd agent && npm install && npm start
# → http://localhost:3000
```

## Why this

Founder School is for people of action, so I shipped software instead of
describing it. The **Event Architect** tool turns a topic into a ready-to-ship
event kit (run-of-show, promo copy, and metrics) in seconds — exactly the kind
of leverage a small, fast-moving events team needs.

Idea → working software. That's the loop I'd bring to the team.

## Repository map

```
career-ops/
├── README.md                 ← you are here
└── agent/                    ← the AI agent (runnable web app)
    ├── server.js
    ├── lib/{llm.js, demoEngine.js}
    ├── public/{index.html, styles.css, app.js}
    └── README.md
```
