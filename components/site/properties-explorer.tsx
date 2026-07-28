"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BellRing, SlidersHorizontal, ChevronDown } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import { AMENITIES, AMENITY_LABELS, type Amenity } from "@/lib/pois";
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
  const params = useSearchParams();
  const [zone, setZone] = useState<string>(params.get("zona") ?? "");
  const [type, setType] = useState<string>(params.get("tipo") ?? "");
  const [band, setBand] = useState<number>(() => {
    const raw = params.get("precio");
    if (raw === null || raw === "") return -1; // Number(null) sería 0 y activaría la 1ª banda
    const b = Number(raw);
    return Number.isInteger(b) && b >= 0 && b < PRICE_BANDS.length ? b : -1;
  });
  const [beds, setBeds] = useState<number>(Number(params.get("dorm")) || 0);
  const [amenities, setAmenities] = useState<string[]>(() => {
    const a = params.get("extras");
    return a ? a.split(",").filter((x) => (AMENITIES as readonly string[]).includes(x)) : [];
  });
  const [sort, setSort] = useState<Sort>("featured");
  const [extrasOpen, setExtrasOpen] = useState(false);

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
      if (amenities.length && !amenities.every((a) => p.amenities?.includes(a)))
        return false;
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
  }, [properties, zone, type, band, beds, amenities, sort]);

  const selectCls =
    "h-10 appearance-none rounded-xl border border-line bg-surface px-3.5 pr-8 text-sm text-muted outline-none transition-colors hover:text-ink focus:border-gold [background-image:url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2210%22 height=%226%22><path d=%22M1 1l4 4 4-4%22 stroke=%22%236b747c%22 fill=%22none%22 stroke-width=%221.5%22/></svg>')] [background-position:right_0.8rem_center] [background-repeat:no-repeat]";

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
      {/* Filtros — barra compacta de desplegables, como los portales clásicos */}
      <div className="mb-10 flex flex-wrap items-center gap-2.5 border-y border-line py-4">
        <SlidersHorizontal size={15} className="mr-1 shrink-0 text-faint" />

        <select
          value={zone}
          onChange={(e) => setZone(e.target.value)}
          aria-label={dict.filters.zone}
          className={selectCls}
        >
          <option value="">{dict.filters.zone}</option>
          {zones.map((z) => (
            <option key={z} value={z}>
              {z}
            </option>
          ))}
        </select>

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          aria-label={dict.filters.type}
          className={selectCls}
        >
          <option value="">{dict.filters.type}</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {dict.types[t] ?? t}
            </option>
          ))}
        </select>

        <select
          value={beds}
          onChange={(e) => setBeds(Number(e.target.value))}
          aria-label={dict.filters.bedrooms}
          className={selectCls}
        >
          <option value={0}>{dict.filters.bedrooms}</option>
          {[1, 2, 3].map((n) => (
            <option key={n} value={n}>
              {n}+
            </option>
          ))}
        </select>

        <select
          value={band}
          onChange={(e) => setBand(Number(e.target.value))}
          aria-label="€"
          className={selectCls}
        >
          <option value={-1}>€ · {dict.filters.all}</option>
          {PRICE_BANDS.map((b, i) => (
            <option key={b.label} value={i}>
              {b.label}
            </option>
          ))}
        </select>

        {/* Extras: botón discreto con panel desplegable */}
        <div className="relative">
          <button
            onClick={() => setExtrasOpen((v) => !v)}
            aria-expanded={extrasOpen}
            className={cn(
              "flex h-10 items-center gap-1.5 rounded-xl border px-3.5 text-sm transition-colors",
              amenities.length
                ? "border-gold/60 bg-gold/10 text-gold"
                : "border-line bg-surface text-muted hover:text-ink",
            )}
          >
            ✦ {dict.filters.extras}
            {amenities.length > 0 && (
              <span className="grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.62rem] font-semibold text-bg">
                {amenities.length}
              </span>
            )}
            <ChevronDown
              size={13}
              className={cn("transition-transform", extrasOpen && "rotate-180")}
            />
          </button>
          {extrasOpen && (
            <>
              <button
                aria-hidden
                tabIndex={-1}
                onClick={() => setExtrasOpen(false)}
                className="fixed inset-0 z-30 cursor-default"
              />
              <div className="absolute left-0 top-12 z-40 w-64 rounded-2xl border border-line bg-[#10151a] p-3 shadow-[0_18px_50px_-12px_rgba(0,0,0,0.7)]">
                {AMENITIES.map((a) => {
                  const active = amenities.includes(a);
                  return (
                    <button
                      key={a}
                      onClick={() =>
                        setAmenities((prev) =>
                          prev.includes(a)
                            ? prev.filter((x) => x !== a)
                            : [...prev, a],
                        )
                      }
                      className={cn(
                        "flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm transition-colors",
                        active ? "text-gold" : "text-muted hover:text-ink",
                      )}
                    >
                      {AMENITY_LABELS[a as Amenity][locale]}
                      <span
                        className={cn(
                          "grid h-4 w-4 place-items-center rounded border text-[0.6rem]",
                          active
                            ? "border-gold bg-gold text-bg"
                            : "border-line-2",
                        )}
                      >
                        {active ? "✓" : ""}
                      </span>
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </div>

        <div className="ms-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            aria-label={dict.filters.sort}
            className={selectCls}
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
