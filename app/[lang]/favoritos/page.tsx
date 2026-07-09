import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublishedProperties } from "@/lib/queries";
import { FavoritesView } from "@/components/site/favorites-view";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "es");
  return { title: dict.favs.title, robots: { index: false } };
}

export default async function FavoritesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const properties = await getPublishedProperties();

  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8">
      <h1 className="font-display text-5xl font-light text-ink sm:text-7xl">
        {dict.favs.title}
      </h1>
      <div className="mt-14">
        <FavoritesView properties={properties} locale={locale} dict={dict} />
      </div>
    </section>
  );
}
