import { $ , esc } from "../utils.js";

export function buildHero(DATA){
  const p = DATA.person;
  $("#brandTitle").textContent = p.name;
  $("#brandSubtitle").textContent = `${p.years} · ${p.tagline}`;

  $("#hero").innerHTML = `
    <div class="hero-inner">
      <div>
        <h2>${esc(p.name)}</h2>
        <p class="meta">${esc(p.years)} · ${esc(p.tagline)}</p>
        <div class="pillrow">
          ${p.quickFacts.map(x=>`<span class="pill">${esc(x)}</span>`).join("")}
        </div>
      </div>
      <div class="quote">
        <div style="font-size:14px; line-height:1.5">${esc(p.quote.text)}</div>
        <small>${esc(p.quote.by)}</small>
      </div>
    </div>
  `;
}
