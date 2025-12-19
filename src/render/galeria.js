import { esc, allTags } from "../utils.js";

export function renderGaleria(DATA, state){
  const tags = allTags(DATA);
  const q = state.search.trim().toLowerCase();

  const list = DATA.media
    .filter(m => state.mediaKind==="all" || m.kind===state.mediaKind)
    .filter(m => state.filterTag==="all" || (m.tags||[]).includes(state.filterTag))
    .filter(m => !q || (m.title + " " + (m.caption||"")).toLowerCase().includes(q))
    .sort((a,b)=> String(b.year).localeCompare(String(a.year),"pl"))
    .map(m=>{
      const badge = `${m.kind==="photo"?"Zdjęcie":"Wideo"} · ${m.year || "—"}`;
      const hasImg = m.kind==="photo" && m.src;

      return `
        <div class="thumb" data-media="${esc(m.id)}">
          <div class="ph">
            ${hasImg ? `<img src="${esc(m.src)}" alt="${esc(m.title)}" loading="lazy">` : `
              <div style="padding:14px; text-align:center">
                <div style="font-weight:600; margin-bottom:6px">${esc(m.title)}</div>
                <div class="muted">${esc(badge)}</div>
                <div class="muted" style="margin-top:8px; font-size:12px">Ustaw <code>src</code> w DATA.media</div>
              </div>
            `}
          </div>
          <div class="cap">
            <b>${esc(m.title)}</b>
            <small>${esc(badge)}</small>
          </div>
        </div>
      `;
    }).join("");

  return `
    <section class="card">
      <div class="hd">
        <div>
          <h3>Galeria</h3>
          <div class="sub">Zdjęcia i filmy</div>
        </div>
        <span class="badge">Media</span>
      </div>

      <div class="toolbar">
        <div class="controls">
          <select id="tagSel" aria-label="Filtr: tag">
            <option value="all">Wszystkie tagi</option>
            ${tags.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join("")}
          </select>
          <input id="searchInp" placeholder="Szukaj w galerii…" aria-label="Szukaj" />
        </div>
        <div class="controls">
          <select id="mediaKindSel" aria-label="Typ mediów">
            <option value="all">Wszystko</option>
            <option value="photo">Zdjęcia</option>
            <option value="video">Wideo</option>
          </select>
        </div>
      </div>

      <div class="bd">
        <div class="gallery">${list || `<div class="muted">Brak mediów dla tych filtrów.</div>`}</div>
        <div class="note" style="margin-top:12px">
          Tip: ustaw np. <code>src: "img/01.jpg"</code> albo <code>src: "video/film.mp4"</code>.
        </div>
      </div>
    </section>
  `;
}
