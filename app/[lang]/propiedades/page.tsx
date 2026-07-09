import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublishedProperties, getSettings } from "@/lib/queries";
import { PropertiesExplorer } from "@/components/site/properties-explorer";
import { Reveal } from "@/components/site/reveal";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "es");
  return { title: dict.nav.properties };
}

export default async function PropertiesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const [properties, settings] = await Promise.all([
    getPublishedProperties(),
    getSettings(),
  ]);
  const whatsapp = (settings?.contact_phone || "+34 650 37 92 58").replace(/\D/g, "");

  return (
    <section className="mx-auto max-w-7xl px-5 pb-28 pt-36 sm:px-8">
      <Reveal>
        <p className="kicker mb-5">{dict.featured.kicker}</p>
      </Reveal>
      <Reveal delay={100}>
        <h1 className="font-display text-5xl font-light text-ink sm:text-7xl">
          {dict.nav.properties}
        </h1>
      </Reveal>
      <Reveal delay={200}>
        <p className="mt-5 max-w-xl text-muted">{dict.featured.subtitle}</p>
      </Reveal>

      <div className="mt-16">
        <PropertiesExplorer
          properties={properties}
          locale={locale}
          dict={dict}
          whatsapp={whatsapp}
        />
      </div>
    </section>
  );
}
