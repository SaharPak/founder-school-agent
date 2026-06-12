# Founder School — Application Assignment

**Sahar Pakseresht · Ecosystem & Events Coordinator, Aalto University Founder School**

> *"If you are interested in this role, make it yours! Make use of your agency,
> ambition and energy to proactively produce something… Aalto Founder School is
> for people of action."* — the job posting

So I built two things instead of describing one.

## What's inside

### 1. 🤖 A working AI agent that helps founders → [`/agent`](./agent)

**Founder School Companion** — a real, runnable web app with three tools:

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

### 2. 📋 A 90-day Events & Ecosystem strategy → [`/strategy`](./strategy/FOUNDER_SCHOOL_STRATEGY.md)

An opinionated, metric-driven plan for growing Founder School's events and
ecosystem engagement — built around one idea: **optimize for momentum, not
attendance.**

## How the two fit together

The strategy argues that Founder School should stop letting event value "leak"
and should make promotion + follow-up effortless. The agent's **Event Architect
tool is a working prototype of exactly that** — turning a topic into a
ready-to-ship event kit in seconds.

Idea → strategy → working software. That's the loop I'd bring to the team.

## Repository map

```
career-ops/
├── README.md                         ← you are here
├── agent/                            ← the AI agent (runnable web app)
│   ├── server.js
│   ├── lib/{llm.js, demoEngine.js}
│   ├── public/{index.html, styles.css, app.js}
│   └── README.md
└── strategy/
    └── FOUNDER_SCHOOL_STRATEGY.md    ← the 90-day plan
```
