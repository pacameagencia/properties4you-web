"use client";

import Link from "next/link";
import { Cookie } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useConsent, writeConsent } from "@/lib/consent";

/**
 * Aviso de cookies. Sale una vez, abajo, sin tapar el contenido, y desaparece
 * con cualquiera de las dos decisiones. "Solo lo necesario" es tan visible como
 * "Aceptar todo": rechazar no puede costar más clics que aceptar.
 */
export function CookieBanner({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const consent = useConsent();
  if (consent !== null) return null; // undefined (hidratando) o ya decidido

  return (
    <div
      role="dialog"
      aria-labelledby="p4y-cookie-title"
      className="fixed inset-x-3 bottom-[4.5rem] z-50 mx-auto max-w-xl rounded-2xl border border-line bg-[#0a0d10]/95 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.55)] backdrop-blur-xl sm:inset-x-6 sm:bottom-6 sm:mx-0 sm:max-w-md"
      style={{ animation: "p4y-cookie-in .5s cubic-bezier(.22,1,.36,1) both" }}
    >
      <div className="flex items-start gap-3">
        <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full border border-gold/40 text-gold">
          <Cookie size={15} />
        </span>
        <div>
          <p id="p4y-cookie-title" className="font-display text-xl text-ink">
            {dict.cookies.title}
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-muted">{dict.cookies.body}</p>
          <Link
            href={`/${locale}/legal/cookies`}
            className="mt-2 inline-block text-xs text-gold underline underline-offset-4"
          >
            {dict.cookies.more}
          </Link>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => writeConsent("essential")}
          className="rounded-full border border-line px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-ink hover:text-ink"
        >
          {dict.cookies.essential}
        </button>
        <button
          type="button"
          onClick={() => writeConsent("all")}
          className="rounded-full bg-gold px-4 py-2.5 text-[0.7rem] uppercase tracking-[0.14em] text-bg transition-transform hover:scale-[1.02]"
        >
          {dict.cookies.accept}
        </button>
      </div>
      <style>{`@keyframes p4y-cookie-in { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: none } }`}</style>
    </div>
  );
}
