export function renderEntries(entries) {
  return `
    <div class="card">
      <div class="row" style="justify-content:space-between">
        <div>
          <h2>Wpisy</h2>
          <p>Lista wpisów + podgląd w modalu.</p>
        </div>
        <div style="min-width:260px">
          <input class="input" id="search" placeholder="Szukaj (tytuł/tekst/tag)..." />
        </div>
      </div>

      <div class="hr"></div>
      <div class="list" id="entriesList">
        ${entries.map(e => itemHtml(e)).join("")}
      </div>
    </div>
  `;
}

function itemHtml(e) {
  const tags = (e.tags ?? []).join(", ");
  const mediaCount = (e.media ?? []).length;

  return `
    <div class="item" data-id="${e.id}">
      <div class="item-title">${e.title ?? "Bez tytułu"}</div>
      <div class="item-meta">
        <span>📅 ${e.date ?? "—"}</span>
        <span>🏷️ ${tags || "brak"}</span>
        <span>🖼️ ${mediaCount}</span>
      </div>
      <div class="item-actions">
        <button class="btn primary" data-action="preview">Podgląd</button>
        <button class="btn" data-action="delete">Usuń</button>
      </div>
    </div>
  `;
}

export function filterEntries(entries, q) {
  const s = (q ?? "").trim().toLowerCase();
  if (!s) return entries;

  return entries.filter(e => {
    const blob = [
      e.title ?? "",
      e.text ?? "",
      ...(e.tags ?? [])
    ].join(" ").toLowerCase();
    return blob.includes(s);
  });
}

export function renderEntriesList(entries) {
  return entries.map(e => itemHtml(e)).join("");
}
