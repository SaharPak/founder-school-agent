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

// ---- Founder Coach ----
const chat = document.getElementById("chat");
const chatForm = document.getElementById("chatForm");
const chatInput = document.getElementById("chatInput");
const history = [];

function addMsg(role, text) {
  const wrap = document.createElement("div");
  wrap.className = `msg ${role}`;
  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = text;
  wrap.appendChild(bubble);
  chat.appendChild(wrap);
  chat.scrollTop = chat.scrollHeight;
  return bubble;
}

async function sendChat(message) {
  addMsg("user", message);
  history.push({ role: "user", content: message });
  const typing = addMsg("bot", "thinking…");
  typing.classList.add("typing");

  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: history.slice(-8) }),
    });
    const data = await res.json();
    typing.classList.remove("typing");
    typing.textContent = data.reply;
    history.push({ role: "assistant", content: data.reply });
  } catch {
    typing.classList.remove("typing");
    typing.textContent = "Connection hiccup — try again in a moment.";
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
    validateResult.innerHTML = `<div class="card">Something went wrong — try again.</div>`;
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
    eventResult.innerHTML = `<div class="card">Something went wrong — try again.</div>`;
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
