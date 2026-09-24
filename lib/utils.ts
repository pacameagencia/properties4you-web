import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { Locale } from "./i18n/config";
import type { Property, PropertyContent } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(value: number | null, locale: Locale = "es"): string {
  if (value == null) return "—";
  return new Intl.NumberFormat(locale === "en" ? "en-GB" : locale, {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Superficie en m², con el separador decimal de cada idioma.
 *
 * `area_m2` y `plot_m2` son numeric(6,2) desde la migración 001: el material de
 * cliente viene con dos decimales (189,78 m²) y redondear en inmobiliaria es
 * perder información que el comprador compara.
 *
 * Los enteros se muestran sin decimales: 150 → "150 m²", no "150,00 m²".
 * El separador lo decide Intl por idioma, que es quien lo sabe:
 *   es · de · fr · nl → "189,78 m²"   ·   en → "189.78 m²"
 * (el neerlandés usa coma decimal, como el español, no punto.)
 */
export function formatArea(
  value: number | null | undefined,
  locale: Locale = "es",
): string | null {
  if (value == null) return null;

  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return null;

  return new Intl.NumberFormat(locale === "en" ? "en-GB" : locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}


/** Lo mismo pero con la unidad puesta: "189,78 m²". */
export function formatAreaWithUnit(
  value: number | null | undefined,
  locale: Locale = "es",
): string | null {
  const formatted = formatArea(value, locale);
  return formatted == null ? null : `${formatted} m²`;
}

/** Contenido traducible con fallback en cascada al español. */
export function localizedContent(
  property: Pick<Property, "translations">,
  locale: Locale,
): PropertyContent {
  const t = property.translations ?? {};
  const chosen = t[locale];
  if (chosen && (chosen.description || (chosen.features && chosen.features.length))) {
    return chosen;
  }
  return t.es ?? {};
}

/**
 * Versión ligera de una ficha para componentes de cliente (tarjetas, catálogo,
 * carrusel). Sin galería, textos en 5 idiomas ni POIs: con 59 fichas, pasarlas
 * enteras metía ~150 KB de datos en el HTML de la portada y del catálogo.
 */
export function toCard<T extends { gallery: unknown[]; translations: object; pois: unknown[] }>(p: T): T {
  return { ...p, gallery: [], translations: {}, pois: [] };
}

/**
 * URL del optimizador de Next para imágenes usadas como fondo CSS, que no pasan
 * por <Image>. Sin esto se descargaba el original de Supabase (hasta 360 KB).
 * El ancho debe ser uno de los deviceSizes por defecto de Next.
 */
export function optimizedBg(src: string, width: 640 | 828 | 1080 | 1200 | 1920 = 828): string {
  // q=75: en Next 16 solo se aceptan las calidades de images.qualities (por
  // defecto [75]); cualquier otra devuelve 400 (visto en producción).
  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;
}
