import tkinter as tk
from tkinter import ttk, messagebox
from pathlib import Path
import json, re
from datetime import date

# ----------------------------
# Prosty parser JS -> Python
# ----------------------------
def _strip_js_comments(s: str) -> str:
    # usuń linie komentarzy // ...
    return re.sub(r'^\s*//.*$', '', s, flags=re.M)

def _js_obj_array_to_json_text(body: str) -> str:
    # Zamień "prawie-JS" na JSON:
    # 1) quote keys: id: -> "id":
    # 2) usuń trailing commas
    json_like = body
    json_like = re.sub(r'(\b[A-Za-z_][A-Za-z0-9_]*\b)\s*:', r'"\1":', json_like)
    json_like = re.sub(r',(\s*[}\]])', r'\1', json_like)
    return "[" + json_like.strip() + "]"

def load_js_array(file_path: Path, const_name: str) -> list[dict]:
    raw = file_path.read_text(encoding="utf-8")
    raw = _strip_js_comments(raw)

    m = re.search(rf'\bconst\s+{re.escape(const_name)}\s*=\s*\[(.*)\]\s*;', raw, flags=re.S)
    if not m:
        raise ValueError(f'Nie znalazłem stałej {const_name} w {file_path.name}')

    json_text = _js_obj_array_to_json_text(m.group(1))
    try:
        return json.loads(json_text)
    except json.JSONDecodeError as e:
        start = max(e.pos - 120, 0)
        end = min(e.pos + 120, len(json_text))
        raise ValueError(
            f"Błąd parsowania w {file_path.name}: {e}\nKontekst:\n{json_text[start:end]}"
        ) from e

def save_js_array(file_path: Path, const_name: str, items: list[dict]) -> None:
    def js_string(s: str) -> str:
        return json.dumps(s, ensure_ascii=False)

    preferred_order = ["id", "type", "kind", "authorId", "date", "year", "title", "text", "src", "caption"]

    def format_obj(d: dict) -> str:
        keys = [k for k in preferred_order if k in d]
        for k in d.keys():
            if k not in keys:
                keys.append(k)

        parts = []
        for k in keys:
            v = d[k]
            if isinstance(v, str):
                parts.append(f'{k}: {js_string(v)}')
            elif isinstance(v, bool):
                parts.append(f'{k}: {"true" if v else "false"}')
            elif v is None:
                parts.append(f'{k}: null')
            else:
                parts.append(f'{k}: {v}')
        return "{\n  " + ",\n  ".join(parts) + "\n}"

    formatted_items = ",\n".join(format_obj(x) for x in items)
    out = f'const {const_name} = [\n{formatted_items}\n];\n'
    file_path.write_text(out, encoding="utf-8")

def load_authors_from_data_js(data_js_path: Path) -> list[dict]:
    """
    Pobiera listę DATA.authors z data.js (format JS jak w Twoim pliku).
    Zwraca np. [{id:"witold", name:"Witold", relation:"mąż"}, ...]
    """
    raw = data_js_path.read_text(encoding="utf-8")
    raw = _strip_js_comments(raw)

    m = re.search(r'\bauthors\s*:\s*\[(.*?)\]\s*,', raw, flags=re.S)
    if not m:
        return []

    body = m.group(1).strip()
    # Usuń ewentualne końcowe przecinki i puste linie
    json_text = _js_obj_array_to_json_text(body)

    try:
        return json.loads(json_text)
    except json.JSONDecodeError:
        # Jeśli coś nie gra, zwróć pustą listę zamiast wywalać całą aplikację
        return []

# ----------------------------
# Aplikacja
# ----------------------------
class EditorApp(tk.Tk):
    def __init__(self, base_dir: Path):
        super().__init__()
        self.title("Edytor wspomnień / snów / mediów")
        self.geometry("1020x680")

        self.base_dir = base_dir
        self.authors = load_authors_from_data_js(self.base_dir / "data.js")
        self.author_choices = [a.get("id", "") for a in self.authors if a.get("id")]

        self.sources = {
            "Media": {
                "file": self.base_dir / "media_data.js",
                "const": "MEDIA_DATA",
                "text_field": "caption",
                "title_field": "title",
            },
            "Sny": {
                "file": self.base_dir / "entries_sny.js",
                "const": "DATA_ENTRIES_SNY",
                "text_field": "text",
                "title_field": "title",
            },
            "Wspomnienia": {
                "file": self.base_dir / "entries_wspomnienia.js",
                "const": "DATA_ENTRIES_WSPOMNIENIA",
                "text_field": "text",
                "title_field": "title",
            },
        }

        self.current_source_name = tk.StringVar(value="Wspomnienia")
        self.current_items: list[dict] = []
        self.current_index: int | None = None

        self._build_ui()
        self._load_source()

    def _build_ui(self):
        top = ttk.Frame(self, padding=12)
        top.pack(fill="x")

        ttk.Label(top, text="Wybierz plik:").pack(side="left")
        self.combo = ttk.Combobox(
            top,
            textvariable=self.current_source_name,
            values=list(self.sources.keys()),
            state="readonly",
            width=18
        )
        self.combo.pack(side="left", padx=(8, 16))
        self.combo.bind("<<ComboboxSelected>>", lambda e: self._load_source())

        ttk.Button(top, text="Odśwież", command=self._load_source).pack(side="left")

        main = ttk.Frame(self, padding=(12, 0, 12, 12))
        main.pack(fill="both", expand=True)

        main.columnconfigure(0, weight=1)
        main.columnconfigure(1, weight=3)
        main.rowconfigure(0, weight=1)

        # Left: list
        left = ttk.Frame(main)
        left.grid(row=0, column=0, sticky="nsew", padx=(0, 12))
        left.rowconfigure(1, weight=1)
        left.columnconfigure(0, weight=1)

        ttk.Label(left, text="Wpisy:").grid(row=0, column=0, sticky="w")
        self.listbox = tk.Listbox(left, exportselection=False)
        self.listbox.grid(row=1, column=0, sticky="nsew", pady=(6, 0))
        self.listbox.bind("<<ListboxSelect>>", self._on_select)

        # Right: editor
        right = ttk.Frame(main)
        right.grid(row=0, column=1, sticky="nsew")
        right.columnconfigure(0, weight=1)
        right.rowconfigure(99, weight=1)

        # --- Common fields
        self.id_var = tk.StringVar()
        self.title_var = tk.StringVar()
        self.date_var = tk.StringVar(value=str(date.today()))

        ttk.Label(right, text="ID:").grid(row=0, column=0, sticky="w")
        ttk.Entry(right, textvariable=self.id_var).grid(row=1, column=0, sticky="ew", pady=(2, 10))

        ttk.Label(right, text="Tytuł:").grid(row=2, column=0, sticky="w")
        ttk.Entry(right, textvariable=self.title_var).grid(row=3, column=0, sticky="ew", pady=(2, 10))

        # --- AUTHOR (only for entries)
        self.author_var = tk.StringVar()
        self.author_row_label = ttk.Label(right, text="Autor (authorId):")
        self.author_row_combo = ttk.Combobox(
            right,
            textvariable=self.author_var,
            values=self.author_choices,
            state="readonly"
        )

        # --- MEDIA fields (kind + src)
        self.kind_var = tk.StringVar()
        self.src_var = tk.StringVar()

        self.kind_row_label = ttk.Label(right, text="Rodzaj (kind):")
        self.kind_row_combo = ttk.Combobox(
            right,
            textvariable=self.kind_var,
            values=["photo", "video"],
            state="readonly"
        )

        self.src_row_label = ttk.Label(right, text="Ścieżka (src):")
        self.src_row_entry = ttk.Entry(right, textvariable=self.src_var)

        # --- Date
        ttk.Label(right, text="Data (YYYY-MM-DD) — zapisze też year:").grid(row=10, column=0, sticky="w")
        ttk.Entry(right, textvariable=self.date_var).grid(row=11, column=0, sticky="ew", pady=(2, 10))

        # --- Text
        self.text_label = ttk.Label(right, text="Treść:")
        self.text_label.grid(row=12, column=0, sticky="w")
        self.text = tk.Text(right, height=14, wrap="word")
        self.text.grid(row=13, column=0, sticky="nsew", pady=(2, 0))
        right.rowconfigure(13, weight=1)

        # Buttons
        btns = ttk.Frame(right)
        btns.grid(row=14, column=0, sticky="ew", pady=(12, 0))
        btns.columnconfigure(0, weight=1)
        btns.columnconfigure(1, weight=1)
        btns.columnconfigure(2, weight=1)

        ttk.Button(btns, text="➕ Dodaj nowy", command=self._add_new).grid(row=0, column=0, sticky="ew", padx=(0, 8))
        ttk.Button(btns, text="💾 Zapisz zmiany", command=self._save_selected).grid(row=0, column=1, sticky="ew", padx=8)
        ttk.Button(btns, text="🗑 Usuń", command=self._delete_selected).grid(row=0, column=2, sticky="ew", padx=(8, 0))

        self.hint = ttk.Label(self, padding=(12, 0, 12, 12),
                              text="Tip: wybierz wpis z listy po lewej — wtedy dane pojawią się w edytorze po prawej.")
        self.hint.pack(fill="x")

    def _source_cfg(self):
        return self.sources[self.current_source_name.get()]

    def _layout_optional_fields(self):
        """
        Pokazuje/ukrywa pola zależnie od typu danych.
        """
        src = self.current_source_name.get()

        # najpierw usuń z grid, jeśli były
        for w in (self.author_row_label, self.author_row_combo,
                  self.kind_row_label, self.kind_row_combo,
                  self.src_row_label, self.src_row_entry):
            w.grid_forget()

        if src in ("Sny", "Wspomnienia"):
            # author w rzędach 4-5
            self.author_row_label.grid(row=4, column=0, sticky="w")
            self.author_row_combo.grid(row=5, column=0, sticky="ew", pady=(2, 10))
            self.text_label.configure(text="Treść wpisu:")

        if src == "Media":
            # kind i src w rzędach 4-7
            self.kind_row_label.grid(row=4, column=0, sticky="w")
            self.kind_row_combo.grid(row=5, column=0, sticky="ew", pady=(2, 10))

            self.src_row_label.grid(row=6, column=0, sticky="w")
            self.src_row_entry.grid(row=7, column=0, sticky="ew", pady=(2, 10))
            self.text_label.configure(text="Podpis (caption):")

    def _load_source(self):
        self._layout_optional_fields()

        cfg = self._source_cfg()
        try:
            self.current_items = load_js_array(cfg["file"], cfg["const"])
        except Exception as e:
            messagebox.showerror("Błąd wczytywania", str(e))
            self.current_items = []

        self.current_index = None
        self._refresh_list()
        self._clear_editor()

    def _refresh_list(self):
        self.listbox.delete(0, tk.END)
        cfg = self._source_cfg()
        tfield = cfg["title_field"]
        for i, item in enumerate(self.current_items):
            title = item.get(tfield, "")
            item_id = item.get("id", f"#{i+1}")
            self.listbox.insert(tk.END, f"{item_id} — {title}")

    def _clear_editor(self):
        self.id_var.set("")
        self.title_var.set("")
        self.date_var.set(str(date.today()))
        self.author_var.set(self.author_choices[0] if self.author_choices else "")
        self.kind_var.set("photo")
        self.src_var.set("")
        self.text.delete("1.0", tk.END)

    def _on_select(self, _event=None):
        sel = self.listbox.curselection()
        if not sel:
            return
        idx = int(sel[0])
        self.current_index = idx

        cfg = self._source_cfg()
        item = self.current_items[idx]

        self.id_var.set(item.get("id", ""))
        self.title_var.set(item.get(cfg["title_field"], ""))

        if "date" in item and item["date"]:
            self.date_var.set(item["date"])
        else:
            y = item.get("year", "")
            if y:
                self.date_var.set(f"{y}-01-01")
            else:
                self.date_var.set(str(date.today()))

        # author
        if self.current_source_name.get() in ("Sny", "Wspomnienia"):
            self.author_var.set(item.get("authorId", self.author_choices[0] if self.author_choices else ""))

        # media fields
        if self.current_source_name.get() == "Media":
            self.kind_var.set(item.get("kind", "photo"))
            self.src_var.set(item.get("src", ""))

        self.text.delete("1.0", tk.END)
        self.text.insert("1.0", item.get(cfg["text_field"], ""))

    def _validate_date(self, s: str) -> bool:
        return bool(re.fullmatch(r"\d{4}-\d{2}-\d{2}", s.strip()))

    def _apply_editor_to_item(self, item: dict):
        cfg = self._source_cfg()
        d = self.date_var.get().strip()

        if not self._validate_date(d):
            raise ValueError("Data musi mieć format YYYY-MM-DD (np. 2025-12-21).")

        item["id"] = self.id_var.get().strip() or item.get("id", "")
        item[cfg["title_field"]] = self.title_var.get().strip()

        item["date"] = d
        item["year"] = d[:4]

        # authorId dla wpisów
        if self.current_source_name.get() in ("Sny", "Wspomnienia"):
            item["authorId"] = self.author_var.get().strip()

        # kind + src dla mediów
        if self.current_source_name.get() == "Media":
            item["kind"] = self.kind_var.get().strip() or "photo"
            item["src"] = self.src_var.get().strip()

        item[cfg["text_field"]] = self.text.get("1.0", tk.END).rstrip()

    def _add_new(self):
        cfg = self._source_cfg()

        prefix = {"Media": "m", "Sny": "s", "Wspomnienia": "h"}.get(self.current_source_name.get(), "x")
        existing_ids = {x.get("id") for x in self.current_items}
        n = 1
        new_id = f"{prefix}{n}"
        while new_id in existing_ids:
            n += 1
            new_id = f"{prefix}{n}"

        item = {
            "id": new_id,
            cfg["title_field"]: "",
            cfg["text_field"]: "",
            "date": str(date.today()),
            "year": str(date.today().year),
        }

        if self.current_source_name.get() == "Media":
            item.setdefault("kind", "photo")
            item.setdefault("src", "")
            item.setdefault("caption", "")

        if self.current_source_name.get() in ("Sny", "Wspomnienia"):
            item.setdefault("type", "sen" if self.current_source_name.get() == "Sny" else "historia")
            item.setdefault("authorId", self.author_choices[0] if self.author_choices else "marek")

        self.current_items.insert(0, item)
        self._refresh_list()
        self.listbox.selection_set(0)
        self.listbox.see(0)
        self._on_select()

    def _save_selected(self):
        if self.current_index is None:
            messagebox.showinfo("Brak wyboru", "Wybierz wpis z listy po lewej.")
            return

        cfg = self._source_cfg()
        try:
            item = self.current_items[self.current_index]
            self._apply_editor_to_item(item)
        except Exception as e:
            messagebox.showerror("Nie zapisano", str(e))
            return

        try:
            save_js_array(cfg["file"], cfg["const"], self.current_items)
        except Exception as e:
            messagebox.showerror("Błąd zapisu", str(e))
            return

        self._refresh_list()
        messagebox.showinfo("OK", f"Zapisano zmiany do {cfg['file'].name}")

    def _delete_selected(self):
        if self.current_index is None:
            messagebox.showinfo("Brak wyboru", "Wybierz wpis z listy po lewej.")
            return

        if not messagebox.askyesno("Potwierdź", "Usunąć zaznaczony wpis?"):
            return

        cfg = self._source_cfg()
        del self.current_items[self.current_index]
        self.current_index = None

        try:
            save_js_array(cfg["file"], cfg["const"], self.current_items)
        except Exception as e:
            messagebox.showerror("Błąd zapisu", str(e))
            return

        self._refresh_list()
        self._clear_editor()
        messagebox.showinfo("OK", f"Usunięto i zapisano do {cfg['file'].name}")

def main():
    base_dir = Path(__file__).resolve().parent
    app = EditorApp(base_dir)
    app.mainloop()

if __name__ == "__main__":
    main()
