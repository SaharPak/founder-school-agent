/**
 * Deterministic, on-brand fallback "engine".
 *
 * This is NOT trying to fake an LLM. It's a lightweight, rule-based responder
 * so the product is fully demoable with zero setup. When OPENAI_API_KEY is set,
 * the real model takes over and these functions are never called.
 */

const NEXT_STEP_BANK = [
  "Message 5 potential users today and ask to watch them solve this problem manually.",
  "Write the one-sentence problem statement and test it on 3 strangers before Friday.",
  "Build a one-page landing site this week and measure how many people click 'I want this'.",
  "Book a 20-minute call with a Founder School mentor in the next 48 hours.",
  "Ship the smallest version a real user could touch by the end of the week.",
];

function pick(arr, seed) {
  return arr[Math.abs(hash(seed)) % arr.length];
}

function hash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return h;
}

function keywords(text) {
  return (text.toLowerCase().match(/[a-z]{4,}/g) || [])
    .filter((w) => !STOPWORDS.has(w))
    .slice(0, 6);
}

const STOPWORDS = new Set([
  "that", "this", "with", "from", "they", "have", "want", "need", "your",
  "their", "would", "could", "should", "about", "into", "make", "build",
  "people", "users", "using", "where", "which", "what", "when", "there",
]);

export function coachReply(message) {
  const m = message.toLowerCase();
  let core;

  if (/(idea|validate|valida)/.test(m)) {
    core =
      "Love the energy. Don't fall in love with the idea, fall in love with the problem. Find 5 people who feel the pain weekly and ask how they solve it today. If they're already hacking together a workaround, you're onto something.";
  } else if (/(pitch|deck|investor|fundrais|vc)/.test(m)) {
    core =
      "A great pitch is a story, not a spreadsheet. Open with the problem someone you respect actually has, show the painful status quo, then your insight. Numbers prove the story, they don't replace it. Practice the first 60 seconds until it's effortless.";
  } else if (/(co-?founder|team|hire|hiring)/.test(m)) {
    core =
      "Pick a co-founder the way you'd pick someone to survive a long expedition with: complementary skills, shared values, brutal honesty. Test it with a small, hard project before you commit equity.";
  } else if (/(market|customer|user|growth|traction)/.test(m)) {
    core =
      "Traction beats opinion. Go painfully narrow: pick one user you can name and obsess over them. Ten users who love you are worth more than a thousand who 'kind of' like it.";
  } else if (/(event|talk|workshop|community|ecosystem)/.test(m)) {
    core =
      "Great events don't fill a room, they build momentum and relationships. Decide the one feeling people should leave with, then design backwards from it. Follow-up within 24 hours is where the real value compounds.";
  } else if (/(fear|scared|fail|stuck|doubt|imposter)/.test(m)) {
    core =
      "Every founder you admire felt exactly this. The fix for doubt is motion. Shrink the scary thing into one tiny action you can do today, then do it. Confidence is a side effect of evidence.";
  } else {
    core =
      "Founders win by moving fast and learning faster. Get the smallest real-world signal you can, then let reality (not your assumptions) tell you what to do next. Bias toward action over analysis.";
  }

  return `${core}\n\nNext 48 hours: ${pick(NEXT_STEP_BANK, message)}`;
}

export function validateIdea(idea) {
  const kw = keywords(idea);
  const focus = kw[0] || "your space";
  const seed = hash(idea);
  const score = 55 + (Math.abs(seed) % 35); // 55–89, encouraging but not perfect

  return {
    headline: `Promising direction in ${focus}: sharpen the problem and test fast.`,
    score,
    problem: `You're targeting a real friction point around ${kw.slice(0, 3).join(", ") || "your users' workflow"}. Make sure it's a problem people actively try to solve today, not just a nice-to-have.`,
    audience: `Start with the narrowest group who feels this most acutely (likely ${focus}-focused early adopters) before broadening.`,
    valueProp: `Win by being 10x better on one dimension (speed, cost, or experience) rather than slightly better on many.`,
    risks: [
      "Building before talking to enough real users (the #1 startup killer).",
      "A problem that's real but not urgent enough for people to pay or switch.",
      "Easy for an incumbent to copy if there's no distribution or data moat.",
    ],
    experiments: [
      "Interview 5 target users this week; listen for the workarounds they already use.",
      "Put up a landing page describing the promise and measure sign-up intent.",
      "Hand-deliver the solution manually to 3 people (concierge MVP) before writing code.",
    ],
    founderSchoolFit:
      "Strong fit for Founder School: bring this to a Founder Talk Q&A or a mentor session and pressure-test it with people who've built before.",
  };
}

export function designEvent(topic, format, audience) {
  const seed = hash(topic + format);
  const titleOptions = [
    `Founder Talk: ${capitalize(topic)}`,
    `${capitalize(topic)}: Lessons From the Trenches`,
    `Inside ${capitalize(topic)}: A Founder's Playbook`,
  ];

  return {
    title: pick(titleOptions, topic),
    tagline: `An honest, no-fluff session on ${topic} for ${audience}.`,
    speakerBrief: `Find a speaker who has actually shipped in ${topic} (a founder or operator, not just a theorist). Brief them to tell 1 origin story, share 3 hard-won lessons, and reveal 1 mistake they'd undo. Keep slides minimal: the audience came for the human, not the deck.`,
    agenda: [
      { time: "0:00", item: "Doors, music, name tags & a 1-question icebreaker" },
      { time: "0:15", item: `Fireside chat: ${capitalize(topic)} (student interviewer leads)` },
      { time: "0:50", item: "Audience Q&A (pre-seed questions to avoid silence)" },
      { time: "1:10", item: "Open networking with drinks & a 'who to meet' prompt" },
      { time: "1:40", item: "Wrap-up, photo, and call-to-action for next event" },
    ],
    promo: {
      instagram: `🚀 ${capitalize(topic)} is coming to Founder School. Real founder. Real lessons. Free pizza & a room full of people building the future. Link in bio to grab your spot 👇 #AaltoFounderSchool`,
      email: `Subject: This week: ${capitalize(topic)} at Founder School\n\nHi {first_name},\n\nWe're hosting a Founder Talk on ${topic} for ${audience}. Expect candid stories, practical lessons, and a room full of people who actually build. Seats are limited, so save yours here: {link}\n\nSee you there,\nFounder School`,
      poster: `${capitalize(topic).toUpperCase()} · FOUNDER TALK · Aalto Founder School · [date] · [venue] · Free entry · Register: [link]`,
    },
    metrics: [
      "Registrations vs. show-up rate (target ≥70% attendance).",
      "Post-event NPS / 1–5 satisfaction score (target ≥4.3).",
      "New ecosystem connections made + follow-up sign-ups for the next event.",
    ],
    checklist: [
      "Confirm speaker, student interviewer, venue, and date 3+ weeks out.",
      "Publish event page + open registration 2 weeks out; start promo cadence.",
      "Prep run-of-show, AV check, name tags, and catering 2 days out.",
      "Send thank-you + recap + next-event CTA within 24 hours after.",
    ],
  };
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
