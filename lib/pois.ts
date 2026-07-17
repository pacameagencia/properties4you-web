import type { Locale } from "./i18n/config";

/** Catálogo de puntos de interés: emoji fijo + etiqueta traducida. */
export const POI_TYPES = [
  "beach",
  "airport",
  "golf",
  "hospital",
  "supermarket",
  "school",
  "services",
  "marina",
  "restaurant",
  "playground",
  "pharmacy",
  "custom",
] as const;

export type PoiType = (typeof POI_TYPES)[number];

export type Poi = {
  type: PoiType;
  distance: string; // "10 min" · "2 km" — universal en los 5 idiomas
  custom_label?: string; // solo para type=custom
  icon?: string; // emoji override opcional
};

export const POI_EMOJI: Record<PoiType, string> = {
  beach: "🏖️",
  airport: "✈️",
  golf: "🏌️",
  hospital: "🏥",
  supermarket: "🛒",
  school: "🏫",
  services: "🚶",
  marina: "⛵",
  restaurant: "🍽️",
  playground: "🛝",
  pharmacy: "💊",
  custom: "📍",
};

export const POI_LABELS: Record<PoiType, Record<Locale, string>> = {
  beach: { es: "Playa", en: "Beach", de: "Strand", nl: "Strand", fr: "Plage" },
  airport: {
    es: "Aeropuerto de Alicante",
    en: "Alicante Airport",
    de: "Flughafen Alicante",
    nl: "Luchthaven Alicante",
    fr: "Aéroport d'Alicante",
  },
  golf: {
    es: "Campo de golf",
    en: "Golf course",
    de: "Golfplatz",
    nl: "Golfbaan",
    fr: "Terrain de golf",
  },
  hospital: {
    es: "Hospital",
    en: "Hospital",
    de: "Krankenhaus",
    nl: "Ziekenhuis",
    fr: "Hôpital",
  },
  supermarket: {
    es: "Supermercado",
    en: "Supermarket",
    de: "Supermarkt",
    nl: "Supermarkt",
    fr: "Supermarché",
  },
  school: {
    es: "Colegio internacional",
    en: "International school",
    de: "Internationale Schule",
    nl: "Internationale school",
    fr: "École internationale",
  },
  services: {
    es: "Servicios a pie",
    en: "Amenities on foot",
    de: "Dienstleistungen zu Fuß",
    nl: "Voorzieningen te voet",
    fr: "Services à pied",
  },
  marina: {
    es: "Puerto deportivo",
    en: "Marina",
    de: "Yachthafen",
    nl: "Jachthaven",
    fr: "Port de plaisance",
  },
  restaurant: {
    es: "Restaurantes",
    en: "Restaurants",
    de: "Restaurants",
    nl: "Restaurants",
    fr: "Restaurants",
  },
  playground: {
    es: "Parque infantil",
    en: "Playground",
    de: "Spielplatz",
    nl: "Speeltuin",
    fr: "Aire de jeux",
  },
  pharmacy: {
    es: "Farmacia",
    en: "Pharmacy",
    de: "Apotheke",
    nl: "Apotheek",
    fr: "Pharmacie",
  },
  custom: {
    es: "Personalizado",
    en: "Custom",
    de: "Benutzerdefiniert",
    nl: "Aangepast",
    fr: "Personnalisé",
  },
};

export function poiLabel(poi: Poi, locale: Locale): string {
  if (poi.type === "custom" && poi.custom_label) return poi.custom_label;
  return POI_LABELS[poi.type]?.[locale] ?? POI_LABELS[poi.type]?.es ?? poi.type;
}

export function poiEmoji(poi: Poi): string {
  return poi.icon || POI_EMOJI[poi.type] || "📍";
}

/** Extras filtrables. */
export const AMENITIES = [
  "sea_views",
  "private_pool",
  "ready_now",
  "frontline_golf",
] as const;

export type Amenity = (typeof AMENITIES)[number];

export const AMENITY_LABELS: Record<Amenity, Record<Locale, string>> = {
  sea_views: {
    es: "Vistas al mar",
    en: "Sea views",
    de: "Meerblick",
    nl: "Zeezicht",
    fr: "Vue mer",
  },
  private_pool: {
    es: "Piscina privada",
    en: "Private pool",
    de: "Privatpool",
    nl: "Privézwembad",
    fr: "Piscine privée",
  },
  ready_now: {
    es: "Lista para entrar a vivir",
    en: "Ready to move in",
    de: "Bezugsfertig",
    nl: "Instapklaar",
    fr: "Prêt à vivre",
  },
  frontline_golf: {
    es: "Primera línea de golf",
    en: "Frontline golf",
    de: "Erste Golflinie",
    nl: "Eerstelijns golf",
    fr: "Front de golf",
  },
};
