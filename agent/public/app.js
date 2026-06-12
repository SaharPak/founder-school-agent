// ---- Tabs ----
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.remove("active"));
    panels.forEach((p) => p.classList.remove("active"));
    tab.classList.add("active");
    document.getElementById(`panel-${tab.dataset.tab}`).classList.add("active");
  });
});

// ---- Backend mode pill ----
(async () => {
  const pill = document.getElementById("modePill");
  const text = document.getElementById("modeText");
  try {
    const res = await fetch("/api/status");
    const s = await res.json();
    if (s.enabled) {
      pill.classList.add("live");
      text.textContent = `Live · ${s.model}`;
    } else {
      pill.classList.add("demo");
      text.textContent = "Demo mode";
    }
  } catch {
    pill.classList.add("demo");
    text.textContent = "Demo mode";
  }
})();

const esc = (s) =>
  String(s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

// Minimal, safe Markdown for chat bubbles (the only HTML source is our own LLM).
function renderMarkdown(text) {
  let html = esc(text);
  html = html.replace(/^#{1,6}\s*(.+)$/gm, "<strong>$1</strong>"); // headings
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); // bold
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>"); // inline code
  html = html.replace(/^\s*[-*]\s+(.+)$/gm, "• $1"); // bullets
  return html;
}

// ---- Founder Coach ----
const chat = document.getElementById("chat");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const history = [];

const AVATARS = {
  bot: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="3" r="1.4"/><line x1="12" y1="4.4" x2="12" y2="7"/><rect x="4" y="7" width="16" height="12" rx="3.5"/><circle cx="9" cy="13" r="1.5" class="eye"/><circle cx="15" cy="13" r="1.5" class="eye"/></svg>`,
  user: `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.8"/><path d="M4.5 20c0-4 3.7-6.2 7.5-6.2S19.5 16 19.5 20"/></svg>`,
};

function addMsg(role, text) {
  const isUser = role === "user";
  const wrap = document.createElement("div");
  wrap.className = `msg ${role}`;

  const avatar = document.createElement("div");
  avatar.className = `avatar ${isUser ? "user" : "coach"}`;
  avatar.innerHTML = isUser ? AVATARS.user : AVATARS.bot;

  const body = document.createElement("div");
  body.className = "msg-body";

  const name = document.createElement("div");
  name.className = "msg-name";
  name.textContent = isUser ? "You" : "Founder Coach";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;

  body.appendChild(name);
  body.appendChild(bubble);
  wrap.appendChild(avatar);
  wrap.appendChild(body);
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
  return bubble;
}

async function sendChat(message) {
  addMsg("user", message);
  history.push({ role: "user", content: message });
  const bubble = addMsg("bot", "thinking…");
  bubble.classList.add("typing");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: history.slice(-8) }),
    });

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";
    let started = false;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      full += decoder.decode(value, { stream: true });
      if (!started && full.trim()) {
        bubble.classList.remove("typing");
        started = true;
      }
      bubble.innerHTML = renderMarkdown(full);
      chat.scrollTop = chat.scrollHeight;
    }

    bubble.classList.remove("typing");
    bubble.innerHTML = renderMarkdown(full);
    history.push({ role: "assistant", content: full });
  } catch {
    bubble.classList.remove("typing");
    bubble.textContent = "Connection hiccup. Try again in a moment.";
  }
  chat.scrollTop = chat.scrollHeight;
}

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const msg = chatInput.value.trim();
  if (!msg) return;
  chatInput.value = "";
  sendChat(msg);
});

document.querySelectorAll("#suggestions button").forEach((b) =>
  b.addEventListener("click", () => sendChat(b.textContent))
);

// ---- Idea Validator ----
const validateForm = document.getElementById("validateForm");
const ideaInput = document.getElementById("ideaInput");
const validateResult = document.getElementById("validateResult");

validateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const idea = ideaInput.value.trim();
  if (!idea) return;
  const btn = validateForm.querySelector("button");
  btn.disabled = true;
  btn.textContent = "Analyzing…";
  validateResult.innerHTML = "";

  try {
    const res = await fetch("/api/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea }),
    });
    const { result: r } = await res.json();
    renderValidation(r);
  } catch {
    validateResult.innerHTML = `<div class="card">Something went wrong. Try again.</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Validate my idea";
  }
});

function renderValidation(r) {
  validateResult.innerHTML = `
    <div class="card">
      <h3>${esc(r.headline)}</h3>
      <div class="score-ring">
        <div class="score-num">${r.score}<span style="font-size:18px;color:var(--muted)">/100</span></div>
        <div class="score-bar"><div class="score-fill" style="width:0%"></div></div>
      </div>
      ${field("The problem", r.problem)}
      ${field("Who it's for", r.audience)}
      ${field("How to win", r.valueProp)}
      ${listField("Top risks", r.risks)}
      ${listField("Run these experiments this week", r.experiments)}
      ${field("Founder School fit", r.founderSchoolFit)}
    </div>`;
  requestAnimationFrame(() => {
    const fill = validateResult.querySelector(".score-fill");
    if (fill) fill.style.width = `${r.score}%`;
  });
}

// ---- Event Architect ----
const eventForm = document.getElementById("eventForm");
const eventResult = document.getElementById("eventResult");

eventForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const topic = document.getElementById("topicInput").value.trim();
  if (!topic) return;
  const format = document.getElementById("formatInput").value;
  const audience = document.getElementById("audienceInput").value.trim();
  const btn = eventForm.querySelector("button");
  btn.disabled = true;
  btn.textContent = "Producing…";
  eventResult.innerHTML = "";

  try {
    const res = await fetch("/api/event", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ topic, format, audience }),
    });
    const { result: r } = await res.json();
    renderEvent(r);
  } catch {
    eventResult.innerHTML = `<div class="card">Something went wrong. Try again.</div>`;
  } finally {
    btn.disabled = false;
    btn.textContent = "Produce event plan";
  }
});

function renderEvent(r) {
  const agenda = (r.agenda || [])
    .map((a) => `<li><span class="t">${esc(a.time)}</span><span>${esc(a.item)}</span></li>`)
    .join("");

  eventResult.innerHTML = `
    <div class="card">
      <span class="tag">Event plan</span>
      <h3>${esc(r.title)}</h3>
      <p class="sub">${esc(r.tagline)}</p>
      ${field("Speaker brief", r.speakerBrief)}
      <div class="field">
        <div class="k">Run of show</div>
        <ul class="agenda">${agenda}</ul>
      </div>
      <div class="field">
        <div class="k">Promo kit</div>
        ${promo("Instagram", r.promo?.instagram)}
        ${promo("Email", r.promo?.email)}
        ${promo("Poster", r.promo?.poster)}
      </div>
      ${listField("Success metrics", r.metrics)}
      ${listField("Production checklist", r.checklist)}
    </div>`;

  eventResult.querySelectorAll(".copy").forEach((btn) =>
    btn.addEventListener("click", () => {
      navigator.clipboard?.writeText(btn.dataset.text || "");
      btn.textContent = "copied!";
      setTimeout(() => (btn.textContent = "copy"), 1200);
    })
  );
}

// ---- helpers ----
function field(k, v) {
  return `<div class="field"><div class="k">${esc(k)}</div><div class="v">${esc(v)}</div></div>`;
}

function listField(k, items) {
  const li = (items || []).map((i) => `<li>${esc(i)}</li>`).join("");
  return `<div class="field"><div class="k">${esc(k)}</div><ul class="clean">${li}</ul></div>`;
}

function promo(label, text) {
  if (!text) return "";
  return `<div class="promo-block"><button class="copy" data-text="${esc(text)}">copy</button><strong>${esc(label)}</strong>\n${esc(text)}</div>`;
}
