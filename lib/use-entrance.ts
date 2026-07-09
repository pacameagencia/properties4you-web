"use client";

import { useEffect, useState } from "react";

declare global {
  interface Window {
    __p4yIntroUntil?: number;
  }
}

/**
 * Sincroniza las animaciones de entrada con el preloader.
 * Si el preloader está en pantalla, `ready` se activa justo cuando su
 * cortina empieza a subir; si no hay preloader (sesión ya iniciada),
 * se activa de inmediato. Así la coreografía del hero SIEMPRE se ve.
 */
export function useEntrance(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const until = window.__p4yIntroUntil ?? 0;
    const wait = Math.max(0, until - Date.now());
    const t = window.setTimeout(() => setReady(true), wait);
    return () => window.clearTimeout(t);
  }, []);

  return ready;
}
