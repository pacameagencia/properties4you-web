"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Property } from "@/lib/types";
import { cn } from "@/lib/utils";
import { PropertyCard } from "./property-card";
import { Reveal } from "./reveal";

type Sort = "featured" | "price_asc" | "price_desc";

export function PropertiesExplorer({
  properties,
  locale,
  dict,
}: {
  properties: Property[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [zone, setZone] = useState<string>("");
  const [type, setType] = useState<string>("");
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
    let list = properties.filter(
      (p) => (!zone || p.zone === zone) && (!type || p.type === type),
    );
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
  }, [properties, zone, type, sort]);

  const chip = (active: boolean) =>
    cn(
      "rounded-full border px-4 py-2 text-[0.72rem] uppercase tracking-[0.14em] transition-colors",
      active
        ? "border-gold bg-gold/10 text-gold"
        : "border-line text-muted hover:border-line-2 hover:text-ink",
    );

  return (
    <>
      {/* Filtros */}
      <div className="mb-10 flex flex-col gap-5 border-y border-line py-6">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-2 text-[0.68rem] uppercase tracking-[0.2em] text-faint">
            {dict.filters.zone}
          </span>
          <button className={chip(!zone)} onClick={() => setZone("")}>
            {dict.filters.all}
          </button>
          {zones.map((z) => (
            <button key={z} className={chip(zone === z)} onClick={() => setZone(z)}>
              {z}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="mr-2 text-[0.68rem] uppercase tracking-[0.2em] text-faint">
              {dict.filters.type}
            </span>
            <button className={chip(!type)} onClick={() => setType("")}>
              {dict.filters.all}
            </button>
            {types.map((t) => (
              <button
                key={t}
                className={chip(type === t)}
                onClick={() => setType(t)}
              >
                {dict.types[t] ?? t}
              </button>
            ))}
          </div>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className="rounded-full border border-line bg-surface px-4 py-2 text-[0.72rem] uppercase tracking-[0.12em] text-muted outline-none focus:border-gold"
          >
            <option value="featured">{dict.filters.sort}</option>
            <option value="price_asc">{dict.filters.priceUp}</option>
            <option value="price_desc">{dict.filters.priceDown}</option>
          </select>
        </div>
      </div>

      <p className="mb-8 text-sm text-faint">
        {filtered.length} {dict.filters.results}
      </p>

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
