export function renderPrzeslij() {
  return `
    <div class="card">
      <h2>Prześlij</h2>
      <p>Dodaj wpis do localStorage (działa bez backendu).</p>
      <div class="hr"></div>

      <div class="grid" style="grid-template-columns:1fr 1fr;gap:12px">
        <div>
          <label class="small">Tytuł</label>
          <input class="input" id="fTitle" placeholder="np. Wakacje" />
        </div>
        <div>
          <label class="small">Data (YYYY-MM-DD)</label>
          <input class="input" id="fDate" placeholder="2025-12-19" />
        </div>
      </div>

      <div style="height:10px"></div>

      <label class="small">Tagi (oddziel przecinkami)</label>
      <input class="input" id="fTags" placeholder="rodzina, podróż, ..." />

      <div style="height:10px"></div>

      <label class="small">Treść</label>
      <textarea id="fText" placeholder="Wpis..."></textarea>

      <div style="height:10px"></div>

      <div class="row" style="justify-content:space-between">
        <div class="small">
          Media dodasz ręcznie w <code>src/data.js</code> (np. <code>./img/foto.jpg</code>).
        </div>
        <div class="row">
          <button class="btn" id="clearForm">Wyczyść</button>
          <button class="btn primary" id="saveEntry">Zapisz wpis</button>
        </div>
      </div>
    </div>
  `;
}
