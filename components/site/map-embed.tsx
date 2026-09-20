"use client";

import { MapPin } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useConsent, writeConsent } from "@/lib/consent";

/**
 * Mapa de Google en la ficha, cargado solo con consentimiento.
 *
 * El iframe de Google Maps instala cookies al cargar. Hasta que el visitante
 * acepta (aviso de cookies o botón aquí mismo) se pinta un marco con el nombre
 * de la zona y el botón de carga; el enlace "Cómo llegar" sigue disponible
 * fuera de este componente porque abre Google en otra pestaña.
 */
export function MapEmbed({
  query,
  label,
  dict,
}: {
  /** Texto ya codificado para la URL (zona + provincia). */
  query: string;
  /** Texto legible: "Torrevieja · Alicante". */
  label: string;
  dict: Dictionary;
}) {
  const consent = useConsent();

  if (consent === "all") {
    return (
      <iframe
        src={`https://www.google.com/maps?q=${query}&z=13&output=embed`}
        title={label}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="h-[320px] w-full border-0 sm:h-[400px]"
      />
    );
  }

  return (
    <div className="relative grid h-[320px] w-full place-items-center overflow-hidden bg-surface sm:h-[400px]">
      {/* Retícula sutil para que se lea como mapa sin cargar nada externo */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-line) 1px, transparent 1px), linear-gradient(90deg, var(--color-line) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="relative px-6 text-center">
        <MapPin size={22} className="mx-auto text-gold" />
        <p className="mt-3 font-display text-2xl text-ink">{label}</p>
        <button
          type="button"
          onClick={() => writeConsent("all")}
          className="mt-5 rounded-full bg-gold px-6 py-3 text-[0.72rem] uppercase tracking-[0.16em] text-bg transition-transform hover:scale-[1.03]"
        >
          {dict.cookies.loadMap}
        </button>
        <p className="mt-3 text-xs text-faint">{dict.cookies.loadMapHint}</p>
      </div>
    </div>
  );
}
