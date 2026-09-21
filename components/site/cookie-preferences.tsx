"use client";
import { writeConsent } from "@/lib/consent";

export function CookiePreferences({label}: {label: string}) {
  return <button type="button" onClick={() => {
    writeConsent(null);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[aria-labelledby="p4y-cookie-title"] button')?.focus());
  }} className="underline-offset-4 hover:text-ink hover:underline">{label}</button>;
}
