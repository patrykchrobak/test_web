import { DATA } from "./data.js";
import { state } from "./state.js";
import { $, $$, esc, allTags, authorLabel } from "./utils.js";
import { initModal, openModal } from "./modal.js";

import { buildHero } from "./render/hero.js";
import { buildNav, setActiveTab } from "./render/nav.js";
import { renderStart } from "./render/start.js";
import { renderHistoria } from "./render/historia.js";
import { renderEntries } from "./render/entries.js";
import { renderGaleria } from "./render/galeria.js";
import { renderPrzeslij } from "./render/przeslij.js";

function hydrateControls(){
  const authorSel = $("#authorSel");
  if(authorSel){
    authorSel.value = state.filterAuthor;
    authorSel.onchange = ()=>{ state.filterAuthor = authorSel.value; render(); };
  }

  const tagSel = $("#tagSel");
  if(tagSel){
    tagSel.value = state.filterTag;
    tagSel.onchange = ()=>{ state.filterTag = tagSel.value; render(); };
  }

  const searchInp = $("#searchInp");
  if(searchInp){
    searchInp.value = state.search;
    searchInp.oninput = ()=>{ state.search = searchInp.value; render(); };
  }

  const kindSel = $("#mediaKindSel");
  if(kindSel){
    kindSel.value = state.mediaKind;
    kindSel.onchange = ()=>{ state.mediaKind = kindSel.value; render(); };
  }

  // chipy tagów (historia)
  $$(".chip[data-tag]").forEach(ch=>{
    ch.onclick = ()=>{ state.filterTag = ch.dataset.tag; render(); };
  });

  // chipy autorów (start)
  $$(".chip[data-author]").forEach(ch=>{
    ch.onclick = ()=>{
      state.filterAuthor = ch.dataset.author;
      location.hash = "#wspomnienia";
    };
  });

  // wpisy (modal)
  $$(".item[data-entry]").forEach(it=>{
    it.onclick = ()=>{
      const id = it.dataset.entry;
      const e = DATA.entries.find(x=>x.id===id);
      if(!e) return;

      openModal(`${e.type==="historia"?"Wspomnienie":"Sen"} · ${authorLabel(DATA, e.authorId)} · ${e.year}`, `
        <div class="card" style="box-shadow:none; margin:0; border-radius:18px">
          <div class="bd">
            <h3 style="margin:0 0 8px; font-size:18px">${esc(e.title)}</h3>
            <div class="muted" style="margin-bottom:10px">${esc(authorLabel(DATA, e.authorId))} · ${esc(e.year)}</div>
            <div style="line-height:1.6; font-size:14px">${esc(e.text)}</div>
            <div class="krow">${(e.tags||[]).map(t=>`<span class="k">#${esc(t)}</span>`).join("")}</div>
          </div>
        </div>
      `);
    };
  });

  // media (modal)
  $$(".thumb[data-media]").forEach(t=>{
    t.onclick = ()=>{
      const id = t.dataset.media;
      const m = DATA.media.find(x=>x.id===id);
      if(!m) return;

      const badge = `${m.kind==="photo"?"Zdjęcie":"Wideo"} · ${m.year || "—"}`;

      let mediaHTML = "";
      if(m.kind==="photo"){
        mediaHTML = m.src
          ? `<div class="media"><img src="${esc(m.src)}" alt="${esc(m.title)}"></div>`
          : `<div class="note">Ustaw <code>src</code> dla tego zdjęcia w <code>DATA.media</code>.</div>`;
      } else {
        mediaHTML = m.src
          ? `<div class="media"><video controls src="${esc(m.src)}"></video></div>`
          : `<div class="note">Ustaw <code>src</code> dla tego wideo (np. <code>video/film.mp4</code>) w <code>DATA.media</code>.</div>`;
      }

      openModal(`${m.title} · ${badge}`, `
        ${mediaHTML}
        <div style="margin-top:10px">
          <div class="muted">${esc(m.caption || "")}</div>
          <div class="krow">${(m.tags||[]).map(t=>`<span class="k">#${esc(t)}</span>`).join("")}</div>
        </div>
      `);
    };
  });

  // kopiowanie maila
  const copyBtn = $("#copyEmail");
  if(copyBtn){
    copyBtn.onclick = async ()=>{
      try{
        await navigator.clipboard.writeText(DATA.submit.email);
        copyBtn.textContent = "Skopiowano ✓";
        setTimeout(()=>copyBtn.textContent="Skopiuj adres", 1200);
      }catch{
        alert("Nie udało się skopiować. Adres: " + DATA.submit.email);
      }
    };
  }
}

function render(){
  // tab z URL
  state.tab = (location.hash || "#start").replace("#","");
  setActiveTab(state.tab);

  const app = $("#app");
  let html = "";

  if(state.tab==="start") html = renderStart(DATA);
  else if(state.tab==="historia") html = renderHistoria(DATA, state);
  else if(state.tab==="wspomnienia") html = renderEntries(DATA, state, "historia", "Wspomnienia");
  else if(state.tab==="sny") html = renderEntries(DATA, state, "sen", "Sny");
  else if(state.tab==="galeria") html = renderGaleria(DATA, state);
  else if(state.tab==="przeslij") html = renderPrzeslij(DATA);
  else { location.hash = "#start"; return; }

  app.innerHTML = html;
  hydrateControls();
}

function init(){
  initModal();
  buildHero(DATA);
  buildNav(DATA);
  render();
  window.addEventListener("hashchange", render);
}

init();
