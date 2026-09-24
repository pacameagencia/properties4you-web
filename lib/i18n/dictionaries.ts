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
  card: { from: string; view: string; forSale: string; reserved: string; sold: string; onRequest: string };
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
    energyPending: string;
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
    extras: string;
  };
  stories: { reply: string; send: string; interested: string; tapHint: string };
  tools: { mortgage: string; downPayment: string; years: string; rate: string; monthly: string; disclaimer: string };
  visit: { title: string; name: string; phone: string; date: string; message: string; cta: string; sent: string };
  share: { title: string; copy: string; copied: string };
  quick: { call: string; whatsapp: string; email: string; directions: string };
  related: { title: string };
  zoneInfo: { title: string };
  favs: { title: string; empty: string; save: string; saved: string; browse: string };
  blog: { title: string; kicker: string; readMore: string; back: string; empty: string };
  search: { title: string; any: string; button: string };
  finder: { title: string; titleAccent: string; subtitle: string };
  media: { video: string; plan: string };
  a11y: { close: string; previous: string; next: string; image: string; menu: string };
  meta: { description: string };
  notFound: { title: string; body: string; back: string };
  types: Record<string, string>;
  status: Record<string, string>;
  about: { kicker: string; title: string; body: string };
  footer: { tagline: string; nav: string; contact: string; rights: string; disclaimer: string };
  /** Enlaces legales del pie y consentimiento de los formularios (RGPD / LSSI). */
  legal: {
    notice: string;
    privacy: string;
    cookies: string;
    consent: string;
    consentLink: string;
    consentRequired: string;
  };
  /** Aviso de cookies y carga diferida del mapa de Google. */
  cookies: { title: string; body: string; accept: string; essential: string; more: string; loadMap: string; loadMapHint: string };
  /** Formularios que envían correo (visita, contacto, colaboración). */
  forms: {
    email: string;
    sending: string;
    sent: string;
    error: string;
    dateLabel: string;
    contactTitle: string;
    contactBody: string;
    send: string;
    agency: string;
    country: string;
    website: string;
    partnerCta: string;
  };
  /** Distintivo de la tarjeta: en qué fase está la promoción. */
  phase: { keyReady: string; inDevelopment: string; toOrder: string };
  /** Programa de colaboración con agencias (nav + bloque de portada). */
  partners: { nav: string; kicker: string; title: string; body: string; cta: string };
};

const es: Dictionary = {
  nav: { home: "Inicio", properties: "Propiedades", about: "Nosotros", blog: "Guía" },
  hero: {
    kicker: "Sueños posibles · Costa Blanca",
    title: "Tu hogar bajo la luz",
    titleAccent: "del Mediterráneo",
    subtitle:
      "Una nueva forma de vivir junto al Mediterráneo: entornos tranquilos, a pocos minutos del mar y lejos del turismo masivo.",
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
    kicker: "Sueños posibles",
    title:
      "No vendemos solo viviendas. Hacemos posibles los sueños de quienes buscan una vida mejor en España.",
    body: "Sol, tranquilidad, salud y bienestar: cada vivienda se elige por su entorno sereno, su luz y su cercanía al mar. Y en la mesa, la dieta mediterránea y un coste de vida que deja espacio para disfrutar cada día.",
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
    body: "Más de 300 días de sol al año, un clima privilegiado y las playas del Mediterráneo a un corto trayecto en coche. Lejos del turismo masivo: la combinación perfecta entre tranquilidad y comodidad.",
  },
  cta: {
    title: "¿Buscas tu lugar frente al mar?",
    body: "Cuéntanos qué imaginas y te acompañamos, en tu idioma, en cada paso.",
    button: "Hablar con nosotros",
  },
  card: { from: "Desde", view: "Ver propiedad", forSale: "En venta", reserved: "Reservada", sold: "Vendida", onRequest: "Consultar precio" },
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
    energyPending: "En trámite",
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
    extras: "Extras",
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
  blog: { title: "Guía del comprador", kicker: "Blog", readMore: "Leer artículo", back: "Volver a la guía", empty: "Próximamente artículos." },
  search: { title: "Encuentra tu propiedad", any: "Cualquiera", button: "Buscar" },
  finder: { title: "Encuentra la casa", titleAccent: "de tus sueños", subtitle: "Afina la búsqueda con nuestros filtros: zona, tipo, precio y extras como piscina privada o vistas al mar." },
  media: { video: "Vídeo", plan: "Plano de la vivienda" },
  a11y: { close: "Cerrar", previous: "Anterior", next: "Siguiente", image: "Imagen", menu: "Menú" },
  meta: { description: "Sueños posibles en la Costa Blanca: obra nueva en entornos tranquilos a minutos del mar, con más de 300 días de sol al año." },
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
    body: "Descubre una nueva forma de vivir en la Costa Blanca: viviendas en entornos tranquilos, a pocos minutos del mar, con más de 300 días de sol al año y una excelente calidad de vida. No vendemos solo viviendas; hacemos posibles los sueños de quienes buscan sol, tranquilidad, salud y una vida mejor en España.",
  },
  footer: {
    tagline: "Sueños posibles. Sol, tranquilidad y una vida mejor junto al Mediterráneo.",
    nav: "Navegación",
    contact: "Contacto",
    rights: "Costa Blanca",
    disclaimer: "Precios orientativos · Disponibilidad a través de tu agencia",
  },
  legal: {
    notice: "Aviso legal",
    privacy: "Privacidad",
    cookies: "Cookies",
    consent: "He leído y acepto que Properties4You trate mis datos para responder a esta solicitud.",
    consentLink: "Política de privacidad",
    consentRequired: "Marca la casilla para poder enviar tu solicitud.",
  },
  cookies: {
    title: "Cookies y privacidad",
    body: "Usamos almacenamiento técnico para recordar tus favoritos y tu idioma. El mapa de Google y los vídeos de terceros solo se cargan si lo aceptas.",
    accept: "Aceptar todo",
    essential: "Solo lo necesario",
    more: "Política de cookies",
    loadMap: "Cargar mapa de Google",
    loadMapHint: "Al cargarlo aceptas las cookies de Google Maps.",
  },
  forms: {
    email: "Tu email",
    sending: "Enviando…",
    sent: "Mensaje enviado. Te respondemos por email lo antes posible.",
    error: "No se ha podido enviar. Escríbenos directamente a",
    dateLabel: "Fecha preferida para la visita (opcional)",
    contactTitle: "Escríbenos",
    contactBody: "Cuéntanos qué buscas y te contestamos por correo, en tu idioma.",
    send: "Enviar",
    agency: "Nombre de tu agencia",
    country: "País",
    website: "Web de la agencia (opcional)",
    partnerCta: "Quiero colaborar",
  },
  phase: { keyReady: "Llave en mano", inDevelopment: "En construcción", toOrder: "A medida" },
  partners: {
    nav: "Colabora",
    kicker: "Para agencias inmobiliarias",
    title: "Colabora con nosotros y cobra el 5 % por cada venta",
    body: "Si tienes clientes que buscan casa en la Costa Blanca, nosotros ponemos la cartera, las visitas y el acompañamiento en su idioma. Tú cobras una comisión del 5 % por cada operación cerrada.",
    cta: "Ver el programa de colaboración",
  },
};

const de: Dictionary = {
  nav: { home: "Start", properties: "Immobilien", about: "Über uns", blog: "Ratgeber" },
  hero: {
    kicker: "Träume werden möglich · Costa Blanca",
    title: "Ihr Zuhause im Licht",
    titleAccent: "des Mittelmeers",
    subtitle:
      "Eine neue Art, am Mittelmeer zu leben: ruhige Lagen, wenige Minuten vom Meer und fernab des Massentourismus.",
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
    kicker: "Träume werden möglich",
    title:
      "Wir verkaufen nicht nur Immobilien. Wir machen Träume möglich — für alle, die ein besseres Leben in Spanien suchen.",
    body: "Sonne, Ruhe, Gesundheit und Wohlbefinden: Jede Immobilie wird nach ihrer ruhigen Lage, ihrem Licht und ihrer Nähe zum Meer ausgewählt. Und auf dem Tisch: die mediterrane Küche und Lebenshaltungskosten, die Raum lassen, jeden Tag zu genießen.",
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
    body: "Über 300 Sonnentage im Jahr, ein privilegiertes Klima und die Mittelmeerstrände nur eine kurze Autofahrt entfernt. Fernab des Massentourismus: die perfekte Balance aus Ruhe und Komfort.",
  },
  cta: {
    title: "Suchen Sie Ihren Platz am Meer?",
    body: "Sagen Sie uns, was Sie sich vorstellen – wir begleiten Sie in Ihrer Sprache.",
    button: "Kontakt aufnehmen",
  },
  card: { from: "Ab", view: "Immobilie ansehen", forSale: "Zu verkaufen", reserved: "Reserviert", sold: "Verkauft", onRequest: "Preis auf Anfrage" },
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
    energyPending: "In Bearbeitung",
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
    extras: "Extras",
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
  blog: { title: "Käufer-Ratgeber", kicker: "Blog", readMore: "Artikel lesen", back: "Zurück zum Ratgeber", empty: "Artikel folgen in Kürze." },
  search: { title: "Finden Sie Ihre Immobilie", any: "Beliebig", button: "Suchen" },
  finder: { title: "Finden Sie das Zuhause", titleAccent: "Ihrer Träume", subtitle: "Verfeinern Sie die Suche mit unseren Filtern: Lage, Typ, Preis und Extras wie Privatpool oder Meerblick." },
  media: { video: "Video", plan: "Grundriss" },
  a11y: { close: "Schließen", previous: "Zurück", next: "Weiter", image: "Bild", menu: "Menü" },
  meta: { description: "Träume werden möglich an der Costa Blanca: Neubau in ruhigen Lagen, Minuten vom Meer, mit über 300 Sonnentagen im Jahr." },
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
    body: "Entdecken Sie eine neue Art, an der Costa Blanca zu leben: Immobilien in ruhigen Lagen, wenige Minuten vom Meer, mit über 300 Sonnentagen im Jahr und exzellenter Lebensqualität. Wir verkaufen nicht nur Immobilien — wir machen Träume möglich für alle, die Sonne, Ruhe, Gesundheit und ein besseres Leben in Spanien suchen.",
  },
  footer: {
    tagline: "Träume werden möglich. Sonne, Ruhe und ein besseres Leben am Mittelmeer.",
    nav: "Navigation",
    contact: "Kontakt",
    rights: "Costa Blanca",
    disclaimer: "Richtpreise · Verfügbarkeit über Ihre Agentur",
  },
  legal: {
    notice: "Impressum",
    privacy: "Datenschutz",
    cookies: "Cookies",
    consent: "Ich habe die Hinweise gelesen und willige ein, dass Properties4You meine Daten zur Beantwortung dieser Anfrage verarbeitet.",
    consentLink: "Datenschutzerklärung",
    consentRequired: "Bitte kreuzen Sie das Kästchen an, um die Anfrage zu senden.",
  },
  cookies: {
    title: "Cookies und Datenschutz",
    body: "Wir nutzen technischen Speicher, um Ihre Favoriten und Ihre Sprache zu merken. Google Maps und Videos von Drittanbietern werden nur geladen, wenn Sie zustimmen.",
    accept: "Alle akzeptieren",
    essential: "Nur das Nötige",
    more: "Cookie-Richtlinie",
    loadMap: "Google-Karte laden",
    loadMapHint: "Mit dem Laden akzeptieren Sie die Cookies von Google Maps.",
  },
  forms: {
    email: "Ihre E-Mail",
    sending: "Wird gesendet…",
    sent: "Nachricht gesendet. Wir antworten so schnell wie möglich per E-Mail.",
    error: "Die Nachricht konnte nicht gesendet werden. Schreiben Sie uns direkt an",
    dateLabel: "Wunschtermin für die Besichtigung (optional)",
    contactTitle: "Schreiben Sie uns",
    contactBody: "Sagen Sie uns, was Sie suchen, und wir antworten per E-Mail in Ihrer Sprache.",
    send: "Senden",
    agency: "Name Ihrer Agentur",
    country: "Land",
    website: "Website der Agentur (optional)",
    partnerCta: "Ich möchte Partner werden",
  },
  phase: { keyReady: "Bezugsfertig", inDevelopment: "Im Bau", toOrder: "Nach Maß" },
  partners: {
    nav: "Partner werden",
    kicker: "Für Immobilienagenturen",
    title: "Werden Sie Partner und verdienen Sie 5 % an jedem Verkauf",
    body: "Wenn Sie Kunden haben, die ein Haus an der Costa Blanca suchen, stellen wir das Portfolio, die Besichtigungen und die Betreuung in deren Sprache. Sie erhalten 5 % Provision für jeden abgeschlossenen Verkauf.",
    cta: "Zum Partnerprogramm",
  },
};

const nl: Dictionary = {
  nav: { home: "Home", properties: "Woningen", about: "Over ons", blog: "Gids" },
  hero: {
    kicker: "Dromen worden mogelijk · Costa Blanca",
    title: "Uw thuis in het licht",
    titleAccent: "van de Middellandse Zee",
    subtitle:
      "Een nieuwe manier van leven aan de Middellandse Zee: rustige omgevingen, op enkele minuten van de zee en ver van het massatoerisme.",
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
    kicker: "Dromen worden mogelijk",
    title:
      "Wij verkopen niet zomaar woningen. Wij maken dromen mogelijk voor wie een beter leven in Spanje zoekt.",
    body: "Zon, rust, gezondheid en welzijn: elke woning wordt gekozen om haar serene omgeving, haar licht en haar nabijheid tot de zee. En op tafel: het mediterrane dieet en kosten van levensonderhoud die ruimte laten om elke dag te genieten.",
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
    body: "Meer dan 300 zonnedagen per jaar, een bevoorrecht klimaat en de mediterrane stranden op een korte autorit. Ver van het massatoerisme: de perfecte balans tussen rust en comfort.",
  },
  cta: {
    title: "Zoekt u uw plek aan zee?",
    body: "Vertel ons wat u voor ogen heeft en wij begeleiden u, in uw taal.",
    button: "Neem contact op",
  },
  card: { from: "Vanaf", view: "Bekijk woning", forSale: "Te koop", reserved: "Gereserveerd", sold: "Verkocht", onRequest: "Prijs op aanvraag" },
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
    energyPending: "In aanvraag",
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
    extras: "Extra's",
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
  blog: { title: "Kopersgids", kicker: "Blog", readMore: "Artikel lezen", back: "Terug naar de gids", empty: "Binnenkort artikelen." },
  search: { title: "Vind uw woning", any: "Alle", button: "Zoeken" },
  finder: { title: "Vind het huis", titleAccent: "van uw dromen", subtitle: "Verfijn uw zoekopdracht met onze filters: regio, type, prijs en extra's zoals een privézwembad of zeezicht." },
  media: { video: "Video", plan: "Plattegrond" },
  a11y: { close: "Sluiten", previous: "Vorige", next: "Volgende", image: "Afbeelding", menu: "Menu" },
  meta: { description: "Dromen worden mogelijk aan de Costa Blanca: nieuwbouw in rustige omgevingen op minuten van de zee, met meer dan 300 zonnedagen per jaar." },
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
    body: "Ontdek een nieuwe manier van leven aan de Costa Blanca: woningen in rustige omgevingen, op enkele minuten van de zee, met meer dan 300 zonnedagen per jaar en een uitstekende levenskwaliteit. Wij verkopen niet zomaar woningen; wij maken dromen mogelijk voor wie zon, rust, gezondheid en een beter leven in Spanje zoekt.",
  },
  footer: {
    tagline: "Dromen worden mogelijk. Zon, rust en een beter leven aan de Middellandse Zee.",
    nav: "Navigatie",
    contact: "Contact",
    rights: "Costa Blanca",
    disclaimer: "Richtprijzen · Beschikbaarheid via uw agentschap",
  },
  legal: {
    notice: "Juridische mededeling",
    privacy: "Privacy",
    cookies: "Cookies",
    consent: "Ik heb de informatie gelezen en ga ermee akkoord dat Properties4You mijn gegevens verwerkt om deze aanvraag te beantwoorden.",
    consentLink: "Privacybeleid",
    consentRequired: "Vink het vakje aan om uw aanvraag te versturen.",
  },
  cookies: {
    title: "Cookies en privacy",
    body: "We gebruiken technische opslag om uw favorieten en taal te onthouden. Google Maps en video's van derden laden alleen als u dat accepteert.",
    accept: "Alles accepteren",
    essential: "Alleen noodzakelijk",
    more: "Cookiebeleid",
    loadMap: "Google-kaart laden",
    loadMapHint: "Door de kaart te laden accepteert u de cookies van Google Maps.",
  },
  forms: {
    email: "Uw e-mail",
    sending: "Versturen…",
    sent: "Bericht verstuurd. We antwoorden zo snel mogelijk per e-mail.",
    error: "Het bericht kon niet worden verstuurd. Mail ons rechtstreeks op",
    dateLabel: "Gewenste datum voor de bezichtiging (optioneel)",
    contactTitle: "Schrijf ons",
    contactBody: "Vertel ons wat u zoekt en we antwoorden per e-mail, in uw taal.",
    send: "Versturen",
    agency: "Naam van uw kantoor",
    country: "Land",
    website: "Website van het kantoor (optioneel)",
    partnerCta: "Ik wil samenwerken",
  },
  phase: { keyReady: "Instapklaar", inDevelopment: "In aanbouw", toOrder: "Op maat" },
  partners: {
    nav: "Samenwerken",
    kicker: "Voor makelaars",
    title: "Werk met ons samen en verdien 5 % op elke verkoop",
    body: "Heeft u klanten die een woning zoeken aan de Costa Blanca? Wij zorgen voor het aanbod, de bezichtigingen en de begeleiding in hun taal. U ontvangt 5 % commissie op elke afgeronde verkoop.",
    cta: "Bekijk het partnerprogramma",
  },
};

const en: Dictionary = {
  nav: { home: "Home", properties: "Properties", about: "About", blog: "Guide" },
  hero: {
    kicker: "Dreams made possible · Costa Blanca",
    title: "Your home in the light",
    titleAccent: "of the Mediterranean",
    subtitle:
      "A new way of living by the Mediterranean: peaceful settings, minutes from the sea and far from mass tourism.",
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
    kicker: "Dreams made possible",
    title:
      "We don't just sell homes. We make dreams possible for those seeking a better life in Spain.",
    body: "Sun, tranquillity, health and wellbeing: every home is chosen for its serene setting, its light and its closeness to the sea. And at the table, the Mediterranean diet and a cost of living that leaves room to enjoy every day.",
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
    body: "Over 300 days of sunshine a year, a privileged climate and the Mediterranean beaches a short drive away. Far from mass tourism: the perfect balance of peace and convenience.",
  },
  cta: {
    title: "Looking for your place by the sea?",
    body: "Tell us what you have in mind and we'll guide you, in your language, every step of the way.",
    button: "Talk to us",
  },
  card: { from: "From", view: "View property", forSale: "For sale", reserved: "Reserved", sold: "Sold", onRequest: "Price on request" },
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
    energyPending: "Pending",
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
    extras: "Features",
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
  blog: { title: "Buyer's guide", kicker: "Blog", readMore: "Read article", back: "Back to the guide", empty: "Articles coming soon." },
  search: { title: "Find your property", any: "Any", button: "Search" },
  finder: { title: "Find the home", titleAccent: "of your dreams", subtitle: "Fine-tune your search with our filters: area, type, price and extras such as a private pool or sea views." },
  media: { video: "Video", plan: "Floor plan" },
  a11y: { close: "Close", previous: "Previous", next: "Next", image: "Image", menu: "Menu" },
  meta: { description: "Dreams made possible on the Costa Blanca: new-build homes in peaceful settings minutes from the sea, with over 300 days of sun a year." },
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
    body: "Discover a new way of living on the Costa Blanca: homes in peaceful settings, minutes from the sea, with over 300 days of sunshine a year and an excellent quality of life. We don't just sell homes; we make dreams possible for those seeking sun, tranquillity, health and a better life in Spain.",
  },
  footer: {
    tagline: "Dreams made possible. Sun, tranquillity and a better life by the Mediterranean.",
    nav: "Navigation",
    contact: "Contact",
    rights: "Costa Blanca",
    disclaimer: "Indicative prices · Availability through your agency",
  },
  legal: {
    notice: "Legal notice",
    privacy: "Privacy",
    cookies: "Cookies",
    consent: "I have read and agree that Properties4You may process my data to respond to this enquiry.",
    consentLink: "Privacy policy",
    consentRequired: "Please tick the box so we can send your request.",
  },
  cookies: {
    title: "Cookies and privacy",
    body: "We use technical storage to remember your favourites and language. Google Maps and third-party videos only load if you accept.",
    accept: "Accept all",
    essential: "Essentials only",
    more: "Cookie policy",
    loadMap: "Load Google map",
    loadMapHint: "Loading it means accepting Google Maps cookies.",
  },
  forms: {
    email: "Your email",
    sending: "Sending…",
    sent: "Message sent. We will reply by email as soon as possible.",
    error: "The message could not be sent. Please email us directly at",
    dateLabel: "Preferred viewing date (optional)",
    contactTitle: "Write to us",
    contactBody: "Tell us what you are looking for and we will reply by email, in your language.",
    send: "Send",
    agency: "Your agency name",
    country: "Country",
    website: "Agency website (optional)",
    partnerCta: "I want to partner",
  },
  phase: { keyReady: "Key ready", inDevelopment: "In development", toOrder: "Built to order" },
  partners: {
    nav: "Partner with us",
    kicker: "For estate agencies",
    title: "Partner with us and earn 5% on every sale",
    body: "If you have clients looking for a home on the Costa Blanca, we provide the portfolio, the viewings and the support in their language. You earn a 5% commission on every completed sale.",
    cta: "See the partner programme",
  },
};


const fr: Dictionary = {
  nav: { home: "Accueil", properties: "Propriétés", about: "À propos", blog: "Guide" },
  hero: {
    kicker: "Des rêves rendus possibles · Costa Blanca",
    title: "Votre maison sous la lumière",
    titleAccent: "de la Méditerranée",
    subtitle:
      "Une nouvelle façon de vivre au bord de la Méditerranée : des cadres paisibles, à quelques minutes de la mer et loin du tourisme de masse.",
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
    kicker: "Des rêves rendus possibles",
    title:
      "Nous ne vendons pas seulement des logements. Nous rendons possibles les rêves de ceux qui cherchent une vie meilleure en Espagne.",
    body: "Soleil, tranquillité, santé et bien-être : chaque logement est choisi pour son cadre serein, sa lumière et sa proximité avec la mer. Et à table, le régime méditerranéen et un coût de la vie qui laisse le temps de profiter de chaque journée.",
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
    body: "Plus de 300 jours de soleil par an, un climat privilégié et les plages de la Méditerranée à un court trajet en voiture. Loin du tourisme de masse : l’équilibre parfait entre tranquillité et confort.",
  },
  cta: {
    title: "Vous cherchez votre place face à la mer ?",
    body: "Dites-nous ce que vous imaginez et nous vous accompagnons, dans votre langue, à chaque étape.",
    button: "Parler avec nous",
  },
  card: { from: "À partir de", view: "Voir la propriété", forSale: "À vendre", reserved: "Réservée", sold: "Vendue", onRequest: "Prix sur demande" },
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
    energyPending: "En cours",
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
    extras: "Options",
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
  blog: { title: "Guide de l'acheteur", kicker: "Blog", readMore: "Lire l'article", back: "Retour au guide", empty: "Articles à venir." },
  search: { title: "Trouvez votre propriété", any: "Tous", button: "Rechercher" },
  finder: { title: "Trouvez la maison", titleAccent: "de vos rêves", subtitle: "Affinez votre recherche avec nos filtres : zone, type, prix et options comme piscine privée ou vue mer." },
  media: { video: "Vidéo", plan: "Plan du logement" },
  a11y: { close: "Fermer", previous: "Précédente", next: "Suivante", image: "Image", menu: "Menu" },
  meta: { description: "Des rêves rendus possibles sur la Costa Blanca : de l’immobilier neuf dans des cadres paisibles à quelques minutes de la mer, avec plus de 300 jours de soleil par an." },
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
    body: "Découvrez une nouvelle façon de vivre sur la Costa Blanca : des logements dans des cadres paisibles, à quelques minutes de la mer, avec plus de 300 jours de soleil par an et une excellente qualité de vie. Nous ne vendons pas seulement des logements ; nous rendons possibles les rêves de ceux qui cherchent le soleil, la tranquillité, la santé et une vie meilleure en Espagne.",
  },
  footer: {
    tagline: "Des rêves rendus possibles. Soleil, tranquillité et une vie meilleure au bord de la Méditerranée.",
    nav: "Navigation",
    contact: "Contact",
    rights: "Costa Blanca",
    disclaimer: "Prix indicatifs · Disponibilité via votre agence",
  },
  legal: {
    notice: "Mentions légales",
    privacy: "Confidentialité",
    cookies: "Cookies",
    consent: "J'ai lu et j'accepte que Properties4You traite mes données pour répondre à cette demande.",
    consentLink: "Politique de confidentialité",
    consentRequired: "Cochez la case pour pouvoir envoyer votre demande.",
  },
  cookies: {
    title: "Cookies et confidentialité",
    body: "Nous utilisons un stockage technique pour mémoriser vos favoris et votre langue. Google Maps et les vidéos tierces ne se chargent que si vous l'acceptez.",
    accept: "Tout accepter",
    essential: "Essentiel uniquement",
    more: "Politique de cookies",
    loadMap: "Charger la carte Google",
    loadMapHint: "En la chargeant, vous acceptez les cookies de Google Maps.",
  },
  forms: {
    email: "Votre e-mail",
    sending: "Envoi…",
    sent: "Message envoyé. Nous vous répondons par e-mail dès que possible.",
    error: "Le message n'a pas pu être envoyé. Écrivez-nous directement à",
    dateLabel: "Date souhaitée pour la visite (facultatif)",
    contactTitle: "Écrivez-nous",
    contactBody: "Dites-nous ce que vous cherchez et nous vous répondons par e-mail, dans votre langue.",
    send: "Envoyer",
    agency: "Nom de votre agence",
    country: "Pays",
    website: "Site web de l'agence (facultatif)",
    partnerCta: "Je veux collaborer",
  },
  phase: { keyReady: "Clés en main", inDevelopment: "En construction", toOrder: "Sur mesure" },
  partners: {
    nav: "Collaborer",
    kicker: "Pour les agences immobilières",
    title: "Collaborez avec nous et touchez 5 % sur chaque vente",
    body: "Si vous avez des clients qui cherchent une maison sur la Costa Blanca, nous apportons le portefeuille, les visites et l'accompagnement dans leur langue. Vous percevez une commission de 5 % sur chaque vente conclue.",
    cta: "Voir le programme de collaboration",
  },
};

const dictionaries: Record<Locale, Dictionary> = { es, en, de, nl, fr };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? es;
}
