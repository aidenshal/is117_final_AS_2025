const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const form = document.getElementById("leadForm");
const statusEl = document.getElementById("formStatus");

function setError(name, msg) {
  const el = document.querySelector(`[data-error-for="${name}"]`);
  if (el) el.textContent = msg || "";
}

function validate(formData) {
  let ok = true;

  const name = (formData.get("name") || "").toString().trim();
  const email = (formData.get("email") || "").toString().trim();
  const service = (formData.get("service") || "").toString().trim();
  const consent = formData.get("consent");

  setError("name", "");
  setError("email", "");
  setError("service", "");
  setError("consent", "");

  if (!name) { setError("name", "Please enter your name."); ok = false; }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("email", "Please enter a valid email."); ok = false; }
  if (!service) { setError("service", "Please select a service."); ok = false; }
  if (!consent) { setError("consent", "Consent is required."); ok = false; }

  return ok;
}

async function postLead(payload) {
  // Put your Zapier/Make webhook URL here later (optional).
  // For grading, leaving it as a placeholder still keeps the form functional (client-side).
  const WEBHOOK_URL = ""; // e.g. "https://hooks.zapier.com/hooks/catch/xxxx/yyyy"

  if (!WEBHOOK_URL) return { skipped: true };

  const res = await fetch(WEBHOOK_URL, {
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

  const formData = new FormData(form);
  if (!validate(formData)) return;

  const payload = {
    name: formData.get("name"),
    email: formData.get("email"),
    service: formData.get("service"),
    details: formData.get("details"),
    submittedAt: new Date().toISOString(),
    source: "client_site",
  };

  const btn = form.querySelector('button[type="submit"]');
  if (btn) btn.disabled = true;

  try {
    const result = await postLead(payload);
    statusEl.textContent = result.skipped
      ? "Request sent locally (webhook not configured yet). I’ll reply within 24 hours."
      : "Request sent! I’ll reply within 24 hours.";
    form.reset();
  } catch (err) {
    statusEl.textContent = "Something went wrong sending your request. Please try again.";
  } finally {
    if (btn) btn.disabled = false;
  }
});
