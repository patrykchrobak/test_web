export function renderHero() {
  return `
    <div class="card">
      <div class="row" style="justify-content:space-between">
        <div>
          <h1>Pamięć</h1>
          <p>Strona wspomnień (bez backendu). Treści możesz trzymać w <b>localStorage</b> albo jako dane w <b>src/data.js</b>.</p>
          <div class="row">
            <span class="badge">✅ GitHub Pages: moduły działają</span>
            <span class="badge">📁 Media: ./img i ./video (względne ścieżki)</span>
          </div>
        </div>
        <div class="kpi" style="min-width:260px">
          <div>
            <div class="n" id="kpiEntries">0</div>
            <div class="l">Wpisy</div>
          </div>
          <div>
            <div class="n" id="kpiMedia">0</div>
            <div class="l">Media</div>
          </div>
          <div>
            <div class="n" id="kpiTags">0</div>
            <div class="l">Tagi</div>
          </div>
        </div>
      </div>
    </div>
  `;
}
