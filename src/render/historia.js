import { esc, allTags } from "../utils.js";

export function renderHistoria(DATA, state){
  const tags = allTags(DATA);
  const tagChips = ["all", ...tags];

  const rows = DATA.life
    .filter(x => state.filterTag==="all" || (x.tags||[]).includes(state.filterTag))
    .map(x=>`
      <div class="item" data-life="${esc(x.year)}|${esc(x.title)}">
        <div class="l">
          <h4>${esc(x.year)} · ${esc(x.title)}</h4>
          <p>${esc(x.text)}</p>
        </div>
        <span class="badge">${(x.tags||[]).slice(0,2).map(esc).join(" · ") || "—"}</span>
      </div>
    `).join("");

  return `
    <section class="card">
      <div class="hd">
        <div>
          <h3>Historia życia</h3>
          <div class="sub">Oś czasu i rozdziały</div>
        </div>
        <span class="badge">Oś</span>
      </div>

      <div class="toolbar">
        <div class="controls">
          <select id="tagSel" aria-label="Filtr: tag">
            <option value="all">Wszystkie tagi</option>
            ${tags.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join("")}
          </select>
        </div>
        <div class="controls"></div>
      </div>

      <div class="bd">
        <div class="chips" style="margin-bottom:10px">
          ${tagChips.map(t=>`
            <span class="chip ${t===state.filterTag?'active':''}" data-tag="${esc(t)}">${t==="all" ? "Wszystkie" : esc(t)}</span>
          `).join("")}
        </div>
        <div class="list">${rows || `<div class="muted">Brak wpisów dla tego filtra.</div>`}</div>
      </div>
    </section>
  `;
}
