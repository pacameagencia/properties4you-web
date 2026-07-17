import type { Locale } from "./config";

export type Dictionary = {
  nav: { home: string; properties: string; about: string; blog: string };
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
  tools: { mortgage: string; downPayment: string; years: string; rate: string; monthly: string; disclaimer: string };
  visit: { title: string; name: string; phone: string; date: string; message: string; cta: string; sent: string };
  share: { title: string; copy: string; copied: string };
  quick: { call: string; whatsapp: string; email: string; directions: string };
  related: { title: string };
  zoneInfo: { title: string };
  favs: { title: string; empty: string; save: string; saved: string; browse: string };
  alertCta: string;
  testimonials: { kicker: string; title: string };
  blog: { title: string; kicker: string; readMore: string; back: string; empty: string };
  search: { title: string; any: string; button: string };
  media: { video: string; plan: string };
  a11y: { close: string; previous: string; next: string; image: string; menu: string };
  meta: { description: string };
  notFound: { title: string; body: string; back: string };
  types: Record<string, string>;
  status: Record<string, string>;
  about: { kicker: string; title: string; body: string };
  footer: { tagline: string; nav: string; contact: string; rights: string; disclaimer: string };
};

const es: Dictionary = {
  nav: { home: "Inicio", properties: "Propiedades", about: "Nosotros", blog: "Guía" },
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
      "Te acompaña un agente especializado de nuestra red, en tu idioma, durante todo el proceso.",
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
  tools: { mortgage: "Calculadora de hipoteca", downPayment: "Entrada", years: "Plazo (años)", rate: "Interés (%)", monthly: "Cuota mensual estimada", disclaimer: "Cálculo orientativo, no vinculante." },
  visit: { title: "Reservar una visita", name: "Tu nombre", phone: "Tu teléfono (opcional)", date: "Fecha preferida", message: "Mensaje (opcional)", cta: "Solicitar visita", sent: "Solicitud registrada — te contactaremos en breve." },
  share: { title: "Compartir", copy: "Copiar enlace", copied: "¡Enlace copiado!" },
  quick: { call: "Llamar", whatsapp: "WhatsApp", email: "Email", directions: "Cómo llegar" },
  related: { title: "También te puede interesar" },
  zoneInfo: { title: "El entorno" },
  favs: { title: "Favoritos", empty: "Aún no has guardado propiedades.", save: "Guardar", saved: "Guardada", browse: "Explorar propiedades" },
  alertCta: "Avísame cuando haya propiedades como esta búsqueda",
  testimonials: { kicker: "Compradores", title: "Quienes ya viven aquí" },
  blog: { title: "Guía del comprador", kicker: "Blog", readMore: "Leer artículo", back: "Volver a la guía", empty: "Próximamente artículos." },
  search: { title: "Encuentra tu propiedad", any: "Cualquiera", button: "Buscar" },
  media: { video: "Vídeo", plan: "Plano de la vivienda" },
  a11y: { close: "Cerrar", previous: "Anterior", next: "Siguiente", image: "Imagen", menu: "Menú" },
  meta: { description: "Obra nueva exclusiva en la Costa Blanca. Villas y apartamentos junto al Mediterráneo, presentados en 5 idiomas." },
  notFound: { title: "Página no encontrada", body: "La página que buscas no existe o ya no está disponible.", back: "Volver al inicio" },
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
  nav: { home: "Start", properties: "Immobilien", about: "Über uns", blog: "Ratgeber" },
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
      "Ein spezialisierter Agent unseres Netzwerks begleitet Sie während des gesamten Prozesses — in Ihrer Sprache.",
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
  tools: { mortgage: "Hypothekenrechner", downPayment: "Anzahlung", years: "Laufzeit (Jahre)", rate: "Zins (%)", monthly: "Geschätzte Monatsrate", disclaimer: "Unverbindliche Orientierungsrechnung." },
  visit: { title: "Besichtigung vereinbaren", name: "Ihr Name", phone: "Ihre Telefonnummer (optional)", date: "Wunschtermin", message: "Nachricht (optional)", cta: "Besichtigung anfragen", sent: "Anfrage erhalten — wir melden uns in Kürze." },
  share: { title: "Teilen", copy: "Link kopieren", copied: "Link kopiert!" },
  quick: { call: "Anrufen", whatsapp: "WhatsApp", email: "E-Mail", directions: "Route planen" },
  related: { title: "Das könnte Sie auch interessieren" },
  zoneInfo: { title: "Die Umgebung" },
  favs: { title: "Favoriten", empty: "Sie haben noch keine Immobilien gespeichert.", save: "Speichern", saved: "Gespeichert", browse: "Immobilien entdecken" },
  alertCta: "Benachrichtigen Sie mich bei neuen passenden Immobilien",
  testimonials: { kicker: "Käufer", title: "Stimmen unserer Käufer" },
  blog: { title: "Käufer-Ratgeber", kicker: "Blog", readMore: "Artikel lesen", back: "Zurück zum Ratgeber", empty: "Artikel folgen in Kürze." },
  search: { title: "Finden Sie Ihre Immobilie", any: "Beliebig", button: "Suchen" },
  media: { video: "Video", plan: "Grundriss" },
  a11y: { close: "Schließen", previous: "Zurück", next: "Weiter", image: "Bild", menu: "Menü" },
  meta: { description: "Exklusiver Neubau an der Costa Blanca. Villen und Apartments am Mittelmeer, präsentiert in 5 Sprachen." },
  notFound: { title: "Seite nicht gefunden", body: "Die gesuchte Seite existiert nicht oder ist nicht mehr verfügbar.", back: "Zur Startseite" },
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
  nav: { home: "Home", properties: "Woningen", about: "Over ons", blog: "Gids" },
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
      "Een gespecialiseerde agent uit ons netwerk begeleidt u tijdens het hele proces, in uw taal.",
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
  tools: { mortgage: "Hypotheekcalculator", downPayment: "Aanbetaling", years: "Looptijd (jaren)", rate: "Rente (%)", monthly: "Geschat maandbedrag", disclaimer: "Indicatieve berekening, niet bindend." },
  visit: { title: "Bezichtiging plannen", name: "Uw naam", phone: "Uw telefoonnummer (optioneel)", date: "Voorkeursdatum", message: "Bericht (optioneel)", cta: "Bezichtiging aanvragen", sent: "Aanvraag ontvangen — we nemen spoedig contact op." },
  share: { title: "Delen", copy: "Link kopiëren", copied: "Link gekopieerd!" },
  quick: { call: "Bellen", whatsapp: "WhatsApp", email: "E-mail", directions: "Routebeschrijving" },
  related: { title: "Dit vindt u misschien ook interessant" },
  zoneInfo: { title: "De omgeving" },
  favs: { title: "Favorieten", empty: "U heeft nog geen woningen opgeslagen.", save: "Opslaan", saved: "Opgeslagen", browse: "Woningen bekijken" },
  alertCta: "Waarschuw mij bij nieuwe woningen zoals deze zoekopdracht",
  testimonials: { kicker: "Kopers", title: "Wie hier al woont" },
  blog: { title: "Kopersgids", kicker: "Blog", readMore: "Artikel lezen", back: "Terug naar de gids", empty: "Binnenkort artikelen." },
  search: { title: "Vind uw woning", any: "Alle", button: "Zoeken" },
  media: { video: "Video", plan: "Plattegrond" },
  a11y: { close: "Sluiten", previous: "Vorige", next: "Volgende", image: "Afbeelding", menu: "Menu" },
  meta: { description: "Exclusieve nieuwbouw aan de Costa Blanca. Villa's en appartementen aan de Middellandse Zee, gepresenteerd in 5 talen." },
  notFound: { title: "Pagina niet gevonden", body: "De pagina die u zoekt bestaat niet of is niet meer beschikbaar.", back: "Terug naar home" },
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
  nav: { home: "Home", properties: "Properties", about: "About", blog: "Guide" },
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
      "A specialist agent from our network will guide you through the whole process, in your language.",
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
  tools: { mortgage: "Mortgage calculator", downPayment: "Down payment", years: "Term (years)", rate: "Interest (%)", monthly: "Estimated monthly payment", disclaimer: "Indicative calculation, not binding." },
  visit: { title: "Book a viewing", name: "Your name", phone: "Your phone (optional)", date: "Preferred date", message: "Message (optional)", cta: "Request a viewing", sent: "Request received — we will contact you shortly." },
  share: { title: "Share", copy: "Copy link", copied: "Link copied!" },
  quick: { call: "Call", whatsapp: "WhatsApp", email: "Email", directions: "Get directions" },
  related: { title: "You may also like" },
  zoneInfo: { title: "The area" },
  favs: { title: "Favourites", empty: "You haven't saved any properties yet.", save: "Save", saved: "Saved", browse: "Browse properties" },
  alertCta: "Alert me about new properties like this search",
  testimonials: { kicker: "Buyers", title: "Those who already live here" },
  blog: { title: "Buyer's guide", kicker: "Blog", readMore: "Read article", back: "Back to the guide", empty: "Articles coming soon." },
  search: { title: "Find your property", any: "Any", button: "Search" },
  media: { video: "Video", plan: "Floor plan" },
  a11y: { close: "Close", previous: "Previous", next: "Next", image: "Image", menu: "Menu" },
  meta: { description: "Exclusive new-build homes on the Costa Blanca. Villas and apartments by the Mediterranean, presented in 5 languages." },
  notFound: { title: "Page not found", body: "The page you are looking for does not exist or is no longer available.", back: "Back to home" },
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


const fr: Dictionary = {
  nav: { home: "Accueil", properties: "Propriétés", about: "À propos", blog: "Guide" },
  hero: {
    kicker: "Costa Blanca · Espagne",
    title: "Votre maison sous la lumière",
    titleAccent: "de la Méditerranée",
    subtitle:
      "Villas et appartements neufs sur la Costa Blanca, présentés comme ils le méritent.",
    ctaProperties: "Voir les propriétés",
    ctaAbout: "Qui sommes-nous",
    scroll: "Défiler",
  },
  stats: {
    sun: "Jours de soleil par an",
    developments: "Programmes neufs",
    warranty: "Ans de garantie structurelle",
    energy: "Certificat énergétique",
  },
  firm: {
    kicker: "La maison",
    title:
      "Nous ne vendons pas des maisons. Nous créons le décor où commence une nouvelle vie face à la Méditerranée.",
    body: "Chaque propriété de notre portefeuille est choisie pour son architecture, sa lumière et son emplacement. Du neuf haut de gamme dans les enclaves les plus recherchées de la Costa Blanca.",
  },
  featured: {
    kicker: "Neuf · À vendre",
    title: "Propriétés à la une",
    subtitle:
      "Une sélection de notre portefeuille. Touchez une propriété pour découvrir sa fiche complète.",
    viewAll: "Voir toutes les propriétés",
    collection: "Une promenade dans la collection",
  },
  destination: {
    kicker: "La destination",
    title: "Vivre sur la Costa Blanca",
    body: "L'une des côtes les plus lumineuses d'Europe, choisie chaque année par des milliers d'acheteurs en quête de qualité de vie, de climat et de mer.",
  },
  cta: {
    title: "Vous cherchez votre place face à la mer ?",
    body: "Dites-nous ce que vous imaginez et nous vous accompagnons, dans votre langue, à chaque étape.",
    button: "Parler avec nous",
  },
  card: { from: "À partir de", view: "Voir la propriété", forSale: "À vendre", reserved: "Réservée", sold: "Vendue" },
  property: {
    back: "Retour aux propriétés",
    description: "Description",
    features: "Prestations",
    location: "Emplacement",
    gallery: "Galerie",
    viewGallery: "Voir toute la galerie",
    virtualTour: "Visite virtuelle",
    openMaps: "Ouvrir dans Google Maps",
    from: "À partir de",
    ref: "Réf.",
    bedrooms: "Chambres",
    bathrooms: "Salles de bain",
    area: "Surface",
    plot: "Terrain",
    type: "Type",
    energy: "Classe énergétique",
    interested: "Cette propriété vous intéresse ?",
    interestedBody:
      "Un agent spécialisé de notre réseau vous accompagne, dans votre langue, tout au long du processus.",
    contact: "Demander des informations",
    prev: "Précédente",
    next: "Suivante",
    noResults: "Aucune propriété ne correspond à votre recherche.",
  },
  filters: {
    all: "Toutes",
    zone: "Zone",
    type: "Type",
    bedrooms: "Chambres",
    priceUp: "Prix : croissant",
    priceDown: "Prix : décroissant",
    sort: "Trier",
    results: "propriétés",
  },
  stories: {
    reply: "Écrivez un message…",
    send: "Envoyer",
    interested: "Cette propriété m'intéresse",
    tapHint: "Touchez pour avancer · maintenez pour mettre en pause",
  },
  tools: { mortgage: "Calculatrice de prêt", downPayment: "Apport", years: "Durée (années)", rate: "Taux (%)", monthly: "Mensualité estimée", disclaimer: "Calcul indicatif, non contractuel." },
  visit: { title: "Réserver une visite", name: "Votre nom", phone: "Votre téléphone (facultatif)", date: "Date souhaitée", message: "Message (optionnel)", cta: "Demander une visite", sent: "Demande reçue — nous vous contacterons rapidement." },
  share: { title: "Partager", copy: "Copier le lien", copied: "Lien copié !" },
  quick: { call: "Appeler", whatsapp: "WhatsApp", email: "E-mail", directions: "Itinéraire" },
  related: { title: "Cela pourrait aussi vous intéresser" },
  zoneInfo: { title: "Le quartier" },
  favs: { title: "Favoris", empty: "Vous n'avez pas encore enregistré de propriétés.", save: "Enregistrer", saved: "Enregistrée", browse: "Explorer les propriétés" },
  alertCta: "Prévenez-moi des nouvelles propriétés comme cette recherche",
  testimonials: { kicker: "Acheteurs", title: "Ceux qui vivent déjà ici" },
  blog: { title: "Guide de l'acheteur", kicker: "Blog", readMore: "Lire l'article", back: "Retour au guide", empty: "Articles à venir." },
  search: { title: "Trouvez votre propriété", any: "Tous", button: "Rechercher" },
  media: { video: "Vidéo", plan: "Plan du logement" },
  a11y: { close: "Fermer", previous: "Précédente", next: "Suivante", image: "Image", menu: "Menu" },
  meta: { description: "Immobilier neuf exclusif sur la Costa Blanca. Villas et appartements au bord de la Méditerranée, présentés en 5 langues." },
  notFound: { title: "Page introuvable", body: "La page que vous cherchez n'existe pas ou n'est plus disponible.", back: "Retour à l'accueil" },
  types: {
    villa: "Villa",
    apartamento: "Appartement",
    atico: "Penthouse",
    bungalow: "Bungalow",
    adosado: "Maison mitoyenne",
    duplex: "Duplex",
    parcela: "Terrain",
  },
  status: { en_venta: "À vendre", reservado: "Réservée", vendido: "Vendue" },
  about: {
    kicker: "À propos",
    title: "Des propriétés avec un art de vivre",
    body: "Là où la Méditerranée devient un foyer. Nous sélectionnons du neuf haut de gamme sur la Costa Blanca et accompagnons des acheteurs de toute l'Europe.",
  },
  footer: {
    tagline: "Des propriétés avec un art de vivre. Là où la Méditerranée devient un foyer.",
    nav: "Navigation",
    contact: "Contact",
    rights: "Costa Blanca",
    disclaimer: "Prix indicatifs · Disponibilité via votre agence",
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, en, de, nl, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? es;
}
