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
