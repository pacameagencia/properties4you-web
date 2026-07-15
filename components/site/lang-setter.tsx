"use client";

import { useEffect } from "react";
import type { Locale } from "@/lib/i18n/config";

/** Sincroniza el atributo lang del <html> con el idioma de la ruta. */
export function LangSetter({ locale }: { locale: Locale }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);
  return null;
}
