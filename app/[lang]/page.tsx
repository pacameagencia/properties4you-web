import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPublishedProperties } from "@/lib/queries";
import { Reveal } from "@/components/site/reveal";
import { Marquee } from "@/components/site/marquee";
import { PropertyCard } from "@/components/site/property-card";
import { Hero } from "@/components/site/hero";
import { CountUp } from "@/components/site/count-up";
import { CollectionShowcase } from "@/components/site/collection-showcase";
import { Magnetic } from "@/components/site/magnetic";
import { OutlineMarquee } from "@/components/site/outline-marquee";

export const revalidate = 600;

const ZONES = [
  "Los Montesinos",
  "Dolores",
  "La Finca Golf",
  "Pilar de la Horadada",
  "Rojales",
  "San Fulgencio",
];

const MARQUEE_WORDS: Record<Locale, string[]> = {
  es: ["Costa Blanca", "Mediterráneo", "Obra Nueva"],
  de: ["Costa Blanca", "Mittelmeer", "Neubau"],
  nl: ["Costa Blanca", "Middellandse Zee", "Nieuwbouw"],
  en: ["Costa Blanca", "Mediterranean", "New Build"],
};

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);

  const all = await getPublishedProperties();
  const featured = (all.filter((p) => p.featured).length
    ? all.filter((p) => p.featured)
    : all
  ).slice(0, 6);
  const heroImages = featured
    .map((p) => p.cover_image)
    .filter((s): s is string => !!s)
    .slice(0, 5);

  const stats = [
    { value: 320, suffix: "", label: dict.stats.sun },
    { value: 18, suffix: "", label: dict.stats.developments },
    { value: 10, suffix: "", label: dict.stats.warranty },
    { text: "A–B", label: dict.stats.energy },
  ];

  return (
    <>
      <Hero locale={locale} dict={dict} images={heroImages} />

      <Marquee items={ZONES} />

      {/* STATS */}
      <section className="relative z-10 bg-bg">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-12 px-5 py-20 sm:px-8 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="px-4 text-center">
              <div className="font-display text-5xl text-gold sm:text-6xl">
                {"text" in s ? (
                  s.text
                ) : (
                  <CountUp value={s.value!} suffix={s.suffix} />
                )}
              </div>
              <p className="mx-auto mt-3 max-w-[16ch] text-xs uppercase tracking-[0.16em] text-muted">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* FIRMA */}
      <section className="relative z-10 overflow-hidden border-t border-line bg-bg-2">
        {heroImages[1] && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-[0.08]"
            style={{ backgroundImage: `url(${heroImages[1]})` }}
          />
        )}
        <div className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 -translate-x-1/2 bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        <div className="relative mx-auto max-w-5xl px-5 py-28 text-center sm:px-8">
          <Reveal>
            <p className="kicker mb-8">{dict.firm.kicker}</p>
          </Reveal>
          <Reveal delay={120}>
            <h2 className="font-display text-3xl font-light leading-tight text-ink sm:text-5xl">
              {dict.firm.title}
            </h2>
          </Reveal>
          <Reveal delay={240}>
            <p className="mx-auto mt-8 max-w-2xl leading-relaxed text-muted">
              {dict.firm.body}
            </p>
          </Reveal>
        </div>
      </section>

      {/* DESTACADAS */}
      <section className="relative z-10 bg-bg">
        <div className="mx-auto max-w-7xl px-5 py-28 sm:px-8">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Reveal>
                <p className="kicker mb-4">{dict.featured.kicker}</p>
              </Reveal>
              <Reveal delay={100}>
                <h2 className="font-display text-4xl font-light text-ink sm:text-6xl">
                  {dict.featured.title}
                </h2>
              </Reveal>
              <Reveal delay={200}>
                <p className="mt-4 max-w-md text-muted">{dict.featured.subtitle}</p>
              </Reveal>
            </div>
            <Reveal delay={200}>
              <Link
                href={`/${locale}/propiedades`}
                className="link-underline hidden text-[0.78rem] uppercase tracking-[0.16em] text-gold sm:inline-block"
              >
                {dict.featured.viewAll} →
              </Link>
            </Reveal>
          </div>

          <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p, i) => (
              <Reveal key={p.id} delay={(i % 3) * 120}>
                <PropertyCard
                  property={p}
                  locale={locale}
                  dict={dict}
                  priority={i < 3}
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE EDITORIAL OUTLINE */}
      <OutlineMarquee words={MARQUEE_WORDS[locale]} gold />

      {/* PASEO POR LA COLECCIÓN — filmstrip */}
      <CollectionShowcase properties={all} locale={locale} dict={dict} />

      {/* DESTINO */}
      <section className="relative z-10 overflow-hidden border-t border-line bg-bg">
        <div className="pointer-events-none absolute -left-32 top-1/2 h-[400px] w-[400px] -translate-y-1/2 rounded-full bg-sea/10 blur-[120px]" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-28 sm:px-8 lg:grid-cols-2">
          <div>
            <Reveal>
              <p className="kicker mb-5">{dict.destination.kicker}</p>
            </Reveal>
            <Reveal delay={120}>
              <h2 className="font-display text-4xl font-light leading-tight text-ink sm:text-6xl">
                {dict.destination.title}
              </h2>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-7 max-w-lg leading-relaxed text-muted">
                {dict.destination.body}
              </p>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <div className="grid grid-cols-2 gap-4">
              {ZONES.slice(0, 4).map((z) => {
                const zoneProperty = all.find(
                  (p) => p.zone === z && p.cover_image,
                );
                return (
                  <Link
                    key={z}
                    href={`/${locale}/propiedades`}
                    className="group relative flex aspect-square flex-col justify-end overflow-hidden rounded-2xl border border-line p-5 transition-colors hover:border-gold/50"
                  >
                    {zoneProperty?.cover_image && (
                      <div
                        className="absolute inset-0 bg-cover bg-center opacity-60 transition-all duration-700 group-hover:scale-105 group-hover:opacity-80"
                        style={{
                          backgroundImage: `url(${zoneProperty.cover_image})`,
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d10]/95 via-[#0a0d10]/30 to-transparent" />
                    <span className="relative text-gold">◆</span>
                    <span className="relative mt-2 font-display text-2xl text-ink">
                      {z}
                    </span>
                    <span className="relative text-xs uppercase tracking-widest text-muted">
                      Alicante
                    </span>
                  </Link>
                );
              })}
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 bg-bg-2">
        <div className="mx-auto max-w-5xl px-5 py-28 text-center sm:px-8">
          <Reveal>
            <h2 className="font-display text-4xl font-light text-ink sm:text-6xl">
              {dict.cta.title}
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mx-auto mt-6 max-w-xl text-muted">{dict.cta.body}</p>
          </Reveal>
          <Reveal delay={240}>
            <div className="mt-10 flex justify-center">
              <Magnetic strength={0.5}>
                <Link
                  href={`/${locale}/propiedades`}
                  className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-bg"
                >
                  {dict.cta.button}
                  <ArrowRight size={16} />
                </Link>
              </Magnetic>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
