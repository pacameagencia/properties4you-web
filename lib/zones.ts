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
};
