import { initialEntries } from "./data.js";
import { state, loadEntries, saveEntries, setView, upsertEntry, deleteEntry } from "./state.js";
import { qs } from "./utils.js";
import { ensureModal, openModal } from "./modal.js";

import { renderNav } from "./render/nav.js";
import { renderHero } from "./render/hero.js";
import { renderStart } from "./render/start.js";
import { renderHistoria } from "./render/historia.js";
import { renderEntries, filterEntries, renderEntriesList } from "./render/entries.js";
import { renderGaleria } from "./render/galeria.js";
import { renderPrzeslij } from "./render/przeslij.js";

bootstrap();
ensureModal();

function bootstrap() {
  // 1) Spróbuj wczytać z localStorage
  const saved = loadEntries();

  // 2) Jeśli brak — użyj danych startowych
  state.entries = saved ?? initialEntries;
  if (!saved) saveEntries(state.entries);

  mount();
  bindGlobalHandlers();
  render();
}

function mount() {
  const app = qs("#app");
  app.innerHTML = `
    ${renderNav(state.view)}
    <div class="container">
      <div id="heroSlot">${renderHero()}</div>
      <div style="height:14px"></div>
      <div id="viewSlot"></div>
    </div>
  `;
  updateKpis();
}

function bindGlobalHandlers() {
  // Nawigacja
  document.addEventListener("click", (e) => {
    const tab = e.target.closest("[data-view]");
    if (tab) {
      setView(tab.dataset.view);
      rerenderNav();
      render();
      return;
    }

    // Reset localStorage
    if (e.target && e.target.id === "resetStorage") {
      localStorage.removeItem("pamiec_entries_v1");
      state.entries = initialEntries;
      saveEntries(state.entries);
      updateKpis();
      render();
      return;
    }

    // Actions w entries
    const actionBtn = e.target.closest("[data-action]");
    if (actionBtn) {
      const action = actionBtn.dataset.action;
      const item = actionBtn.closest(".item[data-id]");
      const id = item?.dataset?.id;
      if (!id) return;

      const entry = state.entries.find(x => x.id === id);
      if (action === "preview" && entry) {
        openModal(entry);
      }
      if (action === "delete") {
        deleteEntry(id);
        updateKpis();
        render();
      }
    }
  });

  // Szukanie (delegacja — działa po renderach)
  document.addEventListener("input", (e) => {
    if (e.target && e.target.id === "search") {
      const q = e.target.value;
      const filtered = filterEntries(state.entries, q);
      const list = qs("#entriesList");
      if (list) list.innerHTML = renderEntriesList(filtered);
    }
  });

  // Formularz
  document.addEventListener("click", (e) => {
    if (e.target?.id === "clearForm") {
      setForm("", "", "", "");
      return;
    }

    if (e.target?.id === "saveEntry") {
      const title = qs("#fTitle")?.value?.trim() ?? "";
      const date  = qs("#fDate")?.value?.trim() ?? "";
      const tags  = (qs("#fTags")?.value ?? "").split(",").map(s => s.trim()).filter(Boolean);
      const text  = qs("#fText")?.value?.trim() ?? "";

      if (!title) {
        alert("Dodaj tytuł.");
        return;
      }

      const entry = {
        id: cryptoId(),
        title,
        date,
        tags,
        text,
        media: []
      };

      upsertEntry(entry);
      updateKpis();
      setForm("", "", "", "");
      setView("entries");
      rerenderNav();
      render();
    }
  });
}

function render() {
  const slot = qs("#viewSlot");
  if (!slot) return;

  if (state.view === "start") slot.innerHTML = renderStart();
  else if (state.view === "historia") slot.innerHTML = renderHistoria(state.entries);
  else if (state.view === "entries") slot.innerHTML = renderEntries(state.entries);
  else if (state.view === "galeria") slot.innerHTML = renderGaleria(state.entries);
  else if (state.view === "przeslij") slot.innerHTML = renderPrzeslij();
  else slot.innerHTML = renderStart();

  updateKpis();
}

function rerenderNav() {
  const app = qs("#app");
  const nav = qs(".nav", app);
  if (nav) nav.outerHTML = renderNav(state.view);
}

function updateKpis() {
  const entries = state.entries ?? [];
  const media = entries.reduce((acc, e) => acc + ((e.media ?? []).length), 0);
  const tagsSet = new Set(entries.flatMap(e => e.tags ?? []));

  const kE = qs("#kpiEntries");
  const kM = qs("#kpiMedia");
  const kT = qs("#kpiTags");

  if (kE) kE.textContent = String(entries.length);
  if (kM) kM.textContent = String(media);
  if (kT) kT.textContent = String(tagsSet.size);
}

function setForm(title, date, tags, text) {
  const t = qs("#fTitle"); if (t) t.value = title;
  const d = qs("#fDate");  if (d) d.value = date;
  const g = qs("#fTags");  if (g) g.value = tags;
  const x = qs("#fText");  if (x) x.value = text;
}

function cryptoId() {
  // fallback jeśli crypto.randomUUID niedostępne
  return (crypto?.randomUUID?.() ?? (Math.random().toString(16).slice(2) + Date.now().toString(16)));
}
