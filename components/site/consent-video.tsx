"use client";
import { useConsent, writeConsent } from "@/lib/consent";
import type { Dictionary } from "@/lib/i18n/dictionaries";

export function ConsentVideo({src, title, dict}: {src: string; title: string; dict: Dictionary}) {
  const consent = useConsent();
  if (consent === "all") return <iframe src={src} title={title} className="h-full w-full" loading="lazy" allow="encrypted-media; picture-in-picture" allowFullScreen />;
  return <div className="grid h-full place-content-center bg-surface p-6 text-center">
    <button type="button" onClick={() => writeConsent("all")} className="mx-auto rounded-full bg-gold px-6 py-3 text-sm text-bg">{dict.cookies.loadVideo}</button>
    <p className="mt-3 max-w-md text-xs text-muted">{dict.cookies.externalHint}</p>
  </div>;
}
