"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Property } from "@/lib/types";
import { useFavorites } from "@/lib/favorites";
import { PropertyCard } from "./property-card";

export function FavoritesView({
  properties,
  locale,
  dict,
}: {
  properties: Property[];
  locale: Locale;
  dict: Dictionary;
}) {
  const { favs } = useFavorites();
  const list = properties.filter((p) => favs.includes(p.slug));

  if (!list.length) {
    return (
      <div className="rounded-2xl border border-dashed border-line py-24 text-center">
        <Heart size={28} className="mx-auto text-faint" />
        <p className="mt-4 text-muted">{dict.favs.empty}</p>
        <Link
          href={`/${locale}/propiedades`}
          className="link-underline mt-6 inline-block text-[0.78rem] uppercase tracking-[0.16em] text-gold"
        >
          {dict.favs.browse} →
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((p) => (
        <PropertyCard key={p.id} property={p} locale={locale} dict={dict} />
      ))}
    </div>
  );
}
