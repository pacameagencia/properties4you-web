import type { Metadata } from "next";
import { locales, defaultLocale, type Locale } from "@/lib/i18n/config";

/** Dominio público. Todo lo que se publique cuelga de aquí. */
export const SITE_URL = "https://properties4you.es";

/**
 * Canónica y hreflang de UNA página concreta.
 *
 * Por qué existe este helper: `alternates` se declaraba en app/[lang]/layout.tsx
 * y Next lo hereda tal cual en todas las páginas hijas, porque el merge de
 * metadata es superficial: una página que solo define `title` se queda con el
 * `alternates` del layout. Resultado en producción: las 110 URLs del sitemap
 * declaraban como canónica la portada de su idioma y los hreflang apuntaban
 * siempre a las cinco portadas. Para Google eso son 5 páginas, no 110, y las
 * fichas quedaban fuera del índice.
 *
 * La regla ahora es: el layout NO declara alternates y cada página llama a
 * `alternatesFor` con su propia ruta.
 *
 * @param lang   Idioma de esta página.
 * @param path   Ruta SIN el prefijo de idioma y CON barra inicial.
 *               La portada es "" (cadena vacía).
 *               Ej.: "/propiedades", "/propiedad/mirador-del-sol".
 */
export function alternatesFor(lang: Locale, path = ""): Metadata["alternates"] {
  const clean = path && !path.startsWith("/") ? `/${path}` : path;

  const languages: Record<string, string> = {};
  for (const l of locales) {
    languages[l] = `${SITE_URL}/${l}${clean}`;
  }
  // x-default: a quien no encaje en ningún idioma le damos el español, que es
  // el idioma del país donde está la agencia.
  languages["x-default"] = `${SITE_URL}/${defaultLocale}${clean}`;

  return {
    canonical: `${SITE_URL}/${lang}${clean}`,
    languages,
  };
}
