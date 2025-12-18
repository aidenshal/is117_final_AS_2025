// ===== Year =====
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ===== Calendly compatibility =====
// 1) Put your Calendly link here
// Example: "https://calendly.com/aidenshal/15min"
const CALENDLY_URL = "";

// If you add a Calendly URL, this will inject Calendly’s embed script + widget.
(function initCalendly() {
  if (!CALENDLY_URL) return;

  const target = document.getElementById("calendlyEmbed");
  if (!target) return;

  target.innerHTML = `
    <div class="calendly-inline-widget"
      data-url="${CALENDLY_URL}"
      style="min-width:320px;height:520px;"></div>
  `;

  const s = document.createElement("script");
  s.src = "https://assets.calendly.com/assets/external/widget.js";
  s.async = true;
  document.body.appendChild(s);
})();

// ===== Zapier compatibility (webhook-ready contact form) =====
// 2) Paste your Zapier "Catch Hook" URL here (or Make.com webhook)
// Example: "https://hooks.zapier.com/hooks/catch/XXXX/YYYY"
const ZAPIER_WEBHOOK_URL = "";

const form = document.getElementById("contactForm");
const statusEl = document.getElementById("status");

function setErr(name, msg) {
  const el = document.querySelector(`[data-err="${name}"]`);
  if (el) el.textContent = msg || "";
}

function validate(fd) {
  let ok = true;
  const name = (fd.get("name") || "").toString().trim();
  const email = (fd.get("email") || "").toString().trim();
  const topic = (fd.get("topic") || "").toString().trim();
  const consent = fd.get("consent");

  setErr("name", "");
  setErr("email", "");
  setErr("topic", "");
  setErr("consent", "");

  if (!name) { setErr("name", "Please enter your name."); ok = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setErr("email", "Please enter a valid email."); ok = false; }
  if (!topic) { setErr("topic", "Please choose a topic."); ok = false; }
  if (!consent) { setErr("consent", "Consent is required."); ok = false; }

  return ok;
}

async function sendToWebhook(payload) {
  if (!ZAPIER_WEBHOOK_URL) return { skipped: true };

  const res = await fetch(ZAPIER_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error(`Webhook failed: ${res.status}`);
  return { ok: true };
}

form?.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.textContent = "";

  const fd = new FormData(form);
  if (!validate(fd)) return;

  const payload = {
    name: fd.get("name"),
    email: fd.get("email"),
    topic: fd.get("topic"),
    message: fd.get("message"),
    submittedAt: new Date().toISOString(),
    source: "portfolio_site",
  };

  const btn = form.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;

  try {
    const result = await sendToWebhook(payload);
    statusEl.textContent = result.skipped
      ? "Message saved locally (webhook not configured yet)."
      : "Sent! I’ll reply soon.";
    form.reset();
  } catch {
    statusEl.textContent = "Something went wrong sending your message. Please try again.";
  } finally {
    if (btn) btn.disabled = false;
  }
});
