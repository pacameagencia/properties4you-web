import Link from "next/link";
import { BedDouble, Bath, Maximize, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { PropertyMedia } from "./property-media";

export function PropertyCard({
  property,
  locale,
  dict,
  priority,
}: {
  property: Property;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
}) {
  const p = property;
  const typeLabel = dict.types[p.type] ?? p.type;

  return (
    <Link
      href={`/${locale}/propiedad/${p.slug}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-all duration-500 hover:border-line-2 hover:-translate-y-1"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <PropertyMedia
          src={p.cover_image}
          alt={p.name}
          priority={priority}
          className="transition-transform duration-[900ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-ink backdrop-blur">
          {dict.status[p.status] ?? p.status}
        </span>
        <span className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/30 text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
          <ArrowUpRight size={16} />
        </span>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <p className="kicker mb-2 text-gold/80">
          ◆ {p.zone} · {p.province}
        </p>
        <h3 className="font-display text-2xl font-medium text-ink">{p.name}</h3>

        <div className="mt-4 flex items-center gap-5 text-sm text-muted">
          {p.bedrooms != null && (
            <span className="flex items-center gap-1.5">
              <BedDouble size={15} className="text-faint" /> {p.bedrooms}
            </span>
          )}
          {p.bathrooms != null && (
            <span className="flex items-center gap-1.5">
              <Bath size={15} className="text-faint" /> {p.bathrooms}
            </span>
          )}
          {p.area_m2 != null && (
            <span className="flex items-center gap-1.5">
              <Maximize size={15} className="text-faint" /> {p.area_m2} m²
            </span>
          )}
        </div>

        <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
          <div>
            <p className="text-[0.62rem] uppercase tracking-[0.2em] text-faint">
              {typeLabel} · {p.price_from ? dict.card.from : ""}
            </p>
            <p className="font-display text-2xl text-ink">
              {formatPrice(p.price, locale)}
            </p>
          </div>
          <span className="text-[0.72rem] uppercase tracking-[0.16em] text-gold transition-transform duration-500 group-hover:translate-x-1">
            {dict.card.view} →
          </span>
        </div>
      </div>
    </Link>
  );
}
