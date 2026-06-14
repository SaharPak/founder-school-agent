# Final Submission Check

A short pre-submission polish pass on the **Founder School Agent** project, done before sharing it
with Aalto University Founder School (Ecosystem & Events Coordinator role).

## What was checked

- **Naming consistency** — every visible reference uses "Founder School Agent" (README, all docs,
  app UI, browser title, meta description, `package.json`, `render.yaml`, Dockerfile).
- **Demo Video section** — no unfinished "coming soon" placeholders left in the README.
- **Over-production** — confirmed the README is the single source of truth and covers why it exists,
  what it does, role relevance, the live demo, local setup, and a visual demo flow (screenshots).
- **Cold-start note** — clear, short, professional, and mentions Render's free tier.
- **Live demo link** — identical everywhere: `https://founder-school-agent.onrender.com`.
- **Links** — no broken internal links, dead anchors, old names, TODOs, or placeholder text.
- **Run flow** — `npm install` + `npm start` (from `agent/`).

## What was fixed

- Removed a line-wrapped leftover of the old name ("Founder School / Companion") in `DEMO.md`
  voice-over, now "Founder School Agent".
- Removed the "coming soon" **Demo Video** section from the README and its nav anchor, so nothing
  reads as unfinished. The Screenshots section carries the visual demo flow.
- Rewrote the cold-start note to be clear and non-defensive: the live demo is hosted on Render's free
  tier and can take up to ~50 seconds to wake if idle.
- Aligned the agent-level README's live-demo note with the same wording (it previously said
  "demo mode", which no longer matched the live deployment).

## Local run

```bash
cd agent
npm install
npm start          # → http://localhost:3000
```

- `npm install` and `npm start` were verified working; all three tools (Founder Coach, Idea
  Validator, Event Architect) respond, demo mode works with no key, and live mode works with a key.
- **Note:** there is no `npm run build` step by design. This is a vanilla JS frontend with no bundler,
  so `npm install` + `npm start` is the complete flow. The absence of a build step is intentional and
  keeps the project fast to read, run, and trust.

## Remaining manual steps before submission

1. **Push the polish changes.** They are saved locally but not yet committed:
   ```bash
   cd ~/Projects/founder-school-companion
   git add -A
   git commit -m "Final polish: naming consistency, remove demo-video placeholder, clearer cold-start note"
   git push origin main
   ```
2. **Update the GitHub repo "About" description** (it still shows the old project name):
   ```bash
   gh repo edit SaharPak/founder-school-agent \
     --description "Founder School Agent - an AI agent that helps founders take action (Aalto Founder School application)"
   ```
3. **Warm the Render demo right before sending.** Open
   `https://founder-school-agent.onrender.com` once so the free instance is awake; this avoids the
   ~50-second cold start on the reviewer's first click.
4. **(Optional) Live vs demo mode.** The live demo currently uses a real LLM key (your account is
   billed per request). Keep it on for the review for real answers, or remove `OPENAI_API_KEY` in the
   Render dashboard to revert to free demo mode.
