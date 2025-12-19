import { $ , $$, esc } from "../utils.js";

export function buildNav(DATA){
  const nav = $("#nav");
  nav.innerHTML = DATA.tabs.map(t => `
    <button class="tabbtn" data-tab="${t.id}" type="button">${esc(t.label)}</button>
  `).join("");

  nav.addEventListener("click", (e)=>{
    const btn = e.target.closest("[data-tab]");
    if(!btn) return;
    location.hash = "#" + btn.dataset.tab;
  });
}

export function setActiveTab(tab){
  $$(".tabbtn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
}
