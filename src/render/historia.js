export function renderHistoria(entries) {
  const sorted = [...entries].sort((a,b) => (a.date || "").localeCompare(b.date || ""));
  const first = sorted[0]?.date ?? "—";
  const last  = sorted[sorted.length - 1]?.date ?? "—";

  return `
    <div class="card">
      <h2>Historia</h2>
      <p>Oś czasu na podstawie dat w wpisach.</p>
      <div class="hr"></div>

      <div class="row">
        <span class="badge">Pierwsza data: <b style="color:var(--text)">${first}</b></span>
        <span class="badge">Ostatnia data: <b style="color:var(--text)">${last}</b></span>
        <span class="badge">Razem wpisów: <b style="color:var(--text)">${entries.length}</b></span>
      </div>

      <div class="hr"></div>
      <div class="list">
        ${sorted.map(e => `
          <div class="item">
            <div class="item-title">${e.title ?? "Bez tytułu"}</div>
            <div class="item-meta">
              <span>📅 ${e.date ?? "—"}</span>
              <span>🏷️ ${(e.tags ?? []).join(", ") || "brak"}</span>
            </div>
          </div>
        `).join("")}
      </div>
    </div>
  `;
}
