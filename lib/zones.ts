import type { Locale } from "./i18n/config";

export type ZoneChip =
  | "beach"
  | "golf"
  | "schools"
  | "dining"
  | "nature"
  | "services";

export const CHIP_LABELS: Record<ZoneChip, Record<Locale, string>> = {
  beach: {
    es: "Playas cerca",
    en: "Beaches nearby",
    de: "Strände in der Nähe",
    nl: "Stranden dichtbij",
    fr: "Plages à proximité",
  },
  golf: { es: "Golf", en: "Golf", de: "Golf", nl: "Golf", fr: "Golf" },
  schools: {
    es: "Colegios",
    en: "Schools",
    de: "Schulen",
    nl: "Scholen",
    fr: "Écoles",
  },
  dining: {
    es: "Restaurantes",
    en: "Restaurants",
    de: "Restaurants",
    nl: "Restaurants",
    fr: "Restaurants",
  },
  nature: {
    es: "Naturaleza",
    en: "Nature",
    de: "Natur",
    nl: "Natuur",
    fr: "Nature",
  },
  services: {
    es: "Servicios",
    en: "Services",
    de: "Dienstleistungen",
    nl: "Voorzieningen",
    fr: "Services",
  },
};

type ZoneInfo = {
  chips: ZoneChip[];
  text: Record<Locale, string>;
};

/** Información curada del entorno por zona (mostrada en la ficha). */
export const ZONE_INFO: Record<string, ZoneInfo> = {
  "San Miguel de Salinas": {
    chips: ["golf", "beach", "nature", "services"],
    text: {
      es: "Pueblo con encanto sobre las colinas de la Vega Baja, rodeado de campos de golf de primer nivel como Las Colinas y Villamartín. Las playas de Orihuela Costa quedan a un cuarto de hora y el pueblo conserva comercio local, restaurantes y una vibrante comunidad internacional.",
      en: "A charming hillside town in the Vega Baja, surrounded by top golf courses such as Las Colinas and Villamartín. The beaches of Orihuela Costa are fifteen minutes away, and the town keeps its local shops, restaurants and a vibrant international community.",
      de: "Ein charmantes Hügeldorf in der Vega Baja, umgeben von erstklassigen Golfplätzen wie Las Colinas und Villamartín. Die Strände der Orihuela Costa sind eine Viertelstunde entfernt, und der Ort bewahrt lokale Geschäfte, Restaurants und eine lebendige internationale Gemeinschaft.",
      nl: "Een charmant heuveldorp in de Vega Baja, omringd door topgolfbanen zoals Las Colinas en Villamartín. De stranden van Orihuela Costa liggen op een kwartier, en het dorp behoudt lokale winkels, restaurants en een levendige internationale gemeenschap.",
      fr: "Un village de charme sur les collines de la Vega Baja, entouré de golfs de premier plan comme Las Colinas et Villamartín. Les plages d'Orihuela Costa sont à un quart d'heure et le village conserve ses commerces, ses restaurants et une communauté internationale dynamique.",
    },
  },
  "Daya Nueva": {
    chips: ["services", "dining", "beach", "nature"],
    text: {
      es: "Pueblo sereno de la huerta de la Vega Baja, con todos los servicios a un paseo y un ambiente auténtico y acogedor. Las playas de Guardamar del Segura quedan a unos 15 minutos en coche y el aeropuerto de Alicante a media hora.",
      en: "A serene town amid the Vega Baja orchards, with every amenity within walking distance and an authentic, welcoming atmosphere. The beaches of Guardamar del Segura are about 15 minutes by car and Alicante Airport half an hour away.",
      de: "Ein ruhiges Dorf inmitten der Obstgärten der Vega Baja, mit allen Annehmlichkeiten zu Fuß erreichbar und einer authentischen, einladenden Atmosphäre. Die Strände von Guardamar del Segura sind etwa 15 Autominuten entfernt, der Flughafen Alicante eine halbe Stunde.",
      nl: "Een sereen dorp te midden van de boomgaarden van de Vega Baja, met alle voorzieningen op loopafstand en een authentieke, gastvrije sfeer. De stranden van Guardamar del Segura liggen op zo'n 15 minuten rijden en de luchthaven van Alicante op een half uur.",
      fr: "Un village paisible au cœur des vergers de la Vega Baja, avec tous les services accessibles à pied et une atmosphère authentique et accueillante. Les plages de Guardamar del Segura sont à environ 15 minutes en voiture et l'aéroport d'Alicante à une demi-heure.",
    },
  },
  "VistaBella Golf": {
    chips: ["golf", "dining", "services", "nature"],
    text: {
      es: "Urbanización residencial construida alrededor del campo de golf VistaBella, con restaurantes, club social y comercio dentro del propio resort. Un entorno tranquilo entre Orihuela y San Miguel de Salinas, a 25 minutos de las playas de la Costa Blanca sur.",
      en: "A residential resort built around the VistaBella golf course, with restaurants, a social club and shops within the development itself. A peaceful setting between Orihuela and San Miguel de Salinas, 25 minutes from the southern Costa Blanca beaches.",
      de: "Eine Wohnanlage rund um den Golfplatz VistaBella, mit Restaurants, Clubhaus und Geschäften innerhalb des Resorts. Eine ruhige Lage zwischen Orihuela und San Miguel de Salinas, 25 Minuten von den Stränden der südlichen Costa Blanca.",
      nl: "Een woonresort gebouwd rond de golfbaan VistaBella, met restaurants, een sociëteit en winkels binnen het resort zelf. Een rustige omgeving tussen Orihuela en San Miguel de Salinas, op 25 minuten van de stranden van de zuidelijke Costa Blanca.",
      fr: "Un resort résidentiel construit autour du golf VistaBella, avec restaurants, club-house et commerces au sein même du domaine. Un cadre paisible entre Orihuela et San Miguel de Salinas, à 25 minutes des plages de la Costa Blanca sud.",
    },
  },
  "Los Montesinos": {
    chips: ["beach", "golf", "dining", "services"],
    text: {
      es: "Pueblo tranquilo junto a las lagunas rosas de Torrevieja, con playas de La Mata y Torrevieja a unos 15 minutos, golf La Marquesa cerca y todos los servicios diarios, colegios y restaurantes a mano.",
      en: "A peaceful town beside Torrevieja's pink lagoons, with La Mata and Torrevieja beaches around 15 minutes away, La Marquesa golf nearby and everyday services, schools and restaurants close at hand.",
      de: "Ruhiger Ort neben den rosafarbenen Lagunen von Torrevieja, mit den Stränden von La Mata und Torrevieja in rund 15 Minuten, dem Golfplatz La Marquesa in der Nähe sowie Schulen, Restaurants und allen Dienstleistungen des Alltags.",
      nl: "Rustig dorp naast de roze lagunes van Torrevieja, met de stranden van La Mata en Torrevieja op zo'n 15 minuten, golfbaan La Marquesa dichtbij en alle dagelijkse voorzieningen, scholen en restaurants binnen handbereik.",
      fr: "Village paisible au bord des lagunes roses de Torrevieja, avec les plages de La Mata et Torrevieja à environ 15 minutes, le golf La Marquesa à proximité et tous les services du quotidien, écoles et restaurants à portée de main.",
    },
  },
  Dolores: {
    chips: ["beach", "schools", "dining", "services"],
    text: {
      es: "Pueblo tradicional de la Vega Baja rodeado de huerta, con mercado semanal, colegios y ambiente local auténtico. Las playas de Guardamar quedan a unos 20 minutos en coche.",
      en: "A traditional Vega Baja town surrounded by orchards, with a weekly market, schools and an authentic local atmosphere. Guardamar's beaches are about 20 minutes away by car.",
      de: "Traditioneller Ort der Vega Baja, umgeben von Obstgärten, mit Wochenmarkt, Schulen und authentischem lokalem Flair. Die Strände von Guardamar sind mit dem Auto etwa 20 Minuten entfernt.",
      nl: "Traditioneel dorp in de Vega Baja omgeven door boomgaarden, met een weekmarkt, scholen en een authentieke lokale sfeer. De stranden van Guardamar liggen op zo'n 20 minuten rijden.",
      fr: "Village traditionnel de la Vega Baja entouré de vergers, avec marché hebdomadaire, écoles et une authentique ambiance locale. Les plages de Guardamar sont à environ 20 minutes en voiture.",
    },
  },
  "La Finca Golf": {
    chips: ["golf", "dining", "beach", "services"],
    text: {
      es: "Resort residencial en torno al campo de golf La Finca (Algorfa), con club social, restaurantes y ambiente internacional. Las playas de Guardamar y Torrevieja quedan a unos 20 minutos.",
      en: "A residential resort around La Finca golf course (Algorfa), with a clubhouse, restaurants and an international atmosphere. Guardamar and Torrevieja beaches are about 20 minutes away.",
      de: "Wohnresort rund um den Golfplatz La Finca (Algorfa) mit Clubhaus, Restaurants und internationalem Ambiente. Die Strände von Guardamar und Torrevieja liegen etwa 20 Minuten entfernt.",
      nl: "Residentieel resort rond golfbaan La Finca (Algorfa), met clubhuis, restaurants en een internationale sfeer. De stranden van Guardamar en Torrevieja liggen op zo'n 20 minuten.",
      fr: "Resort résidentiel autour du golf La Finca (Algorfa), avec club-house, restaurants et ambiance internationale. Les plages de Guardamar et Torrevieja sont à environ 20 minutes.",
    },
  },
  "Pilar de la Horadada": {
    chips: ["beach", "schools", "dining", "nature"],
    text: {
      es: "Municipio costero en el límite sur de la Costa Blanca: las playas y el paseo de Torre de la Horadada quedan a pocos minutos, con puerto deportivo, colegios y una gran oferta de restaurantes.",
      en: "A coastal town at the southern edge of the Costa Blanca: Torre de la Horadada's beaches and promenade are just minutes away, with a marina, schools and a wide choice of restaurants.",
      de: "Küstenort am südlichen Rand der Costa Blanca: die Strände und die Promenade von Torre de la Horadada sind nur wenige Minuten entfernt, dazu Sporthafen, Schulen und eine große Auswahl an Restaurants.",
      nl: "Kustgemeente aan de zuidrand van de Costa Blanca: de stranden en boulevard van Torre de la Horadada liggen op enkele minuten, met jachthaven, scholen en een ruime keuze aan restaurants.",
      fr: "Commune côtière à l'extrémité sud de la Costa Blanca : les plages et la promenade de Torre de la Horadada sont à quelques minutes, avec port de plaisance, écoles et un grand choix de restaurants.",
    },
  },
  Rojales: {
    chips: ["nature", "golf", "beach", "services"],
    text: {
      es: "Junto al paraje natural de las salinas y el río Segura, con una consolidada comunidad internacional, golf La Marquesa y todos los servicios. Las playas de Guardamar están a unos 15 minutos.",
      en: "Beside the natural salt lakes and the Segura river, with a well-established international community, La Marquesa golf and full services. Guardamar's beaches are about 15 minutes away.",
      de: "Direkt am Naturgebiet der Salinen und am Fluss Segura, mit etablierter internationaler Gemeinschaft, dem Golfplatz La Marquesa und allen Dienstleistungen. Die Strände von Guardamar sind rund 15 Minuten entfernt.",
      nl: "Naast het natuurgebied van de zoutmeren en de rivier de Segura, met een gevestigde internationale gemeenschap, golfbaan La Marquesa en alle voorzieningen. De stranden van Guardamar liggen op zo'n 15 minuten.",
      fr: "Au bord du site naturel des salines et du fleuve Segura, avec une communauté internationale bien établie, le golf La Marquesa et tous les services. Les plages de Guardamar sont à environ 15 minutes.",
    },
  },
  "San Fulgencio": {
    chips: ["beach", "nature", "dining", "services"],
    text: {
      es: "Zona residencial junto a las dunas y pinadas de La Marina, con la playa a unos 10 minutos, comunidad internacional consolidada, restaurantes y servicios cotidianos.",
      en: "A residential area beside the dunes and pine woods of La Marina, with the beach about 10 minutes away, an established international community, restaurants and everyday services.",
      de: "Wohngebiet neben den Dünen und Pinienwäldern von La Marina, mit dem Strand in etwa 10 Minuten, etablierter internationaler Gemeinschaft, Restaurants und allen Alltagsdiensten.",
      nl: "Woonwijk naast de duinen en dennenbossen van La Marina, met het strand op zo'n 10 minuten, een gevestigde internationale gemeenschap, restaurants en dagelijkse voorzieningen.",
      fr: "Zone résidentielle près des dunes et pinèdes de La Marina, avec la plage à environ 10 minutes, une communauté internationale établie, des restaurants et les services du quotidien.",
    },
  },
  Torrevieja: {
    chips: ["beach", "dining", "services", "nature"],
    text: {
      es: "Ciudad costera viva todo el año, con paseo marítimo, puerto deportivo y kilómetros de playas urbanas. Sus dos lagunas de sal — la rosa y la verde — crean un microclima reconocido por la OMS entre los más saludables de Europa, y hay comercio, sanidad y ocio a cualquier hora.",
      en: "A coastal city alive all year round, with a seafront promenade, a marina and kilometres of urban beaches. Its two salt lagoons — one pink, one green — create a microclimate ranked by the WHO among the healthiest in Europe, with shops, healthcare and leisure at any hour.",
      de: "Eine Küstenstadt, die das ganze Jahr über lebt: Strandpromenade, Sporthafen und kilometerlange Stadtstrände. Ihre zwei Salzlagunen — die rosafarbene und die grüne — schaffen ein Mikroklima, das die WHO zu den gesündesten Europas zählt; Geschäfte, Gesundheitsversorgung und Freizeit zu jeder Stunde.",
      nl: "Een kuststad die het hele jaar leeft, met een boulevard, een jachthaven en kilometers stadsstrand. De twee zoutmeren — het roze en het groene — zorgen voor een microklimaat dat de WHO tot de gezondste van Europa rekent, met winkels, zorg en vertier op elk uur.",
      fr: "Ville côtière vivante toute l'année, avec promenade maritime, port de plaisance et des kilomètres de plages urbaines. Ses deux lagunes salées — la rose et la verte — créent un microclimat classé par l'OMS parmi les plus sains d'Europe, avec commerces, santé et loisirs à toute heure.",
    },
  },
  "Ciudad Quesada": {
    chips: ["golf", "beach", "dining", "services"],
    text: {
      es: "Urbanización consolidada sobre las colinas de Rojales, con el campo de golf La Marquesa en casa, comercio y restaurantes abiertos todo el año y una gran comunidad internacional. Las playas de Guardamar quedan a unos 10 minutos en coche.",
      en: "An established urbanisation on the hills of Rojales, with La Marquesa golf course on the doorstep, shops and restaurants open all year and a large international community. The beaches of Guardamar are about 10 minutes away by car.",
      de: "Etablierte Urbanisation auf den Hügeln von Rojales, mit dem Golfplatz La Marquesa vor der Tür, ganzjährig geöffneten Geschäften und Restaurants und einer großen internationalen Gemeinschaft. Die Strände von Guardamar sind etwa 10 Autominuten entfernt.",
      nl: "Gevestigde urbanisatie op de heuvels van Rojales, met golfbaan La Marquesa om de hoek, winkels en restaurants die het hele jaar open zijn en een grote internationale gemeenschap. De stranden van Guardamar liggen op zo'n 10 minuten rijden.",
      fr: "Urbanisation établie sur les collines de Rojales, avec le golf La Marquesa à deux pas, des commerces et restaurants ouverts toute l'année et une grande communauté internationale. Les plages de Guardamar sont à environ 10 minutes en voiture.",
    },
  },
};
