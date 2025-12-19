export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => [...root.querySelectorAll(sel)];

export function esc(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function formatDate(iso) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("pl-PL", { year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
  } catch {
    return iso;
  }
}

export function uid() {
  return Math.random().toString(16).slice(2) + Date.now().toString(16);
}
