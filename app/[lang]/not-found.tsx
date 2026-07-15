"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isLocale, defaultLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function NotFound() {
  const pathname = usePathname();
  const seg = pathname.split("/")[1] || "";
  const locale = isLocale(seg) ? seg : defaultLocale;
  const dict = getDictionary(locale);

  return (
    <section className="flex min-h-[70vh] flex-col items-center justify-center px-5 text-center">
      <p className="font-display text-8xl text-gold/40">404</p>
      <h1 className="mt-4 font-display text-3xl font-light text-ink sm:text-5xl">
        {dict.notFound.title}
      </h1>
      <p className="mt-4 max-w-md text-muted">{dict.notFound.body}</p>
      <Link
        href={`/${locale}`}
        className="mt-8 rounded-full bg-gold px-8 py-3.5 text-[0.75rem] uppercase tracking-[0.16em] text-bg"
      >
        {dict.notFound.back}
      </Link>
    </section>
  );
}
