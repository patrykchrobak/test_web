export const state = {
  tab: (location.hash || "#start").replace("#",""),
  filterAuthor: "all",
  filterTag: "all",
  search: "",
  mediaKind: "all"
};
