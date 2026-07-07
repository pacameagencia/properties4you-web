import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import { isLocale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getFeaturedProperties } from "@/lib/queries";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/site/reveal";
import { Marquee } from "@/components/site/marquee";
import { PropertyCard } from "@/components/site/property-card";

const ZONES = [
  "Los Montesinos",
  "Dolores",
  "La Finca Golf",
  "Pilar de la Horadada",
  "Rojales",
  "San Fulgencio",
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const featured = await getFeaturedProperties(6);
  const heroImage = featured.find((p) => p.cover_image)?.cover_image ?? null;

  const stats = [
    { value: "320", label: dict.stats.sun },
    { value: "18", label: dict.stats.developments },
    { value: "10", label: dict.stats.warranty },
    { value: "A–B", label: dict.stats.energy },
  ];

  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        {/* fondo: mejor foto de la cartera + degradados */}
        {heroImage && (
          <div
            className="absolute inset-0 scale-105 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d10]/85 via-[#0a0d10]/45 to-[#0a0d10]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d10]/80 via-[#0a0d10]/20 to-transparent" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_70%_10%,rgba(201,164,100,0.10),transparent_55%)]" />
        {/* halo de luz mediterránea */}
        <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[120px]" />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-40 sm:px-8">
          <Reveal>
            <p className="kicker mb-6">{dict.hero.kicker}</p>
          </Reveal>
          <Reveal delay={120}>
            <h1 className="max-w-4xl font-display text-5xl font-light leading-[1.02] text-ink sm:text-7xl lg:text-8xl">
              {dict.hero.title}{" "}
              <span className="italic text-gold-soft">{dict.hero.titleAccent}</span>
            </h1>
          </Reveal>
          <Reveal delay={240}>
            <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
              {dict.hero.subtitle}
            </p>
          </Reveal>
          <Reveal delay={360}>
            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                href={`/${locale}/propiedades`}
                className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-bg transition-all hover:bg-gold"
              >
                {dict.hero.ctaProperties}
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
              <Link
                href={`/${locale}/nosotros`}
                className="link-underline text-[0.78rem] uppercase tracking-[0.18em] text-ink"
              >
                {dict.hero.ctaAbout}
              </Link>
            </div>
          </Reveal>
        </div>

        <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center">
          <div className="mx-auto h-10 w-px bg-gradient-to-b from-transparent via-gold/60 to-transparent" />
          <span className="mt-2 block text-[0.6rem] uppercase tracking-[0.3em] text-faint">
            {dict.hero.scroll}
          </span>
        </div>
      </section>

      {/* ============== MARQUEE ZONAS ============== */}
      <Marquee items={ZONES} />

      {/* ============== STATS ============== */}
      <section className="relative z-10 bg-bg">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-px overflow-hidden px-5 py-20 sm:px-8 lg:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 100} className="px-4 text-center">
              <div className="font-display text-5xl text-gold sm:text-6xl">
                {s.value}
              </div>
              <p className="mx-auto mt-3 max-w-[16ch] text-xs uppercase tracking-[0.16em] text-muted">
                {s.label}
              </p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============== FIRMA ============== */}
      <section className="relative z-10 border-t border-line bg-bg-2">
        <div className="mx-auto max-w-5xl px-5 py-28 text-center sm:px-8">
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

      {/* ============== DESTACADAS ============== */}
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

          <div className="mt-12 text-center sm:hidden">
            <Link
              href={`/${locale}/propiedades`}
              className="link-underline text-[0.78rem] uppercase tracking-[0.16em] text-gold"
            >
              {dict.featured.viewAll} →
            </Link>
          </div>
        </div>
      </section>

      {/* ============== DESTINO ============== */}
      <section className="relative z-10 overflow-hidden border-t border-line bg-bg-2">
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
              {ZONES.slice(0, 4).map((z) => (
                <div
                  key={z}
                  className="flex aspect-square flex-col justify-end rounded-2xl border border-line bg-gradient-to-br from-surface to-bg p-5"
                >
                  <span className="text-gold">◆</span>
                  <span className="mt-2 font-display text-2xl text-ink">{z}</span>
                  <span className="text-xs uppercase tracking-widest text-faint">
                    Alicante
                  </span>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="relative z-10 bg-bg">
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
            <Link
              href={`/${locale}/propiedades`}
              className="mt-10 inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-bg transition-transform hover:scale-[1.03]"
            >
              {dict.cta.button}
              <ArrowRight size={16} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
