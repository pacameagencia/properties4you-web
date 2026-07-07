"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { PropertyMedia } from "./property-media";

export function CollectionShowcase({
  properties,
  locale,
  dict,
}: {
  properties: Property[];
  locale: Locale;
  dict: Dictionary;
}) {
  if (!properties.length) return null;
  // duplicamos para bucle infinito
  const strip = [...properties, ...properties];
  // duración proporcional al nº de tarjetas (~6.5s por tarjeta)
  const duration = properties.length * 6.5;

  return (
    <section className="relative z-10 overflow-hidden bg-bg-2 py-24">
      <div className="mx-auto mb-12 w-full max-w-7xl px-5 sm:px-8">
        <p className="kicker mb-3">{dict.featured.kicker}</p>
        <h2 className="font-display text-4xl font-light text-ink sm:text-6xl">
          Un paseo por la colección
        </h2>
      </div>

      {/* filmstrip con auto-scroll; pausa al pasar el ratón */}
      <div className="film-mask group relative">
        <style>{`
          @keyframes film-scroll { to { transform: translateX(calc(-50% - 0.75rem)); } }
          .film-mask:hover .film-track { animation-play-state: paused; }
          @media (prefers-reduced-motion: reduce) { .film-track { animation: none !important; } }
        `}</style>
        <div
          className="film-track flex w-max gap-6 px-5 sm:px-8"
          style={{ animation: `film-scroll ${duration}s linear infinite` }}
        >
          {strip.map((p, i) => (
            <Link
              key={`${p.id}-${i}`}
              href={`/${locale}/propiedad/${p.slug}`}
              className="film-card group/card relative h-[58vh] max-h-[560px] w-[78vw] shrink-0 overflow-hidden rounded-3xl border border-line sm:w-[46vw] lg:w-[34vw]"
            >
              <div className="h-full w-full transition-transform duration-[1200ms] ease-out group-hover/card:scale-105">
                <PropertyMedia
                  src={p.cover_image}
                  alt={p.name}
                  sizes="(max-width: 640px) 78vw, 36vw"
                  priority={i < 2}
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-7">
                <div>
                  <p className="kicker mb-2 text-gold/90">
                    ◆ {p.zone} · {p.province}
                  </p>
                  <h3 className="font-display text-3xl text-ink">{p.name}</h3>
                  <p className="mt-1 text-sm text-muted">
                    {p.price_from ? dict.card.from + " " : ""}
                    {formatPrice(p.price, locale)}
                  </p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-white/25 bg-black/30 text-ink backdrop-blur transition-all duration-500 group-hover/card:bg-gold group-hover/card:text-bg">
                  <ArrowRight size={18} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-12 text-center">
        <Link
          href={`/${locale}/propiedades`}
          className="link-underline text-[0.78rem] uppercase tracking-[0.16em] text-gold"
        >
          {dict.featured.viewAll} →
        </Link>
      </div>
    </section>
  );
}
