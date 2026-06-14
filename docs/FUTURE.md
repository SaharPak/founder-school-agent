# Roadmap & Future Improvements

Founder School Agent is deliberately scoped as a focused, runnable showcase. If it were taken
forward as a real tool for the Founder School ecosystem, here is how I would grow it, ordered by
impact-to-effort.

## Near term (days)

- **Persistent sessions.** Save coaching threads, idea reports, and event plans per user with a
  lightweight database (SQLite or Supabase) so work is not lost on refresh.
- **Export anywhere.** One-click export of event plans to PDF, Notion, or Google Calendar, and idea
  reports to a shareable link. Meets the events team where they already work.
- **Copy-to-clipboard everywhere.** Extend the existing promo-copy buttons to every section.

## Medium term (weeks)

- **Founder School knowledge grounding (RAG).** A small retrieval layer over Founder School's own
  resources, past events, mentor profiles, and FAQs so answers are specific to Aalto, not generic.
- **Event templates library.** Save and reuse proven formats (Founder Talk, workshop, demo day) and
  let the team fork past events into new ones.
- **Multi-step event workflows.** Move from "generate a plan" to "run the event": automated promo
  cadence reminders, speaker outreach drafts, and a post-event recap generator.
- **Lightweight auth.** Aalto SSO so the tool can be shared safely across the ecosystem team.

## Longer term (months)

- **Analytics dashboard for the events team.** Track registrations, show-up rate, NPS, and new
  ecosystem connections across events, turning each event into measurable learning.
- **Founder progress tracking.** Let founders log the next actions the coach suggests and nudge them
  on follow-through, turning advice into accountability.
- **Community layer.** Surface founders working on similar problems and suggest warm introductions,
  amplifying the ecosystem-building goal of the role.
- **Voice and mobile.** A conversational voice mode for coaching on the go.

## Engineering hardening

- Automated tests for the API routes and the demo engine.
- Rate limiting and request validation on the public endpoints.
- Observability: structured logs and basic usage metrics.
- CI pipeline (lint, test, deploy) on every push.

## Guiding principle

Every addition has to pass one test: **does it reduce the friction between a founder's intent and
their next concrete action, or between the events team's intent and a shipped event?** If not, it
does not make the cut.
