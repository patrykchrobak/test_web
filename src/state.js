const STORAGE_KEY = "pamiec_entries_v1";

export const state = {
  view: "start",         // start | historia | entries | galeria | przeslij
  previewId: null,       // do modala
  entries: []            // wczytywane z localStorage, fallback z data.js w main.js
};

export function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveEntries(entries) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch {
    // nic
  }
}

export function setView(view) {
  state.view = view;
}

export function setPreview(id) {
  state.previewId = id;
}

export function upsertEntry(entry) {
  const idx = state.entries.findIndex(e => e.id === entry.id);
  if (idx === -1) state.entries.unshift(entry);
  else state.entries[idx] = entry;
  saveEntries(state.entries);
}

export function deleteEntry(id) {
  state.entries = state.entries.filter(e => e.id !== id);
  saveEntries(state.entries);
}
