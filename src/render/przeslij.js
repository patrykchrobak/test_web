import { esc } from "../utils.js";

function mailtoHref(submit){
  const body =
`Kto opowiada: [imię, relacja]
Typ: [historia / sen / opis zdjęcia / opis filmu]
Tytuł: [...]
Rok/okres: [...]
Treść:
[...]

Załączniki: (dodaj zdjęcia/filmy ręcznie)
Zgoda na publikację: [tak/nie]`;

  const enc = (x)=>encodeURIComponent(x);
  return `mailto:${enc(submit.email)}?subject=${enc(submit.subject)}&body=${enc(body)}`;
}

export function renderPrzeslij(DATA){
  const s = DATA.submit;

  return `
    <section class="card">
      <div class="hd">
        <div>
          <h3>Prześlij materiały</h3>
          <div class="sub">Wysyłka przez e-mail (bez backendu)</div>
        </div>
        <span class="badge">mail</span>
      </div>

      <div class="bd">
        <p class="muted" style="margin-top:0">
          Przycisk otworzy pocztę z szablonem. <b>Załączniki dodaj ręcznie.</b>
        </p>

        <div class="note">
          <b>Adres:</b> ${esc(s.email)}<br/>
          <b>Prośba:</b>
          <ul style="margin:8px 0 0; padding-left:18px">
            ${s.instructions.map(x=>`<li>${esc(x)}</li>`).join("")}
          </ul>
        </div>

        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap">
          <a class="btn" href="${mailtoHref(s)}">Wyślij e-mail</a>
          <button class="x" type="button" id="copyEmail">Skopiuj adres</button>
        </div>
      </div>
    </section>
  `;
}
