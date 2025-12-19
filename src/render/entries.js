import { esc, allTags, authorLabel } from "../utils.js";

function filteredEntries(DATA, state, type){
  const q = state.search.trim().toLowerCase();
  return DATA.entries
    .filter(e => e.type === type)
    .filter(e => state.filterAuthor==="all" || e.authorId === state.filterAuthor)
    .filter(e => state.filterTag==="all" || (e.tags||[]).includes(state.filterTag))
    .filter(e => !q || (e.title + " " + e.text).toLowerCase().includes(q))
    .sort((a,b)=> String(b.year).localeCompare(String(a.year), "pl"));
}

export function renderEntries(DATA, state, type, titleLabel){
  const tags = allTags(DATA);

  const list = filteredEntries(DATA, state, type).map(e=>`
    <div class="item" data-entry="${esc(e.id)}">
      <div class="l">
        <h4>${esc(e.title)}</h4>
        <p>${esc(e.text)}</p>
      </div>
      <span class="badge">${esc(authorLabel(DATA, e.authorId))} · ${esc(e.year)}</span>
    </div>
  `).join("");

  return `
    <section class="card">
      <div class="hd">
        <div>
          <h3>${esc(titleLabel)}</h3>
          <div class="sub">${type==="historia" ? "Historie rodziny i przyjaciół" : "Sny osób bliskich"}</div>
        </div>
        <span class="badge">${type}</span>
      </div>

      <div class="toolbar">
        <div class="controls">
          <select id="authorSel" aria-label="Filtr: kto opowiada">
            <option value="all">Wszyscy opowiadający</option>
            ${DATA.authors.map(a=>`<option value="${a.id}">${esc(a.name)} (${esc(a.relation)})</option>`).join("")}
          </select>

          <select id="tagSel" aria-label="Filtr: tag">
            <option value="all">Wszystkie tagi</option>
            ${tags.map(t=>`<option value="${esc(t)}">${esc(t)}</option>`).join("")}
          </select>

          <input id="searchInp" placeholder="Szukaj tytułu lub treści…" aria-label="Szukaj" />
        </div>
        <div class="controls"></div>
      </div>

      <div class="bd">
        <div class="list">${list || `<div class="muted">Brak wpisów dla tych filtrów.</div>`}</div>
      </div>
    </section>
  `;
}
