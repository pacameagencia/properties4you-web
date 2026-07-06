import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BedDouble,
  Bath,
  Maximize,
  Trees,
  Home,
  MapPin,
  Play,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPropertyBySlug, getPublishedProperties } from "@/lib/queries";
import { formatPrice, localizedContent } from "@/lib/utils";
import { PropertyMedia } from "@/components/site/property-media";
import { EnergyBadge } from "@/components/site/energy-badge";
import { Gallery } from "@/components/site/gallery";
import { Reveal } from "@/components/site/reveal";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  const locale = isLocale(lang) ? lang : "es";
  const p = await getPropertyBySlug(slug);
  if (!p) return { title: "Propiedad" };
  const content = localizedContent(p, locale);
  return {
    title: `${p.name} · ${p.zone}`,
    description: content.description?.slice(0, 160) || undefined,
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);

  const [property, all] = await Promise.all([
    getPropertyBySlug(slug),
    getPublishedProperties(),
  ]);
  if (!property) notFound();

  const content = localizedContent(property, locale);
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx >= 0 ? all[(idx - 1 + all.length) % all.length] : null;
  const next = idx >= 0 ? all[(idx + 1) % all.length] : null;
  const typeLabel = dict.types[property.type] ?? property.type;

  const specs = [
    property.bedrooms != null && {
      icon: BedDouble,
      label: dict.property.bedrooms,
      value: property.bedrooms,
    },
    property.bathrooms != null && {
      icon: Bath,
      label: dict.property.bathrooms,
      value: property.bathrooms,
    },
    property.area_m2 != null && {
      icon: Maximize,
      label: dict.property.area,
      value: `${property.area_m2} m²`,
    },
    property.plot_m2 != null && {
      icon: Trees,
      label: dict.property.plot,
      value: `${property.plot_m2} m²`,
    },
    { icon: Home, label: dict.property.type, value: typeLabel },
  ].filter(Boolean) as { icon: typeof Home; label: string; value: React.ReactNode }[];

  return (
    <article>
      {/* HERO */}
      <section className="relative h-[72vh] min-h-[520px] w-full overflow-hidden">
        <PropertyMedia
          src={property.cover_image}
          alt={property.name}
          priority
          sizes="100vw"
          className="scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0d10] via-[#0a0d10]/30 to-[#0a0d10]/60" />
        <div className="absolute inset-x-0 bottom-0">
          <div className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
            <nav className="mb-6 flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-faint">
              <Link href={`/${locale}`} className="hover:text-ink">
                {dict.nav.home}
              </Link>
              <span>/</span>
              <Link href={`/${locale}/propiedades`} className="hover:text-ink">
                {dict.nav.properties}
              </Link>
              <span>/</span>
              <span className="text-muted">{property.name}</span>
            </nav>
            <p className="kicker mb-3 text-gold/80">
              ◆ {property.zone} · {property.province}
            </p>
            <div className="flex flex-wrap items-end justify-between gap-6">
              <h1 className="font-display text-5xl font-light text-ink sm:text-7xl">
                {property.name}
              </h1>
              <div className="text-right">
                <span className="text-[0.68rem] uppercase tracking-[0.2em] text-faint">
                  {property.price_from ? dict.property.from : ""}
                </span>
                <p className="font-display text-4xl text-gold">
                  {formatPrice(property.price, locale)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENIDO */}
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_360px]">
          {/* Izquierda */}
          <div className="space-y-16">
            {content.description && (
              <Reveal>
                <h2 className="kicker mb-5">{dict.property.description}</h2>
                <p className="text-lg leading-relaxed text-muted">
                  {content.description}
                </p>
                {property.virtual_tour_url && (
                  <a
                    href={property.virtual_tour_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-3 rounded-full border border-line px-6 py-3 text-[0.75rem] uppercase tracking-[0.16em] text-ink transition-colors hover:border-gold hover:text-gold"
                  >
                    <Play size={15} /> {dict.property.virtualTour}
                  </a>
                )}
              </Reveal>
            )}

            {content.features && content.features.length > 0 && (
              <Reveal>
                <h2 className="kicker mb-6">{dict.property.features}</h2>
                <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                  {content.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold" />
                      {f}
                    </li>
                  ))}
                </ul>
              </Reveal>
            )}

            {property.gallery.length > 0 && (
              <Reveal>
                <h2 className="kicker mb-6">{dict.property.gallery}</h2>
                <Gallery
                  images={property.gallery}
                  name={property.name}
                  viewAllLabel={dict.property.viewGallery}
                />
              </Reveal>
            )}

            {(property.maps_url || property.latitude) && (
              <Reveal>
                <h2 className="kicker mb-6">{dict.property.location}</h2>
                <a
                  href={
                    property.maps_url ||
                    `https://www.google.com/maps/search/?api=1&query=${property.latitude},${property.longitude}`
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl border border-line bg-surface p-6 transition-colors hover:border-gold"
                >
                  <span className="flex items-center gap-4 text-ink">
                    <MapPin size={20} className="text-gold" />
                    {property.zone} · {property.province}
                  </span>
                  <span className="text-[0.72rem] uppercase tracking-[0.16em] text-gold">
                    {dict.property.openMaps} ↗
                  </span>
                </a>
              </Reveal>
            )}
          </div>

          {/* Derecha — ficha sticky */}
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="rounded-2xl border border-line bg-surface p-7">
              <div className="mb-6 flex items-center justify-between border-b border-line pb-5">
                <span className="text-[0.72rem] uppercase tracking-[0.16em] text-gold">
                  {dict.status[property.status]}
                </span>
                {property.reference && (
                  <span className="text-xs text-faint">
                    {dict.property.ref} {property.reference}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {specs.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="flex items-center gap-3 text-muted">
                      <s.icon size={16} className="text-faint" /> {s.label}
                    </span>
                    <span className="font-medium text-ink">{s.value}</span>
                  </div>
                ))}
                {property.energy_rating && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted">{dict.property.energy}</span>
                    <EnergyBadge rating={property.energy_rating} />
                  </div>
                )}
              </div>

              <div className="mt-7 border-t border-line pt-6">
                <h3 className="font-display text-xl text-ink">
                  {dict.property.interested}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {dict.property.interestedBody}
                </p>
                <Link
                  href={`/${locale}/nosotros`}
                  className="mt-5 flex items-center justify-center gap-3 rounded-full bg-gold px-6 py-3.5 text-[0.75rem] uppercase tracking-[0.16em] text-bg transition-transform hover:scale-[1.02]"
                >
                  {dict.property.contact}
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* PREV / NEXT */}
      {(prev || next) && (
        <section className="border-t border-line">
          <div className="mx-auto grid max-w-7xl grid-cols-2 divide-x divide-line">
            {prev && (
              <Link
                href={`/${locale}/propiedad/${prev.slug}`}
                className="group flex items-center gap-4 px-5 py-10 sm:px-8"
              >
                <ArrowLeft
                  size={20}
                  className="text-faint transition-colors group-hover:text-gold"
                />
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-faint">
                    {dict.property.prev}
                  </p>
                  <p className="font-display text-2xl text-ink">{prev.name}</p>
                </div>
              </Link>
            )}
            {next && (
              <Link
                href={`/${locale}/propiedad/${next.slug}`}
                className="group flex items-center justify-end gap-4 px-5 py-10 text-right sm:px-8"
              >
                <div>
                  <p className="text-[0.68rem] uppercase tracking-[0.2em] text-faint">
                    {dict.property.next}
                  </p>
                  <p className="font-display text-2xl text-ink">{next.name}</p>
                </div>
                <ArrowRight
                  size={20}
                  className="text-faint transition-colors group-hover:text-gold"
                />
              </Link>
            )}
          </div>
        </section>
      )}
    </article>
  );
}
