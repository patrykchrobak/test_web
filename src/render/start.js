export function renderStart() {
  return `
    <div class="grid">
      <div class="card">
        <h2>Jak edytować treści?</h2>
        <p><b>Opcja A:</b> wpisy w <code>src/data.js</code> (na stałe w repo).</p>
        <p><b>Opcja B:</b> dodawaj wpisy w „Prześlij” – zapiszą się w <b>localStorage</b> Twojej przeglądarki.</p>
        <div class="hr"></div>
        <h2>GitHub Pages — najważniejsze zasady</h2>
        <p>1) <code>&lt;script type="module" src="./src/main.js"&gt;</code></p>
        <p>2) Importy: zawsze względne i z <code>.js</code> (np. <code>import ... from "./render/nav.js"</code>)</p>
        <p>3) Nie używaj ścieżek zaczynających się od <code>/</code></p>
      </div>

      <div class="card">
        <h2>Co dalej?</h2>
        <p>Dodaj swoje pliki do <code>./img</code> i <code>./video</code> (foldery obok index.html), a potem używaj ich ścieżek typu <code>./img/plik.jpg</code>.</p>
        <div class="hr"></div>
        <p class="small">Jeśli wrzucisz repo na GitHub Pages jako <code>.../test_web/</code>, wszystko nadal działa, bo ścieżki są względne.</p>
      </div>
    </div>
  `;
}
