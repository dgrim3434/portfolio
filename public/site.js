// Shared helpers. All site content lives in /data/pilots.json.
const STATUS_LABEL = { live: "Live", building: "Building", planned: "Planned" };

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);
}

function statusTag(status) {
  const key = STATUS_LABEL[status] ? status : "planned";
  return `<span class="status status-${key}">${STATUS_LABEL[key]}</span>`;
}

async function loadData() {
  const res = await fetch("/data/pilots.json", { cache: "no-cache" });
  if (!res.ok) throw new Error(`Couldn't load pilots.json (HTTP ${res.status}).`);
  return res.json();
}

function contactLinks(owner) {
  const links = [];
  if (owner.email) links.push(`<a href="mailto:${esc(owner.email)}">Email</a>`);
  if (owner.github) links.push(`<a href="${esc(owner.github)}" rel="noopener">GitHub</a>`);
  if (owner.linkedin) links.push(`<a href="${esc(owner.linkedin)}" rel="noopener">LinkedIn</a>`);
  if (owner.resume) links.push(`<a href="${esc(owner.resume)}">Résumé</a>`);
  return links.join("");
}

function renderChrome(owner) {
  document.querySelectorAll("[data-owner-name]").forEach((el) => (el.textContent = owner.name));
  document.querySelectorAll("[data-contact]").forEach((el) => (el.innerHTML = contactLinks(owner)));
  document.querySelectorAll("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
}
