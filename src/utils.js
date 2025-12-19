export const $ = (sel, el=document) => el.querySelector(sel);
export const $$ = (sel, el=document) => [...el.querySelectorAll(sel)];

export function esc(s){
  return String(s).replace(/[&<>"']/g, m => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[m]));
}

export const uniq = (arr) => [...new Set(arr)];

export function allTags(DATA){
  const fromEntries = DATA.entries.flatMap(e=>e.tags||[]);
  const fromLife = DATA.life.flatMap(x=>x.tags||[]);
  const fromMedia = DATA.media.flatMap(m=>m.tags||[]);
  return uniq([...fromEntries, ...fromLife, ...fromMedia]).sort((a,b)=>a.localeCompare(b,"pl"));
}

export function authorLabel(DATA, id){
  const a = DATA.authors.find(x=>x.id===id);
  return a ? `${a.name} (${a.relation})` : "—";
}
