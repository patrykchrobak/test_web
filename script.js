/** =========================
 *  APP
 *  ========================= */
const $ = (sel, el=document) => el.querySelector(sel);
const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

const state = {
  tab: (location.hash || "#start").replace("#",""),
  filterAuthor: "all",
  filterTag: "all",
  search: "",
  mediaKind: "all"
};

function esc(s){ return String(s).replace(/[&<>"']/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m])); }

function uniq(arr){ return [...new Set(arr)]; }

function buildHero(){
  const p = DATA.person;
  $("#brandTitle").textContent = p.name;
  $("#brandSubtitle").textContent = p.years + " · " + p.tagline;

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

function buildNav(){
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

function setActiveTab(){
  $$(".tabbtn").forEach(b => b.classList.toggle("active", b.dataset.tab === state.tab));
}

function authorLabel(id){
  const a = DATA.authors.find(x=>x.id===id);
  return a ? `${a.name} (${a.relation})` : "—";
}

function allTags(){
  const fromEntries = DATA.entries.flatMap(e=>e.tags||[]);
  const fromLife = DATA.life.flatMap(x=>x.tags||[]);
  const fromMedia = DATA.media.flatMap(m=>m.tags||[]);
  return uniq([...fromEntries, ...fromLife, ...fromMedia]).sort((a,b)=>a.localeCompare(b,"pl"));
}

function toolbarHTML({showAuthor=true, showTag=true, showSearch=true, extraRight=""}={}){
  const tags = allTags();
  return `
    <div class="toolbar">
      <div class="controls">
        ${showAuthor ? `
          <select id="authorSel" aria-label="Filtr: kto opowiada">
            <option value="all">Wszyscy opowiadający</option>
            ${DATA.authors.map(a=>`<option value="${a.id}">${esc(a.name)} (${esc(a.relation)})</option>`).join("")}
          </select>
        ` : ""}
        ${showSearch ? `<input id="searchInp" placeholder="Szukaj tytułu lub treści…" aria-label="Szukaj" />` : ""}
      </div>
      <div class="controls">${extraRight}</div>
    </div>
  `;
}

function debounce(fn, delay = 250){
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), delay);
  };
}


function renderStart(){
  const p = DATA.person;
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
          Witaj na stronie poświęconej pamięci <b>${esc(p.name)}</b> (${esc(p.years)}).
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
          Kliknij osobę, a przejdziesz do <b>Wspomnień</b>
        </div>
      </div>
    </section>
  `;
}

function renderHistoria(){
  const tags = allTags();
  const tagChips = ["all", ...tags];
  const rows = DATA.life
    .filter(x => state.filterTag==="all" || (x.tags||[]).includes(state.filterTag))
    .map(x=>`
      <div class="item" data-life="${esc(x.year)}|${esc(x.title)}">
        <div class="l">
          <h4>${esc(x.year)} · ${esc(x.title)}</h4>
          <p>${esc(x.text)}</p>
        </div>
      </div>
    `).join("");

  return `
    <section class="card">
      <div class="hd">
        <div>
          <h3>Historia życia</h3>
          <div class="sub">Oś czasu i rozdziały</div>
        </div>
        <span class="badge">Oś</span>
      </div>

      <div class="bd">
        <div class="list">${rows || `<div class="muted">Brak wpisów dla tego filtra.</div>`}</div>
      </div>
    </section>
  `;
}

function filteredEntries(type){
  const q = state.search.trim().toLowerCase();
  return DATA.entries
    .filter(e => e.type === type)
    .filter(e => state.filterAuthor==="all" || e.authorId === state.filterAuthor)
    .filter(e => state.filterTag==="all" || (e.tags||[]).includes(state.filterTag))
    .filter(e => !q || (e.title + " " + e.text).toLowerCase().includes(q))
    .sort((a,b)=> String(b.year).localeCompare(String(a.year), "pl"));
}

function renderEntries(type, titleLabel){
  const list = filteredEntries(type).map(e=>{
    const maxLen = 150;
    const text = e.text.length > maxLen ? e.text.substring(0, maxLen) + "..." : e.text;
    return `
      <div class="item" data-entry="${esc(e.id)}">
        <div class="l">
          <h4>${esc(e.title)}</h4>
          <p>${esc(text)}</p>
        </div>
        <span class="badge">${esc(e.year)}</span>
      </div>
    `;
  }).join("");

  return `
    <section class="card">
      <div class="hd">
        <div>
          <h3>${esc(titleLabel)}</h3>
          <div class="sub">${type==="historia" ? "Historie rodziny i przyjaciół" : "Sny osób bliskich"}</div>
        </div>
        <span class="badge">${type}</span>
      </div>

      ${toolbarHTML({
        showAuthor:true, showTag:true, showSearch:true
      })}

      <div class="bd">
        <div class="list">${list || `<div class="muted">Brak wpisów dla tych filtrów.</div>`}</div>
      </div>
    </section>
  `;
}

function renderGaleria(){
  const q = state.search.trim().toLowerCase();
  const list = DATA.media
    .filter(m => state.mediaKind==="all" || m.kind===state.mediaKind)
    .filter(m => state.filterTag==="all" || (m.tags||[]).includes(state.filterTag))
    .filter(m => !q || (m.title + " " + (m.caption||"")).toLowerCase().includes(q))
    .sort((a,b)=> String(b.year).localeCompare(String(a.year),"pl"))
    .map(m=>{
      const badge = `${m.kind==="photo"?"Zdjęcie":"Wideo"} · ${m.year || "—"}`;
      const hasImg = m.kind==="photo" && m.src;
      return `
        <div class="thumb" data-media="${esc(m.id)}">
          <div class="ph">
            ${hasImg ? `<img src="${esc(m.src)}" alt="${esc(m.title)}" loading="lazy">` : `
              <div style="padding:14px; text-align:center">
                <div style="font-weight:600; margin-bottom:6px">${esc(m.title)}</div>
                <div class="muted">${esc(badge)}</div>
              </div>
            `}
          </div>
          <div class="cap">
            <b>${esc(m.title)}</b>
            <small>${esc(badge)}</small>
          </div>
        </div>
      `;
    }).join("");

  return `
    <section class="card">
      <div class="hd">
        <div>
          <h3>Galeria</h3>
          <div class="sub">Zdjęcia i filmy</div>
        </div>
        <span class="badge">Media</span>
      </div>

      ${toolbarHTML({
        showAuthor:false, showTag:true, showSearch:true,
        extraRight: `
          <select id="mediaKindSel" aria-label="Typ mediów">
            <option value="all">Wszystko</option>
            <option value="photo">Zdjęcia</option>
            <option value="video">Wideo</option>
          </select>
        `
      })}

      <div class="bd">
        <div class="gallery">${list || `<div class="muted">Brak mediów dla tych filtrów.</div>`}</div>
        <div style="margin-top:12px">
        </div>
      </div>
    </section>
  `;
}

function mailtoHref(){
  const s = DATA.submit;
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
  return `mailto:${enc(s.email)}?subject=${enc(s.subject)}&body=${enc(body)}`;
}

function renderPrzeslij(){
  const s = DATA.submit;
  return `
    <section class="card">
      <div class="hd">
        <div>
          <h3>Prześlij</h3>
          <div class="sub">Wysyłanie materiałów przez e-mail</div>
        </div>
        <span class="badge">mail</span>
      </div>
      <div class="bd">

        <div class="note">
          <b>Adres:</b> ${esc(s.email)}<br/>
          <b>Prośba:</b>
          <ul style="margin:8px 0 0; padding-left:18px">
            ${s.instructions.map(x=>`<li>${esc(x)}</li>`).join("")}
          </ul>
        </div>

        <div style="margin-top:12px; display:flex; gap:10px; flex-wrap:wrap">
          <a class="btn" href="${mailtoHref()}">Wyślij e-mail</a>
          <button class="x" type="button" id="copyEmail">Skopiuj adres</button>
        </div>
      </div>
    </section>
  `;
}

function renderDrzewo(){
  const parents = (DATA.family || []).filter(x => ["tata","mama","ojciec","matka"].includes(String(x.relation||"").toLowerCase()));

  const p = DATA.person;

  // prosta klasyfikacja na podstawie "relation"
  const norm = (s)=>String(s||"").toLowerCase();

  const spouse = DATA.authors.filter(a => ["mąż","żona","partner","partnerka"].includes(norm(a.relation)));
  const children = DATA.authors.filter(a => ["syn","córka","dziecko"].includes(norm(a.relation)));
  const siblings = DATA.authors.filter(a => ["brat","siostra","rodzeństwo"].includes(norm(a.relation)));
  const others = DATA.authors.filter(a =>
    !spouse.includes(a) && !children.includes(a) && !siblings.includes(a)
  );

  const years = (p) => {
    const b = p?.born ? String(p.born) : "";
    const d = p?.died ? String(p.died) : "";
    if (b && d) return `${b}–${d}`;
    if (b && !d) return `${b}–`;
    return "";
  };

  const node = (title, subtitle="", yearsTxt="") => `
    <div class="tree-node">
      <div class="tree-title">${esc(title)}</div>
      ${subtitle ? `<div class="tree-sub">${esc(subtitle)}</div>` : ""}
      ${yearsTxt ? `<div class="tree-years">${esc(yearsTxt)}</div>` : ""}
    </div>
  `;


  return `
    <section class="card">
      <div class="hd">
        <div>
          <h3>Drzewo genealogiczne</h3>
          <div class="sub">Rodzina i bliscy</div>
        </div>
        <span class="badge">rodzina</span>
      </div>

      <div class="bd">
        <div class="tree-wrap">
        ${parents.length ? `
          <div class="tree-section">
            <div class="tree-section-title">Rodzice</div>
            <div class="tree-row">
              ${parents.map(p => node(p.name, p.relation, years(p))).join("")}
            </div>
          </div>
          <div class="tree-line"></div>
        ` : ""}

          <!-- Rząd: małżonek + osoba -->
          <div class="tree-row">
            ${node(p.name, p.years)}
            ${spouse.length ? spouse.map(s => node(s.name, s.relation)).join("") : ""}
          </div>

          ${children.length ? `
            <div class="tree-line"></div>
            <div class="tree-row">
              ${children.map(c => node(c.name, c.relation)).join("")}
            </div>
          ` : `<div class="muted" style="margin-top:10px">Brak dzieci w danych.</div>`}

          <!-- Rodzeństwo -->
          ${siblings.length ? `
            <div class="tree-section">
              <div class="tree-section-title">Rodzeństwo</div>
              <div class="tree-row">
                ${siblings.map(s => node(s.name, s.relation)).join("")}
              </div>
            </div>
          ` : ""}

          <!-- Inne osoby (np. przyjaciele) -->
          ${others.length ? `
            <div class="tree-section">
              <div class="tree-section-title">Inne osoby</div>
              <div class="tree-row">
                ${others.map(o => node(o.name, o.relation)).join("")}
              </div>
            </div>
          ` : ""}

          <div class="note" style="margin-top:12px">
          </div>

        </div>
      </div>
    </section>
  `;
}

function render(){
  // zapamiętaj fokus i pozycję kursora PRZED przebudową DOM
  const active = document.activeElement;
  const focusId = active && active.id ? active.id : null;
  const selStart = active && typeof active.selectionStart === "number" ? active.selectionStart : null;
  const selEnd   = active && typeof active.selectionEnd === "number" ? active.selectionEnd : null;

  setActiveTab();

  const app = $("#app");
  let html = "";
  if(state.tab==="start") html = renderStart();
  else if(state.tab==="historia") html = renderHistoria();
  else if(state.tab==="wspomnienia") html = renderEntries("historia","Wspomnienia");
  else if(state.tab==="sny") html = renderEntries("sen","Sny");
  else if(state.tab==="drzewo") html = renderDrzewo();     
  else if(state.tab==="galeria") html = renderGaleria();
  else if(state.tab==="przeslij") html = renderPrzeslij();
  else { state.tab="start"; html = renderStart(); }

  app.innerHTML = html;

  // hydrate controls
  const authorSel = $("#authorSel");
  if(authorSel){ authorSel.value = state.filterAuthor; authorSel.onchange = ()=>{ state.filterAuthor = authorSel.value; render(); }; }

  const tagSel = $("#tagSel");
  if(tagSel){ tagSel.value = state.filterTag; tagSel.onchange = ()=>{ state.filterTag = tagSel.value; render(); }; }

  const searchInp = $("#searchInp");
  if(searchInp){
    searchInp.value = state.search;
    searchInp.oninput = debounce(() => {
      state.search = searchInp.value;
      render();
    }, 250);
  }

  const kindSel = $("#mediaKindSel");
  if(kindSel){ kindSel.value = state.mediaKind; kindSel.onchange = ()=>{ state.mediaKind = kindSel.value; render(); }; }

  // chip clicks
  $$(".chip[data-tag]").forEach(ch=>{
    ch.onclick = ()=>{ state.filterTag = ch.dataset.tag; render(); };
  });

  $$(".chip[data-author]").forEach(ch=>{
    ch.onclick = ()=>{
      state.filterAuthor = ch.dataset.author;
      location.hash = "#wspomnienia";
    };
  });

  // entry modal
  $$(".item[data-entry]").forEach(it=>{
    it.onclick = ()=>{
      const id = it.dataset.entry;
      const e = DATA.entries.find(x=>x.id===id);
      if(!e) return;
      openModal(`${e.type==="historia"?"Wspomnienie":"Sen"} · ${authorLabel(e.authorId)} · ${e.year}`, `
        <div class="card" style="box-shadow:none; margin:0; border-radius:18px">
          <div class="bd">
            <h3 style="margin:0 0 8px; font-size:18px">${esc(e.title)}</h3>
            <div class="muted" style="margin-bottom:10px">${esc(authorLabel(e.authorId))} · ${esc(e.year)}</div>
            <div style="line-height:1.6; font-size:14px">${esc(e.text)}</div>
            <div class="krow">${(e.tags||[]).map(t=>`<span class="k">#${esc(t)}</span>`).join("")}</div>
          </div>
        </div>
      `);
    };
  });

  // media modal
$$(".thumb[data-media]").forEach(t=>{
  t.onclick = ()=>{
    const id = t.dataset.media;
    const m = DATA.media.find(x=>x.id===id);
    if(!m) return;
    const badge = `${m.kind==="photo"?"Zdjęcie":"Wideo"} · ${m.year || ""}`;
    let mediaHTML = "";
    if(m.kind==="photo"){
      mediaHTML = m.src
        ? `<img src="${esc(m.src)}" alt="${esc(m.title)}" style="width: auto; height: auto; max-height: 70vh; max-width: 100%;">`
        : `<div class="note"></div>`;
    } else {
      mediaHTML = m.src
        ? `<video controls src="${esc(m.src)}" style="width: auto; height: auto; max-height: 70vh; max-width: 100%;"></video>`
        : `<div class="note"></div>`;
    }

    openModal(`${m.title} · ${badge}`, `
      <div style="display: flex; justify-content: center; align-items: flex-start;">${mediaHTML}</div>
      <div style="margin-top:10px">
        <div class="muted">${esc(m.caption || "")}</div>
        <div class="krow">${(m.tags||[]).map(t=>`<span class="k">#${esc(t)}</span>`).join("")}</div>
      </div>
    `);
  };
});

  // copy email
  const copyBtn = $("#copyEmail");
  if(copyBtn){
    copyBtn.onclick = async ()=>{
      try{
        await navigator.clipboard.writeText(DATA.submit.email);
        copyBtn.textContent = "Skopiowano ✓";
        setTimeout(()=>copyBtn.textContent="Skopiuj adres", 1200);
      }catch(e){
        alert("Nie udało się skopiować. Adres: " + DATA.submit.email);
      }
    };
  }

    // przywróć fokus PO renderze
  if(focusId){
    const el = document.getElementById(focusId);
    if(el){
      el.focus({ preventScroll: true });
      if(selStart !== null && selEnd !== null && typeof el.setSelectionRange === "function"){
        // przywróć kursor (żeby nie skakał na koniec)
        el.setSelectionRange(selStart, selEnd);
      }
    }
  }
}

function openModal(title, bodyHTML){
  $("#mTitle").textContent = title;
  $("#mBody").innerHTML = bodyHTML;
  $("#modal").classList.add("open");
}

function closeModal(){
  $("#modal").classList.remove("open");
  $("#mBody").innerHTML = "";
}

$("#mClose").onclick = closeModal;
$("#modal").addEventListener("click", (e)=>{ if(e.target.id==="modal") closeModal(); });
window.addEventListener("keydown", (e)=>{ if(e.key==="Escape") closeModal(); });

window.addEventListener("hashchange", ()=>{
  state.tab = (location.hash || "#start").replace("#","");
  render();
});

function init(){
  buildHero();
  buildNav();
  render();
}
init();