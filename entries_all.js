// Agregator wpisów (wspomnienia + sny)
// Edytuj treści w: entries_wspomnienia.js i entries_sny.js

const DATA_ENTRIES_ALL = [
  ...(typeof DATA_ENTRIES_WSPOMNIENIA !== "undefined" ? DATA_ENTRIES_WSPOMNIENIA : []),
  ...(typeof DATA_ENTRIES_SNY !== "undefined" ? DATA_ENTRIES_SNY : [])
];
