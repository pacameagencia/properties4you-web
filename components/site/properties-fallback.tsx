import { SlidersHorizontal } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Property } from "@/lib/types";
import { PropertyCard } from "./property-card";

/**
 * Catálogo servido desde el servidor.
 *
 * Por qué existe: `PropertiesExplorer` usa `useSearchParams()`, lo que obliga a
 * Next a abandonar el prerender de ese subárbol y a pintar el fallback del
 * <Suspense> en el HTML estático. El fallback era `null`, así que
 * /propiedades se publicaba con CERO fichas y CERO enlaces en el HTML: ni
 * Google ni ningún rastreador veían una sola propiedad, y el usuario veía un
 * hueco en blanco hasta que hidrataba el JS.
 *
 * Esto pinta el estado por defecto (sin filtros, orden "destacadas primero"),
 * que es exactamente lo que ve quien entra a /propiedades sin query string.
 * Al hidratar, el explorador interactivo toma el relevo con el mismo
 * contenido, así que el relevo no se nota.
 *
 * Deliberadamente NO usa <Reveal>: esas animaciones arrancan en opacity 0 y
 * solo llegan a 1 cuando Framer Motion hidrata. Aquí nunca hidrata (este árbol
 * se reemplaza), así que envolverlo dejaría las tarjetas invisibles.
 */
export function PropertiesFallback({
  properties,
  locale,
  dict,
}: {
  properties: Property[];
  locale: Locale;
  dict: Dictionary;
}) {
  const list = [...properties].sort(
    (a, b) => Number(b.featured) - Number(a.featured) || b.sort_order - a.sort_order,
  );

  // Mismas alturas y bordes que la barra real, para que el relevo no provoque
  // salto de maquetación (CLS).
  const pill =
    "h-10 rounded-xl border border-line bg-surface px-3.5 text-sm leading-10 text-muted";

  return (
    <>
      <div className="mb-10 flex flex-wrap items-center gap-2.5 border-y border-line py-4">
        <SlidersHorizontal size={15} className="mr-1 shrink-0 text-faint" />
        <span className={pill}>{dict.filters.zone}</span>
        <span className={pill}>{dict.filters.type}</span>
        <span className={pill}>{dict.filters.bedrooms}</span>
        <span className={pill}>€ · {dict.filters.all}</span>
        <span className={pill}>✦ {dict.filters.extras}</span>
        <span className={`ms-auto ${pill}`}>{dict.filters.sort}</span>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-faint">
          {list.length} {dict.filters.results}
        </p>
      </div>

      {list.length === 0 ? (
        <p className="py-24 text-center text-muted">{dict.property.noResults}</p>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((p, i) => (
            <PropertyCard
              key={p.id}
              property={p}
              locale={locale}
              dict={dict}
              priority={i < 3}
            />
          ))}
        </div>
      )}
    </>
  );
}
