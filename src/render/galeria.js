import { esc } from "../utils.js";

export function renderGaleria(entries) {
  const media = entries.flatMap(e =>
    (e.media ?? []).map(m => ({ ...m, entryId: e.id, entryTitle: e.title ?? "Bez tytułu" }))
  );

  return `
    <div class="card">
      <h2>Galeria</h2>
      <p>Wszystkie media z wpisów w jednym miejscu.</p>
      <div class="hr"></div>

      ${media.length === 0 ? `
        <p>Brak mediów. Dodaj w <code>src/data.js</code> lub dodawaj wpisy w „Prześlij”.</p>
      ` : `
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px">
          ${media.map(m => tile(m)).join("")}
        </div>
      `}
    </div>
  `;
}

function tile(m) {
  if (m.type === "image") {
    return `
      <div class="item">
        <div class="small">${esc(m.entryTitle)}</div>
        <div style="height:10px"></div>
        <img src="${esc(m.src)}" alt="${esc(m.alt ?? "")}"
             style="width:100%;height:160px;object-fit:cover;border-radius:14px;border:1px solid rgba(255,255,255,0.12)" />
      </div>
    `;
  }

  if (m.type === "video") {
    return `
      <div class="item">
        <div class="small">${esc(m.entryTitle)}</div>
        <div style="height:10px"></div>
        <video src="${esc(m.src)}" controls
               style="width:100%;height:160px;object-fit:cover;border-radius:14px;border:1px solid rgba(255,255,255,0.12)"></video>
      </div>
    `;
  }

  return "";
}
