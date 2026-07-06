import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSettings } from "@/lib/queries";
import { Reveal } from "@/components/site/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const dict = getDictionary(isLocale(lang) ? lang : "es");
  return { title: dict.nav.about };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const settings = await getSettings();

  const email = settings?.contact_email || "info@properties4you.es";
  const phone = settings?.contact_phone || "+34 650 37 92 58";
  const address = settings?.address || "03187 Los Montesinos, Alicante";
  const custom = settings?.translations?.[locale];

  return (
    <>
      <section className="mx-auto max-w-4xl px-5 pb-16 pt-40 text-center sm:px-8">
        <Reveal>
          <p className="kicker mb-6">{dict.about.kicker}</p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="font-display text-5xl font-light leading-tight text-ink sm:text-7xl">
            {custom?.aboutTitle || dict.about.title}
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-muted">
            {custom?.aboutBody || dict.about.body}
          </p>
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-28 sm:px-8">
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-3">
            <a
              href={`mailto:${email}`}
              className="flex flex-col items-center gap-3 bg-surface p-8 text-center transition-colors hover:bg-surface-2"
            >
              <Mail className="text-gold" size={22} />
              <span className="kicker">{dict.footer.contact}</span>
              <span className="text-sm text-ink">{email}</span>
            </a>
            <a
              href={`tel:${phone.replace(/\s/g, "")}`}
              className="flex flex-col items-center gap-3 bg-surface p-8 text-center transition-colors hover:bg-surface-2"
            >
              <Phone className="text-gold" size={22} />
              <span className="kicker">Tel</span>
              <span className="text-sm text-ink">{phone}</span>
            </a>
            <div className="flex flex-col items-center gap-3 bg-surface p-8 text-center">
              <MapPin className="text-gold" size={22} />
              <span className="kicker">{dict.property.location}</span>
              <span className="text-sm text-ink">{address}</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={150}>
          <div className="mt-14 text-center">
            <Link
              href={`/${locale}/propiedades`}
              className="inline-flex items-center gap-3 rounded-full bg-ink px-8 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-bg transition-colors hover:bg-gold"
            >
              {dict.featured.viewAll}
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
