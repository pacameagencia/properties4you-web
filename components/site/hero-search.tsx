"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { motion } from "framer-motion";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const PRICE_OPTIONS = [
  { v: "", label: "" }, // any
  { v: "0", label: "< 200.000 €" },
  { v: "1", label: "200–300.000 €" },
  { v: "2", label: "300–400.000 €" },
  { v: "3", label: "> 400.000 €" },
];

const selectCls =
  "h-12 w-full appearance-none rounded-xl border border-line bg-bg-2/80 px-4 text-sm text-ink outline-none transition-colors focus:border-gold";

/** Buscador principal bajo el hero: la mayoría empieza filtrando. */
export function HeroSearch({
  locale,
  dict,
  zones,
  types,
}: {
  locale: Locale;
  dict: Dictionary;
  zones: string[];
  types: string[];
}) {
  const router = useRouter();
  const [zone, setZone] = useState("");
  const [type, setType] = useState("");
  const [beds, setBeds] = useState("");
  const [price, setPrice] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = new URLSearchParams();
    if (zone) q.set("zona", zone);
    if (type) q.set("tipo", type);
    if (beds) q.set("dorm", beds);
    if (price) q.set("precio", price);
    router.push(`/${locale}/propiedades${q.size ? `?${q}` : ""}`);
  }

  return (
    <section className="relative z-20 bg-bg">
      <motion.form
        onSubmit={submit}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto -mt-14 grid w-[calc(100%-2.5rem)] max-w-5xl grid-cols-2 gap-3 rounded-2xl border border-line bg-[#10151a]/95 p-4 shadow-[0_24px_60px_-12px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:grid-cols-4 lg:grid-cols-[1fr_1fr_1fr_1fr_auto]"
      >
        <label className="col-span-1">
          <span className="mb-1.5 block text-[0.62rem] uppercase tracking-[0.18em] text-faint">
            {dict.filters.zone}
          </span>
          <select value={zone} onChange={(e) => setZone(e.target.value)} className={selectCls}>
            <option value="">{dict.search.any}</option>
            {zones.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>
        </label>

        <label className="col-span-1">
          <span className="mb-1.5 block text-[0.62rem] uppercase tracking-[0.18em] text-faint">
            {dict.filters.type}
          </span>
          <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls}>
            <option value="">{dict.search.any}</option>
            {types.map((t) => (
              <option key={t} value={t}>
                {dict.types[t] ?? t}
              </option>
            ))}
          </select>
        </label>

        <label className="col-span-1">
          <span className="mb-1.5 block text-[0.62rem] uppercase tracking-[0.18em] text-faint">
            {dict.filters.bedrooms}
          </span>
          <select value={beds} onChange={(e) => setBeds(e.target.value)} className={selectCls}>
            <option value="">{dict.search.any}</option>
            {[1, 2, 3, 4].map((n) => (
              <option key={n} value={n}>
                {n}+
              </option>
            ))}
          </select>
        </label>

        <label className="col-span-1">
          <span className="mb-1.5 block text-[0.62rem] uppercase tracking-[0.18em] text-faint">
            €
          </span>
          <select value={price} onChange={(e) => setPrice(e.target.value)} className={selectCls}>
            <option value="">{dict.search.any}</option>
            {PRICE_OPTIONS.slice(1).map((o) => (
              <option key={o.v} value={o.v}>
                {o.label}
              </option>
            ))}
          </select>
        </label>

        <button
          type="submit"
          className="col-span-2 flex h-12 items-center justify-center gap-2 self-end rounded-xl bg-gold px-7 text-[0.75rem] uppercase tracking-[0.16em] text-bg transition-transform hover:scale-[1.02] sm:col-span-4 lg:col-span-1"
        >
          <Search size={15} />
          {dict.search.button}
        </button>
      </motion.form>
    </section>
  );
}
