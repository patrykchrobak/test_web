const DATA = {
  person: {
    name: "Marta Chrobak",
    years: "1975–2025",
    tagline: "Ciepła, odważna, zawsze blisko ludzi.",
    quote: { text: "Najważniejsze rzeczy są proste: obecność, rozmowa i czułość.", by: "— ulubione zdanie" },
    quickFacts: ["Rodzina", "Przyjaciele", "Pasje", "Wspomnienia", "Zdjęcia i filmy"]
  },
  tabs: [
    { id:"start", label:"Start" },
    { id:"historia", label:"Historia życia" },
    { id:"wspomnienia", label:"Wspomnienia" },
    { id:"sny", label:"Sny" },
    { id:"galeria", label:"Galeria" },
    { id:"przeslij", label:"Prześlij materiały" }
  ],
  authors: [
    { id:"patryk", name:"Patryk", relation:"syn" },
    { id:"ewelina", name:"Ewelina", relation:"córka" },
    { id:"patrycja", name:"Patrycja", relation:"córka" },
    { id:"witold", name:"Witold", relation:"mąż" },

    { id:"ania", name:"Ania", relation:"córka" },
    { id:"marek", name:"Marek", relation:"brat" },
    { id:"basia", name:"Basia", relation:"przyjaciółka" }
  ],
  life: [
    { year:"1952", title:"Narodziny", text:"Urodziła się w ...", tags:["rodzina"] },
    { year:"1974", title:"Studia i pierwsza praca", text:"Zaczęła ...", tags:["praca"] },
    { year:"1982", title:"Dom pełen ludzi", text:"Najbardziej lubiła ...", tags:["rodzina","dom"] },
    { year:"2001", title:"Nowa pasja", text:"Odkryła ...", tags:["pasja"] }
  ],
  entries: [
    {
      id:"e1", type:"historia", authorId:"ania", year:"1998",
      title:"Pierwsza wspólna podróż",
      tags:["wakacje","śmiech"],
      text:"Krótka historia... (kliknij, żeby zobaczyć pełny podgląd)."
    },
    {
      id:"e2", type:"historia", authorId:"basia", year:"2008",
      title:"Jak pomagała ludziom",
      tags:["serce","codzienność"],
      text:"Pamiętam, że zawsze..."
    },
    {
      id:"e3", type:"sen", authorId:"marek", year:"2024",
      title:"Sen o pożegnaniu",
      tags:["pożegnanie","spokój"],
      text:"Śniło mi się, że..."
    },
    {
      id:"e4", type:"sen", authorId:"ania", year:"2025",
      title:"Sen o ogrodzie",
      tags:["nadzieja"],
      text:"Był ogród i..."
    }
  ],
  media: [
    // Zdjęcia: wrzuć pliki obok index.html i ustaw src np. "img/01.jpg"
    { id:"m1", kind:"photo", title:"Uśmiech", year:"2005", tags:["rodzina"], src:"", caption:"Podpis zdjęcia (opcjonalnie)" },
    { id:"m2", kind:"photo", title:"Uśmiech", year:"2005", tags:["rodzina"], src:"img/portret.png", caption:"Podpis zdjęcia (opcjonalnie)" },
    { id:"m3", kind:"photo", title:"Wakacje", year:"1998", tags:["wakacje"], src:"", caption:"Nad jeziorem..." },

    // Wideo: lokalny plik mp4 (bez backendu najlepiej lokalnie) np. "video/film.mp4"
    { id:"v1", kind:"video", title:"Krótki film", year:"2012", tags:["święta"], src:"video/lulu.mp4", caption:"Opis filmu..." }
  ],
  submit: {
    email: "patrykchrobak@o2.pl",
    subject: "Wspomnienie - " + "Imię i Nazwisko",
    instructions: [
      "Napisz: kto opowiada (imię + relacja).",
      "Dodaj: typ (historia / sen / opis zdjęcia / opis filmu).",
      "Jeśli możesz: rok/okres i krótki tytuł.",
      "Załącz zdjęcia/filmy ręcznie w mailu (przycisk otworzy pocztę).",
      "Dopisz zgodę na publikację: tak/nie."
    ]
  }
};