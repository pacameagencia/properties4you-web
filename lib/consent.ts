"use client";

import { useEffect, useState } from "react";

/**
 * Consentimiento de cookies, guardado en el navegador del visitante.
 *
 *   "all"       → puede cargarse contenido de terceros (mapa de Google, vídeo).
 *   "essential" → solo almacenamiento técnico (favoritos, idioma).
 *   null        → aún no ha decidido: se muestra el aviso.
 *
 * localStorage puede fallar (modo privado, datos bloqueados): cada acceso va en
 * try/catch y en ese caso el sitio se comporta como "essential".
 */
export type Consent = "all" | "essential";
const KEY = "p4y-consent";
const EVENT = "p4y-consent-change";

export function readConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(v: Consent): void {
  try {
    localStorage.setItem(KEY, v);
  } catch {
    /* sin almacenamiento: el aviso volverá a salir la próxima vez */
  }
  window.dispatchEvent(new CustomEvent(EVENT, { detail: v }));
}

/** Hook: `undefined` mientras hidrata (no pintar nada), luego el valor real. */
export function useConsent(): Consent | null | undefined {
  const [consent, setConsent] = useState<Consent | null | undefined>(undefined);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lectura de localStorage tras hidratar
    setConsent(readConsent());
    const onChange = (e: Event) => setConsent((e as CustomEvent<Consent>).detail);
    window.addEventListener(EVENT, onChange);
    return () => window.removeEventListener(EVENT, onChange);
  }, []);
  return consent;
}
