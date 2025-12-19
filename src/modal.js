import { qs, esc, formatDate } from "./utils.js";
import { setPreview } from "./state.js";

let backdropEl = null;

export function ensureModal() {
  if (backdropEl) return;

  backdropEl = document.createElement("div");
  backdropEl.className = "modal-backdrop";
  backdropEl.id = "modalBackdrop";

  backdropEl.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true" aria-label="Podgląd wpisu">
      <div class="modal-header">
        <div>
          <div id="modalTitle" style="font-weight:800;font-size:18px"></div>
          <div id="modalMeta" class="small"></div>
        </div>
        <button class="btn" id="modalClose">Zamknij ✕</button>
      </div>
      <div class="hr"></div>
      <div class="modal-body" id="modalBody"></div>
    </div>
  `;

  document.body.appendChild(backdropEl);

  qs("#modalClose", backdropEl).addEventListener("click", closeModal);
  backdropEl.addEventListener("click", (e) => {
    if (e.target === backdropEl) closeModal();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal();
  });
}

export function openModal(entry) {
  ensureModal();
  setPreview(entry?.id ?? null);

  qs("#modalTitle", backdropEl).textContent = entry?.title ?? "";
  qs("#modalMeta", backdropEl).textContent =
    `${formatDate(entry?.date ?? "")} • ${(entry?.tags ?? []).join(", ")}`;

  const mediaHtml = (entry?.media ?? []).map(m => {
    if (m.type === "image") {
      return `<img src="${esc(m.src)}" alt="${esc(m.alt ?? "")}" style="width:100%;border-radius:14px;border:1px solid rgba(255,255,255,0.12);margin:10px 0;" />`;
    }
    if (m.type === "video") {
      return `<video src="${esc(m.src)}" controls style="width:100%;border-radius:14px;border:1px solid rgba(255,255,255,0.12);margin:10px 0;"></video>`;
    }
    return "";
  }).join("");

  qs("#modalBody", backdropEl).innerHTML = `
    <div style="white-space:pre-wrap;line-height:1.55">${esc(entry?.text ?? "")}</div>
    ${mediaHtml ? `<div class="hr"></div>${mediaHtml}` : ""}
  `;

  backdropEl.classList.add("open");
}

export function closeModal() {
  if (!backdropEl) return;
  backdropEl.classList.remove("open");
  setPreview(null);
}
