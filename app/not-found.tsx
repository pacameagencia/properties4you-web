"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

/**
 * 404 raíz: atrapa URLs sin ruta (fuera del árbol [lang]).
 * Detecta el idioma del primer segmento para responder traducido.
 */
export default function RootNotFound() {
  const pathname = usePathname();
  const seg = (pathname || "/").split("/")[1] || "";
  const locale = isLocale(seg) ? seg : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <main className="grid min-h-screen place-items-center bg-bg px-5">
      <div className="text-center">
        <div className="mb-10 flex items-center justify-center gap-[2px]">
          <span className="font-display text-xl text-ink">PROPERTIES</span>
          <span className="font-display text-xl text-gold">4</span>
          <span className="font-display text-xl text-ink">YOU</span>
        </div>
        <p className="font-display text-8xl text-gold/40">404</p>
        <h1 className="mt-4 font-display text-3xl font-light text-ink sm:text-5xl">
          {dict.notFound.title}
        </h1>
        <p className="mx-auto mt-4 max-w-md text-muted">{dict.notFound.body}</p>
        <Link
          href={`/${locale}`}
          className="mt-8 inline-block rounded-full bg-gold px-8 py-3.5 text-[0.75rem] uppercase tracking-[0.16em] text-bg"
        >
          {dict.notFound.back}
        </Link>
      </div>
    </main>
  );
}
