"use client";

import { Plus, Trash2 } from "lucide-react";
import {
  POI_TYPES,
  POI_EMOJI,
  POI_LABELS,
  AMENITIES,
  AMENITY_LABELS,
  type Poi,
} from "@/lib/pois";

const inputCls =
  "w-full rounded-lg border border-line bg-bg px-3 py-2 text-sm text-ink outline-none transition-colors focus:border-gold";

/** Editor de servicios cercanos: añadir / editar / borrar filas por propiedad. */
export function PoisEditor({
  pois,
  onChange,
}: {
  pois: Poi[];
  onChange: (next: Poi[]) => void;
}) {
  const update = (i: number, patch: Partial<Poi>) =>
    onChange(pois.map((p, idx) => (idx === i ? { ...p, ...patch } : p)));

  return (
    <div className="space-y-3">
      {pois.map((poi, i) => (
        <div key={i} className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
          <span className="w-8 text-center text-lg">{POI_EMOJI[poi.type] ?? "📍"}</span>
          <select
            value={poi.type}
            onChange={(e) => update(i, { type: e.target.value as Poi["type"] })}
            className={`${inputCls} sm:w-56`}
          >
            {POI_TYPES.map((t) => (
              <option key={t} value={t}>
                {POI_EMOJI[t]} {POI_LABELS[t].es}
              </option>
            ))}
          </select>
          {poi.type === "custom" && (
            <input
              value={poi.custom_label ?? ""}
              onChange={(e) => update(i, { custom_label: e.target.value })}
              placeholder="Etiqueta (ej. Estación AVE)"
              className={`${inputCls} sm:w-48`}
            />
          )}
          <input
            value={poi.distance}
            onChange={(e) => update(i, { distance: e.target.value })}
            placeholder="10 min · 2 km"
            className={`${inputCls} sm:w-32`}
          />
          <button
            type="button"
            onClick={() => onChange(pois.filter((_, idx) => idx !== i))}
            title="Quitar"
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-line text-muted hover:border-red-500/50 hover:text-red-400"
          >
            <Trash2 size={14} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...pois, { type: "beach", distance: "" }])}
        className="flex items-center gap-2 rounded-full border border-dashed border-line-2 px-4 py-2 text-xs uppercase tracking-widest text-muted hover:border-gold hover:text-ink"
      >
        <Plus size={13} /> Añadir servicio cercano
      </button>
      <p className="text-xs text-faint">
        La distancia se escribe una vez y vale para los 5 idiomas ("10 min", "2 km").
        Las etiquetas del catálogo se traducen solas.
      </p>
    </div>
  );
}

/** Toggles de extras filtrables. */
export function AmenitiesEditor({
  amenities,
  onChange,
}: {
  amenities: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (a: string) =>
    onChange(
      amenities.includes(a)
        ? amenities.filter((x) => x !== a)
        : [...amenities, a],
    );

  return (
    <div className="flex flex-wrap gap-2">
      {AMENITIES.map((a) => {
        const active = amenities.includes(a);
        return (
          <button
            key={a}
            type="button"
            onClick={() => toggle(a)}
            className={`rounded-full border px-4 py-2 text-xs uppercase tracking-widest transition-colors ${
              active
                ? "border-gold bg-gold/10 text-gold"
                : "border-line text-muted hover:border-line-2 hover:text-ink"
            }`}
          >
            {AMENITY_LABELS[a].es}
          </button>
        );
      })}
    </div>
  );
}
