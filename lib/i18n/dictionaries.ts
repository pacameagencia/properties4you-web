import type { Locale } from "./config";

export type Dictionary = {
  nav: { home: string; properties: string; about: string };
  hero: {
    kicker: string;
    title: string;
    titleAccent: string;
    subtitle: string;
    ctaProperties: string;
    ctaAbout: string;
    scroll: string;
  };
  stats: { sun: string; developments: string; warranty: string; energy: string };
  firm: { kicker: string; title: string; body: string };
  featured: { kicker: string; title: string; subtitle: string; viewAll: string; collection: string };
  destination: { kicker: string; title: string; body: string };
  cta: { title: string; body: string; button: string };
  card: { from: string; view: string; forSale: string; reserved: string; sold: string };
  property: {
    back: string;
    description: string;
    features: string;
    location: string;
    gallery: string;
    viewGallery: string;
    virtualTour: string;
    openMaps: string;
    from: string;
    ref: string;
    bedrooms: string;
    bathrooms: string;
    area: string;
    plot: string;
    type: string;
    energy: string;
    interested: string;
    interestedBody: string;
    contact: string;
    prev: string;
    next: string;
    noResults: string;
  };
  filters: {
    all: string;
    zone: string;
    type: string;
    bedrooms: string;
    priceUp: string;
    priceDown: string;
    sort: string;
    results: string;
  };
  stories: { reply: string; send: string; interested: string; tapHint: string };
  types: Record<string, string>;
  status: Record<string, string>;
  about: { kicker: string; title: string; body: string };
  footer: { tagline: string; nav: string; contact: string; rights: string; disclaimer: string };
};

const es: Dictionary = {
  nav: { home: "Inicio", properties: "Propiedades", about: "Nosotros" },
  hero: {
    kicker: "Costa Blanca · España",
    title: "Tu hogar bajo la luz",
    titleAccent: "del Mediterráneo",
    subtitle:
      "Villas y apartamentos de obra nueva en la Costa Blanca, presentados como merecen.",
    ctaProperties: "Ver propiedades",
    ctaAbout: "Conócenos",
    scroll: "Desliza",
  },
  stats: {
    sun: "Días de sol al año",
    developments: "Promociones de obra nueva",
    warranty: "Años de garantía estructural",
    energy: "Certificado energético",
  },
  firm: {
    kicker: "La firma",
    title:
      "No vendemos casas. Creamos el escenario donde comienza una nueva vida frente al Mediterráneo.",
    body: "Cada propiedad de nuestra cartera se elige por su arquitectura, su luz y su ubicación. Obra nueva de alto nivel en los enclaves más codiciados de la Costa Blanca.",
  },
  featured: {
    kicker: "Obra nueva · En venta",
    title: "Propiedades destacadas",
    subtitle:
      "Una selección de nuestra cartera. Toca cualquier vivienda para entrar en su ficha completa.",
    viewAll: "Ver todas las propiedades",
    collection: "Un paseo por la colección",
  },
  destination: {
    kicker: "El destino",
    title: "Vivir en la Costa Blanca",
    body: "Una de las costas más luminosas de Europa, elegida cada año por miles de compradores que buscan calidad de vida, clima y mar.",
  },
  cta: {
    title: "¿Buscas tu lugar frente al mar?",
    body: "Cuéntanos qué imaginas y te acompañamos, en tu idioma, en cada paso.",
    button: "Hablar con nosotros",
  },
  card: { from: "Desde", view: "Ver propiedad", forSale: "En venta", reserved: "Reservada", sold: "Vendida" },
  property: {
    back: "Volver a propiedades",
    description: "Descripción",
    features: "Calidades destacadas",
    location: "Ubicación",
    gallery: "Galería",
    viewGallery: "Ver galería completa",
    virtualTour: "Tour virtual",
    openMaps: "Abrir en Google Maps",
    from: "Desde",
    ref: "Ref.",
    bedrooms: "Dormitorios",
    bathrooms: "Baños",
    area: "Superficie",
    plot: "Parcela",
    type: "Tipo",
    energy: "Calificación energética",
    interested: "¿Te interesa esta vivienda?",
    interestedBody:
      "Disponible a través de nuestras agencias colaboradoras. Tu agencia te acompañará en todo el proceso, en tu idioma.",
    contact: "Solicitar información",
    prev: "Anterior",
    next: "Siguiente",
    noResults: "No hay propiedades que coincidan con tu búsqueda.",
  },
  filters: {
    all: "Todas",
    zone: "Zona",
    type: "Tipo",
    bedrooms: "Dormitorios",
    priceUp: "Precio: menor a mayor",
    priceDown: "Precio: mayor a menor",
    sort: "Ordenar",
    results: "propiedades",
  },
  stories: {
    reply: "Escribe un mensaje…",
    send: "Enviar",
    interested: "Me interesa esta propiedad",
    tapHint: "Toca para pasar · mantén para pausar",
  },
  types: {
    villa: "Villa",
    apartamento: "Apartamento",
    atico: "Ático",
    bungalow: "Bungalow",
    adosado: "Adosado",
    duplex: "Dúplex",
    parcela: "Parcela",
  },
  status: { en_venta: "En venta", reservado: "Reservada", vendido: "Vendida" },
  about: {
    kicker: "Nosotros",
    title: "Propiedades con estilo de vida",
    body: "Donde el Mediterráneo se convierte en hogar. Seleccionamos obra nueva de alto nivel en la Costa Blanca y acompañamos a compradores de toda Europa.",
  },
  footer: {
    tagline: "Propiedades con estilo de vida. Donde el Mediterráneo se convierte en hogar.",
    nav: "Navegación",
    contact: "Contacto",
    rights: "Costa Blanca",
    disclaimer: "Precios orientativos · Disponibilidad a través de tu agencia",
  },
};

const de: Dictionary = {
  nav: { home: "Start", properties: "Immobilien", about: "Über uns" },
  hero: {
    kicker: "Costa Blanca · Spanien",
    title: "Ihr Zuhause im Licht",
    titleAccent: "des Mittelmeers",
    subtitle:
      "Neubau-Villen und -Apartments an der Costa Blanca, präsentiert, wie sie es verdienen.",
    ctaProperties: "Immobilien ansehen",
    ctaAbout: "Über uns",
    scroll: "Scrollen",
  },
  stats: {
    sun: "Sonnentage pro Jahr",
    developments: "Neubauprojekte",
    warranty: "Jahre Baugarantie",
    energy: "Energieausweis",
  },
  firm: {
    kicker: "Das Unternehmen",
    title:
      "Wir verkaufen keine Häuser. Wir schaffen die Kulisse für ein neues Leben am Mittelmeer.",
    body: "Jede Immobilie unseres Portfolios wählen wir nach Architektur, Licht und Lage. Hochwertiger Neubau in den begehrtesten Lagen der Costa Blanca.",
  },
  featured: {
    kicker: "Neubau · Zu verkaufen",
    title: "Ausgewählte Immobilien",
    subtitle:
      "Eine Auswahl aus unserem Portfolio. Tippen Sie auf eine Immobilie für alle Details.",
    viewAll: "Alle Immobilien ansehen",
    collection: "Ein Spaziergang durch die Kollektion",
  },
  destination: {
    kicker: "Das Reiseziel",
    title: "Leben an der Costa Blanca",
    body: "Eine der sonnigsten Küsten Europas, jedes Jahr von Tausenden Käufern gewählt, die Lebensqualität, Klima und Meer suchen.",
  },
  cta: {
    title: "Suchen Sie Ihren Platz am Meer?",
    body: "Sagen Sie uns, was Sie sich vorstellen – wir begleiten Sie in Ihrer Sprache.",
    button: "Kontakt aufnehmen",
  },
  card: { from: "Ab", view: "Immobilie ansehen", forSale: "Zu verkaufen", reserved: "Reserviert", sold: "Verkauft" },
  property: {
    back: "Zurück zu den Immobilien",
    description: "Beschreibung",
    features: "Ausstattung",
    location: "Lage",
    gallery: "Galerie",
    viewGallery: "Ganze Galerie ansehen",
    virtualTour: "Virtuelle Tour",
    openMaps: "In Google Maps öffnen",
    from: "Ab",
    ref: "Ref.",
    bedrooms: "Schlafzimmer",
    bathrooms: "Badezimmer",
    area: "Wohnfläche",
    plot: "Grundstück",
    type: "Typ",
    energy: "Energieklasse",
    interested: "Interessiert an dieser Immobilie?",
    interestedBody:
      "Verfügbar über unsere Partneragenturen. Ihre Agentur begleitet Sie durch den gesamten Prozess, in Ihrer Sprache.",
    contact: "Informationen anfordern",
    prev: "Zurück",
    next: "Weiter",
    noResults: "Keine Immobilien entsprechen Ihrer Suche.",
  },
  filters: {
    all: "Alle",
    zone: "Zone",
    type: "Typ",
    bedrooms: "Schlafzimmer",
    priceUp: "Preis: aufsteigend",
    priceDown: "Preis: absteigend",
    sort: "Sortieren",
    results: "Immobilien",
  },
  stories: {
    reply: "Nachricht schreiben…",
    send: "Senden",
    interested: "Diese Immobilie interessiert mich",
    tapHint: "Tippen zum Weiterblättern · halten zum Pausieren",
  },
  types: {
    villa: "Villa",
    apartamento: "Apartment",
    atico: "Penthouse",
    bungalow: "Bungalow",
    adosado: "Reihenhaus",
    duplex: "Maisonette",
    parcela: "Grundstück",
  },
  status: { en_venta: "Zu verkaufen", reservado: "Reserviert", vendido: "Verkauft" },
  about: {
    kicker: "Über uns",
    title: "Immobilien mit Lebensstil",
    body: "Wo das Mittelmeer zum Zuhause wird. Wir wählen hochwertigen Neubau an der Costa Blanca und begleiten Käufer aus ganz Europa.",
  },
  footer: {
    tagline: "Immobilien mit Lebensstil. Wo das Mittelmeer zum Zuhause wird.",
    nav: "Navigation",
    contact: "Kontakt",
    rights: "Costa Blanca",
    disclaimer: "Richtpreise · Verfügbarkeit über Ihre Agentur",
  },
};

const nl: Dictionary = {
  nav: { home: "Home", properties: "Woningen", about: "Over ons" },
  hero: {
    kicker: "Costa Blanca · Spanje",
    title: "Uw thuis in het licht",
    titleAccent: "van de Middellandse Zee",
    subtitle:
      "Nieuwbouwvilla's en -appartementen aan de Costa Blanca, gepresenteerd zoals ze verdienen.",
    ctaProperties: "Bekijk woningen",
    ctaAbout: "Over ons",
    scroll: "Scroll",
  },
  stats: {
    sun: "Zonnedagen per jaar",
    developments: "Nieuwbouwprojecten",
    warranty: "Jaar structurele garantie",
    energy: "Energiecertificaat",
  },
  firm: {
    kicker: "Het bedrijf",
    title:
      "Wij verkopen geen huizen. Wij creëren het decor waar een nieuw leven aan zee begint.",
    body: "Elke woning in ons portfolio kiezen we op architectuur, licht en ligging. Hoogwaardige nieuwbouw op de meest gewilde plekken van de Costa Blanca.",
  },
  featured: {
    kicker: "Nieuwbouw · Te koop",
    title: "Uitgelichte woningen",
    subtitle:
      "Een selectie uit ons portfolio. Tik op een woning voor alle details.",
    viewAll: "Bekijk alle woningen",
    collection: "Een wandeling door de collectie",
  },
  destination: {
    kicker: "De bestemming",
    title: "Wonen aan de Costa Blanca",
    body: "Een van de zonnigste kusten van Europa, elk jaar gekozen door duizenden kopers die levenskwaliteit, klimaat en zee zoeken.",
  },
  cta: {
    title: "Zoekt u uw plek aan zee?",
    body: "Vertel ons wat u voor ogen heeft en wij begeleiden u, in uw taal.",
    button: "Neem contact op",
  },
  card: { from: "Vanaf", view: "Bekijk woning", forSale: "Te koop", reserved: "Gereserveerd", sold: "Verkocht" },
  property: {
    back: "Terug naar woningen",
    description: "Beschrijving",
    features: "Afwerking",
    location: "Locatie",
    gallery: "Galerij",
    viewGallery: "Volledige galerij bekijken",
    virtualTour: "Virtuele tour",
    openMaps: "Openen in Google Maps",
    from: "Vanaf",
    ref: "Ref.",
    bedrooms: "Slaapkamers",
    bathrooms: "Badkamers",
    area: "Oppervlakte",
    plot: "Perceel",
    type: "Type",
    energy: "Energielabel",
    interested: "Interesse in deze woning?",
    interestedBody:
      "Beschikbaar via onze partneragentschappen. Uw agentschap begeleidt u door het hele proces, in uw taal.",
    contact: "Informatie aanvragen",
    prev: "Vorige",
    next: "Volgende",
    noResults: "Geen woningen komen overeen met uw zoekopdracht.",
  },
  filters: {
    all: "Alle",
    zone: "Zone",
    type: "Type",
    bedrooms: "Slaapkamers",
    priceUp: "Prijs: laag naar hoog",
    priceDown: "Prijs: hoog naar laag",
    sort: "Sorteren",
    results: "woningen",
  },
  stories: {
    reply: "Stuur een bericht…",
    send: "Versturen",
    interested: "Ik ben geïnteresseerd in deze woning",
    tapHint: "Tik om verder te gaan · houd vast om te pauzeren",
  },
  types: {
    villa: "Villa",
    apartamento: "Appartement",
    atico: "Penthouse",
    bungalow: "Bungalow",
    adosado: "Rijwoning",
    duplex: "Maisonnette",
    parcela: "Perceel",
  },
  status: { en_venta: "Te koop", reservado: "Gereserveerd", vendido: "Verkocht" },
  about: {
    kicker: "Over ons",
    title: "Woningen met levensstijl",
    body: "Waar de Middellandse Zee thuis wordt. Wij selecteren hoogwaardige nieuwbouw aan de Costa Blanca en begeleiden kopers uit heel Europa.",
  },
  footer: {
    tagline: "Woningen met levensstijl. Waar de Middellandse Zee thuis wordt.",
    nav: "Navigatie",
    contact: "Contact",
    rights: "Costa Blanca",
    disclaimer: "Richtprijzen · Beschikbaarheid via uw agentschap",
  },
};

const en: Dictionary = {
  nav: { home: "Home", properties: "Properties", about: "About" },
  hero: {
    kicker: "Costa Blanca · Spain",
    title: "Your home in the light",
    titleAccent: "of the Mediterranean",
    subtitle:
      "New-build villas and apartments on the Costa Blanca, presented as they deserve.",
    ctaProperties: "View properties",
    ctaAbout: "About us",
    scroll: "Scroll",
  },
  stats: {
    sun: "Days of sun per year",
    developments: "New-build developments",
    warranty: "Years structural warranty",
    energy: "Energy certificate",
  },
  firm: {
    kicker: "The firm",
    title:
      "We don't sell houses. We create the setting where a new life by the Mediterranean begins.",
    body: "Every property in our portfolio is chosen for its architecture, its light and its location. High-end new-build in the most sought-after enclaves of the Costa Blanca.",
  },
  featured: {
    kicker: "New-build · For sale",
    title: "Featured properties",
    subtitle:
      "A selection from our portfolio. Tap any home to enter its full profile.",
    viewAll: "View all properties",
    collection: "A walk through the collection",
  },
  destination: {
    kicker: "The destination",
    title: "Living on the Costa Blanca",
    body: "One of the sunniest coasts in Europe, chosen every year by thousands of buyers seeking quality of life, climate and sea.",
  },
  cta: {
    title: "Looking for your place by the sea?",
    body: "Tell us what you have in mind and we'll guide you, in your language, every step of the way.",
    button: "Talk to us",
  },
  card: { from: "From", view: "View property", forSale: "For sale", reserved: "Reserved", sold: "Sold" },
  property: {
    back: "Back to properties",
    description: "Description",
    features: "Featured finishes",
    location: "Location",
    gallery: "Gallery",
    viewGallery: "View full gallery",
    virtualTour: "Virtual tour",
    openMaps: "Open in Google Maps",
    from: "From",
    ref: "Ref.",
    bedrooms: "Bedrooms",
    bathrooms: "Bathrooms",
    area: "Built area",
    plot: "Plot",
    type: "Type",
    energy: "Energy rating",
    interested: "Interested in this home?",
    interestedBody:
      "Available through our partner agencies. Your agency will guide you through the whole process, in your language.",
    contact: "Request information",
    prev: "Previous",
    next: "Next",
    noResults: "No properties match your search.",
  },
  filters: {
    all: "All",
    zone: "Zone",
    type: "Type",
    bedrooms: "Bedrooms",
    priceUp: "Price: low to high",
    priceDown: "Price: high to low",
    sort: "Sort",
    results: "properties",
  },
  stories: {
    reply: "Send a message…",
    send: "Send",
    interested: "I am interested in this property",
    tapHint: "Tap to advance · hold to pause",
  },
  types: {
    villa: "Villa",
    apartamento: "Apartment",
    atico: "Penthouse",
    bungalow: "Bungalow",
    adosado: "Townhouse",
    duplex: "Duplex",
    parcela: "Plot",
  },
  status: { en_venta: "For sale", reservado: "Reserved", vendido: "Sold" },
  about: {
    kicker: "About",
    title: "Properties with a lifestyle",
    body: "Where the Mediterranean becomes home. We select high-end new-build on the Costa Blanca and guide buyers from across Europe.",
  },
  footer: {
    tagline: "Properties with a lifestyle. Where the Mediterranean becomes home.",
    nav: "Navigation",
    contact: "Contact",
    rights: "Costa Blanca",
    disclaimer: "Indicative prices · Availability through your agency",
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, de, nl, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? es;
}
