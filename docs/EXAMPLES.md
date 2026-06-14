# Examples

Realistic prompts and outputs for each of the three tools. The outputs below are real responses
from the app's **demo mode** (zero setup). With an API key configured, a live model produces richer,
context-aware answers in the same shape.

---

## 💬 Founder Coach

The coach speaks in a bold, warm, action-first voice and always ends with one concrete step to take
in the next 48 hours.

**Prompt:**

> How do I know if my startup idea is worth pursuing?

**Output:**

> Love the energy. Don't fall in love with the idea, fall in love with the problem. Find 5 people
> who feel the pain weekly and ask how they solve it today. If they're already hacking together a
> workaround, you're onto something.
>
> **Next 48 hours:** Book a 20-minute call with a Founder School mentor in the next 48 hours.

---

**Prompt:**

> I'm scared to launch. What do I do?

**Output:**

> Every founder you admire felt exactly this. The fix for doubt is motion. Shrink the scary thing
> into one tiny action you can do today, then do it. Confidence is a side effect of evidence.
>
> **Next 48 hours:** Ship the smallest version a real user could touch by the end of the week.

---

## 🔍 Idea Validator

Turns a raw idea into a structured, honest report. Returns strict JSON the UI renders as a scored
card.

**Prompt:**

> A marketplace that connects Aalto students with local startups for paid micro-projects, so
> students gain real experience and startups get affordable help.

**Output:**

```json
{
  "headline": "Promising direction in marketplace: sharpen the problem and test fast.",
  "score": 85,
  "problem": "You're targeting a real friction point around marketplace, connects, aalto. Make sure it's a problem people actively try to solve today, not just a nice-to-have.",
  "audience": "Start with the narrowest group who feels this most acutely (likely marketplace-focused early adopters) before broadening.",
  "valueProp": "Win by being 10x better on one dimension (speed, cost, or experience) rather than slightly better on many.",
  "risks": [
    "Building before talking to enough real users (the #1 startup killer).",
    "A problem that's real but not urgent enough for people to pay or switch.",
    "Easy for an incumbent to copy if there's no distribution or data moat."
  ],
  "experiments": [
    "Interview 5 target users this week; listen for the workarounds they already use.",
    "Put up a landing page describing the promise and measure sign-up intent.",
    "Hand-deliver the solution manually to 3 people (concierge MVP) before writing code."
  ],
  "founderSchoolFit": "Strong fit for Founder School: bring this to a Founder Talk Q&A or a mentor session and pressure-test it with people who've built before."
}
```

---

## 🎤 Event Architect

Generates a complete, ready-to-ship event plan from a topic, format, and audience.

**Prompt:**

> Topic: `fundraising your first €100k` · Format: `Founder Talk` · Audience: `Aalto students & founders`

**Output:**

```json
{
  "title": "Fundraising your first 100k: Lessons From the Trenches",
  "tagline": "An honest, no-fluff session on fundraising your first 100k for Aalto students & founders.",
  "speakerBrief": "Find a speaker who has actually shipped in fundraising your first 100k (a founder or operator, not just a theorist). Brief them to tell 1 origin story, share 3 hard-won lessons, and reveal 1 mistake they'd undo. Keep slides minimal: the audience came for the human, not the deck.",
  "agenda": [
    { "time": "0:00", "item": "Doors, music, name tags & a 1-question icebreaker" },
    { "time": "0:15", "item": "Fireside chat: Fundraising your first 100k (student interviewer leads)" },
    { "time": "0:50", "item": "Audience Q&A (pre-seed questions to avoid silence)" },
    { "time": "1:10", "item": "Open networking with drinks & a 'who to meet' prompt" },
    { "time": "1:40", "item": "Wrap-up, photo, and call-to-action for next event" }
  ],
  "promo": {
    "instagram": "🚀 Fundraising your first 100k is coming to Founder School. Real founder. Real lessons. Free pizza & a room full of people building the future. Link in bio to grab your spot 👇 #AaltoFounderSchool",
    "email": "Subject: This week: Fundraising your first 100k at Founder School\n\nHi {first_name},\n\nWe're hosting a Founder Talk on fundraising your first 100k for Aalto students & founders. Expect candid stories, practical lessons, and a room full of people who actually build. Seats are limited, so save yours here: {link}\n\nSee you there,\nFounder School",
    "poster": "FUNDRAISING YOUR FIRST 100K · FOUNDER TALK · Aalto Founder School · [date] · [venue] · Free entry · Register: [link]"
  },
  "metrics": [
    "Registrations vs. show-up rate (target ≥70% attendance).",
    "Post-event NPS / 1–5 satisfaction score (target ≥4.3).",
    "New ecosystem connections made + follow-up sign-ups for the next event."
  ],
  "checklist": [
    "Confirm speaker, student interviewer, venue, and date 3+ weeks out.",
    "Publish event page + open registration 2 weeks out; start promo cadence.",
    "Prep run-of-show, AV check, name tags, and catering 2 days out.",
    "Send thank-you + recap + next-event CTA within 24 hours after."
  ]
}
```

This single response is the difference between a blank page and a publishable event — exactly the
kind of leverage a small, fast-moving events team needs.

---

## Try your own

```bash
cd agent && npm install && npm start
# open http://localhost:3000
```

Then experiment with your own ideas and event topics. Add an API key to compare demo and live output.
