export function renderNav(active) {
  const tab = (id, label) => `
    <button class="tab" data-view="${id}" ${active === id ? `aria-current="page"` : ""}>
      ${label}
    </button>
  `;

  return `
    <div class="nav">
      <div class="nav-inner">
        <div class="tabs">
          ${tab("start", "Start")}
          ${tab("historia", "Historia")}
          ${tab("entries", "Wpisy")}
          ${tab("galeria", "Galeria")}
          ${tab("przeslij", "Prześlij")}
        </div>
        <div class="row">
          <button class="btn ghost" id="resetStorage" title="Usuwa wpisy zapisane w przeglądarce">Reset localStorage</button>
        </div>
      </div>
    </div>
  `;
}
