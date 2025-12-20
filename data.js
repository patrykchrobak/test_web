const DATA = {
  person: {
    name: "Marta Chrobak",
    years: "1975–2025",
    tagline: "Najukochańsza Żona, Mama, Siostra, Bratowa, Ciocia, Kuzynka, Szwagierka",
    quote: { text: "Tych których się kocha, nie traci się nigdy", by: "Nie pytamy Cię Boże dlaczego Ją zabrałeś, lecz dziękujemy Ci za to, że nam Ją dałeś ❤" },
    quickFacts: ["Rodzina", "Wspomnienia", "Zdjęcia i filmy"]
  },
  tabs: [
    { id:"start", label:"Start" },
    { id:"historia", label:"Historia życia" },
    { id:"wspomnienia", label:"Wspomnienia" },
    { id:"sny", label:"Sny" },

    { id:"drzewo", label:"Drzewo genealogiczne" },

    { id:"galeria", label:"Galeria" },
    { id:"przeslij", label:"Prześlij" }
  ],
  family: [
    { id:"father", name:"Gustaw", relation:"tata", born:1944, died:2011 },
    { id:"mother", name:"Anna", relation:"mama", born:1948, died:2017 }
  ],
  authors: [
    // { id:"gustaw", name:"Gustaw", relation:"tata" },
    // { id:"anna", name:"Anna", relation:"mama" },
    
    { id:"ewelina", name:"Ewelina", relation:"córka" },
    { id:"patrycja", name:"Patrycja", relation:"córka" },
    { id:"patryk", name:"Patryk", relation:"syn" },
    { id:"witold", name:"Witold", relation:"mąż" },

    { id:"agata", name:"Agata", relation:"siostra" },
    { id:"małgorzata", name:"Małgorzata", relation:"siostra" },
    { id:"ewa", name:"Ewa", relation:"siostra" },
    { id:"jadwiga", name:"Jadwiga", relation:"siostra" },
    { id:"agnieszka", name:"Agnieszka", relation:"siostra" },
    { id:"barbara", name:"Barbara", relation:"siostra" },
    { id:"anna", name:"Anna", relation:"siostra" },
    { id:"wanda", name:"Wanda", relation:"siostra" },
    { id:"joanna", name:"Joanna", relation:"siostra" },

    { id:"robert", name:"Robert", relation:"szwagier" }
  ],
  life: [
    { year:"2025", title:"U Boga", text:"W 2025 roku w Rzeszowie powróciła do Boga, spotykając bliskich i oczekując na resztę rodziny." },
    { year:"2001", title:"Rodzina się powiększa", text:"Na świat przyszedł Patryk – trzecie dziecko, które dopełniło rodzinę." },
    { year:"1997", title:"Drugie szczęście", text:"Urodziła się Patrycja, druga córka." },
    { year:"1996", title:"Pierwsze macierzyństwo", text:"Narodziny Eweliny – pierwszego dziecka." },
    { year:"1995", title:"Początek wspólnej drogi", text:"Wzięła ślub z Witoldem, rozpoczynając nowy etap życia." },
    { year:"1975", title:"Początek historii", text:"Przyszła na świat 15 maja 1975 roku w Bochni." },
  ],
  entries: [
    {
      id:"e1", type:"historia", authorId:"ania", year:"1998",
      title:"Pierwsza wspólna podróż",
      text:"Krótka historia... (kliknij, żeby zobaczyć pełny podgląd)."
    },
    {
      id:"e2", type:"historia", authorId:"basia", year:"2008",
      title:"Jak pomagała ludziom",
      text:"Pamiętam, że zawsze..."
    },
    {
      id:"e3", type:"sen", authorId:"marek", year:"2024",
      title:"Sen o pożegnaniu",
      text:"Śniło mi się, że..."
    },
    {
      id:"e4", type:"sen", authorId:"ania", year:"2025",
      title:"Sen o ogrodzie",
      text:"Był ogród i..."
    }
  ],
  media: [
    // Zdjęcia: wrzuć pliki obok index.html i ustaw src np. "img/01.jpg"
    { id:"m2", kind:"photo", title:"Uśmiech", year:"2005", src:"img/portret.png", caption:"Podpis zdjęcia (opcjonalnie)" },

    // Wideo: lokalny plik mp4 (bez backendu najlepiej lokalnie) np. "video/film.mp4"
    { id:"v1", kind:"video", title:"Krótki film", year:"2012", src:"video/lulu.mp4", caption:"Opis filmu..." }
  ],
  submit: {
    email: "patrykchrobak@o2.pl",
    subject: "Wspomnienie - " + "Imię i Nazwisko",
    instructions: [
      "Napisz: kto opowiada (imię + relacja).",
      "Jeśli możesz: rok/okres i krótki tytuł.",
      "Załącz zdjęcia/filmy",
    ]
  }
};