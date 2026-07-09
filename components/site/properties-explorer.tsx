"use client";

import { useMemo, useState } from "react";
import { BellRing } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PropertyCard } from "./property-card";
import { Reveal } from "./reveal";

type Sort = "featured" | "price_asc" | "price_desc";
type PriceBand = { label: string; min: number; max: number };

const PRICE_BANDS: PriceBand[] = [
  { label: "< 200.000 €", min: 0, max: 200000 },
  { label: "200–300.000 €", min: 200000, max: 300000 },
  { label: "300–400.000 €", min: 300000, max: 400000 },
  { label: "> 400.000 €", min: 400000, max: Infinity },
];

export function PropertiesExplorer({
  properties,
  locale,
  dict,
  whatsapp,
}: {
  properties: Property[];
  locale: Locale;
  dict: Dictionary;
  whatsapp: string;
}) {
  const [zone, setZone] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [band, setBand] = useState<number>(-1);
  const [beds, setBeds] = useState<number>(0);
  const [sort, setSort] = useState<Sort>("featured");

  const zones = useMemo(
    () => [...new Set(properties.map((p) => p.zone).filter(Boolean))] as string[],
    [properties],
  );
  const types = useMemo(
    () => [...new Set(properties.map((p) => p.type).filter(Boolean))],
    [properties],
  );

  const filtered = useMemo(() => {
    let list = properties.filter((p) => {
      if (zone && p.zone !== zone) return false;
      if (type && p.type !== type) return false;
      if (beds && (p.bedrooms ?? 0) < beds) return false;
      if (band >= 0) {
        const b = PRICE_BANDS[band];
        const price = p.price ?? 0;
        if (price < b.min || price >= b.max) return false;
      }
      return true;
    });
    if (sort === "price_asc")
      list = [...list].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
    else if (sort === "price_desc")
      list = [...list].sort((a, b) => (b.price ?? 0) - (a.price ?? 0));
    else
      list = [...list].sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) || b.sort_order - a.sort_order,
      );
    return list;
  }, [properties, zone, type, band, beds, sort]);

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] transition-colors",
      active
        ? "border-gold bg-gold/10 text-gold"
        : "border-line text-muted hover:border-line-2 hover:text-ink",
    );

  const filterLabel =
    "mr-2 w-20 shrink-0 text-[0.68rem] uppercase tracking-[0.2em] text-faint";

  // CTA de alerta: compone la búsqueda actual y la manda por WhatsApp
  function requestAlert() {
    const parts = [
      dict.alertCta,
      zone && `· ${dict.filters.zone}: ${zone}`,
      type && `· ${dict.filters.type}: ${dict.types[type] ?? type}`,
      beds > 0 && `· ${dict.filters.bedrooms}: ${beds}+`,
      band >= 0 && `· ${PRICE_BANDS[band].label}`,
    ].filter(Boolean);
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(parts.join("\n"))}`,
      "_blank",
      "noopener",
    );
  }

  return (
    <>
      {/* Filtros */}
      <div className="mb-10 flex flex-col gap-4 border-y border-line py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className={filterLabel}>{dict.filters.zone}</span>
          <button className={chip(!zone)} onClick={() => setZone("")}>
            {dict.filters.all}
          </button>
          {zones.map((z) => (
            <button key={z} className={chip(zone === z)} onClick={() => setZone(z)}>
              {z}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={filterLabel}>{dict.filters.type}</span>
          <button className={chip(!type)} onClick={() => setType("")}>
            {dict.filters.all}
          </button>
          {types.map((t) => (
            <button key={t} className={chip(type === t)} onClick={() => setType(t)}>
              {dict.types[t] ?? t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className={filterLabel}>€</span>
          <button className={chip(band === -1)} onClick={() => setBand(-1)}>
            {dict.filters.all}
          </button>
          {PRICE_BANDS.map((b, i) => (
            <button key={b.label} className={chip(band === i)} onClick={() => setBand(i)}>
              {b.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className={filterLabel}>{dict.filters.bedrooms}</span>
            <button className={chip(beds === 0)} onClick={() => setBeds(0)}>
              {dict.filters.all}
            </button>
            {[1, 2, 3].map((n) => (
              <button key={n} className={chip(beds === n)} onClick={() => setBeds(n)}>
                {n}+
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label={dict.filters.sort}
            className="rounded-full border border-line bg-surface px-4 py-2 text-[0.72rem] uppercase tracking-[0.12em] text-muted outline-none focus:border-gold"
          >
            <option value="featured">{dict.filters.sort}</option>
            <option value="price_asc">{dict.filters.priceUp}</option>
            <option value="price_desc">{dict.filters.priceDown}</option>
          </select>
        </div>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-faint">
          {filtered.length} {dict.filters.results}
        </p>
        <button
          onClick={requestAlert}
          className="flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-[0.7rem] uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold/10"
        >
          <BellRing size={14} /> {dict.alertCta}
        </button>
      </div>

      {filtered.length === 0 ? (
        <p className="py-24 text-center text-muted">{dict.property.noResults}</p>
      ) : (
        <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => (
            <Reveal key={p.id} delay={(i % 3) * 100}>
              <PropertyCard property={p} locale={locale} dict={dict} priority={i < 3} />
            </Reveal>
          ))}
        </div>
      )}
    </>
  );
}
