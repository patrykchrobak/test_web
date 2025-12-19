import { esc } from "../utils.js";

export function renderStart(DATA){
  return `
    <section class="card">
      <div class="hd">
        <div>
          <h3>W skrócie</h3>
          <div class="sub">Najważniejsze informacje i szybkie przejścia</div>
        </div>
        <span class="badge">Start</span>
      </div>
      <div class="bd">
        <p class="muted" style="margin-top:0">
          Ta strona działa bez backendu. Treści są w kodzie, a media jako pliki lokalne.
        </p>
        <div class="krow">
          ${DATA.tabs.filter(t=>t.id!=="start").map(t=>`<a class="btn" href="#${t.id}">Przejdź: ${esc(t.label)}</a>`).join("")}
        </div>
      </div>
    </section>

    <section class="card">
      <div class="hd">
        <div>
          <h3>Najbliższe osoby</h3>
          <div class="sub">Kto dzieli się historiami i snami</div>
        </div>
        <span class="badge">${DATA.authors.length} osób</span>
      </div>
      <div class="bd">
        <div class="chips">
          ${DATA.authors.map(a=>`<span class="chip" data-author="${a.id}" title="Filtruj">${esc(a.name)} · ${esc(a.relation)}</span>`).join("")}
        </div>
        <div class="note" style="margin-top:12px">
          Kliknij osobę, a przejdziesz do <b>Wspomnień</b> z filtrem „czyje”.
        </div>
      </div>
    </section>
  `;
}
