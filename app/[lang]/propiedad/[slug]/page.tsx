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
  Navigation,
} from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getPropertyBySlug, getPublishedProperties, getSettings } from "@/lib/queries";
import { formatPrice, localizedContent } from "@/lib/utils";
import { ZONE_INFO, CHIP_LABELS } from "@/lib/zones";
import { poiLabel, poiEmoji, AMENITY_LABELS, type Amenity } from "@/lib/pois";
import { PropertyMedia } from "@/components/site/property-media";
import { EnergyBadge } from "@/components/site/energy-badge";
import { StoriesGallery } from "@/components/site/stories-gallery";
import { Reveal } from "@/components/site/reveal";
import { PropertyCard } from "@/components/site/property-card";
import { MortgageCalculator } from "@/components/site/mortgage-calculator";
import { VisitForm } from "@/components/site/visit-form";
import { ShareButtons } from "@/components/site/share-buttons";
import { QuickContact } from "@/components/site/quick-contact";
import { FavButton } from "@/components/site/fav-button";

export const revalidate = 600;

export async function generateStaticParams() {
  const properties = await getPublishedProperties();
  return properties.map((p) => ({ slug: p.slug }));
}

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
    openGraph: {
      title: `${p.name} · ${p.zone}`,
      description: content.description?.slice(0, 160) || undefined,
      images: p.cover_image ? [{ url: p.cover_image }] : undefined,
    },
  };
}

/** Convierte una URL de YouTube/Vimeo en URL embebible. */
function embedUrl(url: string): string | null {
  const yt = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]{6,})/,
  );
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return null;
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

  const [property, all, settings] = await Promise.all([
    getPropertyBySlug(slug),
    getPublishedProperties(),
    getSettings(),
  ]);
  if (!property) notFound();

  const phone = settings?.contact_phone || "+34 650 37 92 58";
  const email = settings?.contact_email || "info@properties4you.es";
  const whatsapp = phone.replace(/\D/g, "");

  const content = localizedContent(property, locale);
  const idx = all.findIndex((p) => p.slug === slug);
  const prev = idx >= 0 ? all[(idx - 1 + all.length) % all.length] : null;
  const next = idx >= 0 ? all[(idx + 1) % all.length] : null;
  const typeLabel = dict.types[property.type] ?? property.type;

  // "También te puede interesar": misma zona primero, luego mismo tipo
  const related = [
    ...all.filter((p) => p.slug !== slug && p.zone === property.zone),
    ...all.filter((p) => p.slug !== slug && p.zone !== property.zone && p.type === property.type),
    ...all.filter((p) => p.slug !== slug),
  ]
    .filter((p, i, arr) => arr.findIndex((x) => x.slug === p.slug) === i)
    .slice(0, 3);

  const zoneInfo = property.zone ? ZONE_INFO[property.zone] : undefined;
  const video = property.video_url ? embedUrl(property.video_url) : null;
  const mapQuery = encodeURIComponent(
    `${property.zone ?? ""} ${property.province ?? "Alicante"} España`,
  );

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

  // SEO: datos estructurados del anuncio inmobiliario
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: property.name,
    description: content.description?.slice(0, 300),
    image: property.cover_image ?? undefined,
    sku: property.reference ?? property.slug,
    offers: {
      "@type": "Offer",
      price: property.price ?? undefined,
      priceCurrency: "EUR",
      availability:
        property.status === "en_venta"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      seller: { "@type": "RealEstateAgent", name: "Properties4You" },
    },
    additionalProperty: [
      property.bedrooms != null && {
        "@type": "PropertyValue",
        name: "bedrooms",
        value: property.bedrooms,
      },
      property.area_m2 != null && {
        "@type": "PropertyValue",
        name: "floorSize",
        value: `${property.area_m2} m²`,
      },
    ].filter(Boolean),
  };

  return (
    <article className="pb-20 sm:pb-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
        <div className="absolute right-5 top-24 z-10 sm:right-8">
          <FavButton
            slug={property.slug}
            label={{ save: dict.favs.save, saved: dict.favs.saved }}
            className="h-11 w-11"
          />
        </div>
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

            {/* Servicios cercanos bajo el precio (lo primero que mira el comprador internacional) */}
            {(property.pois.length > 0 || property.amenities.length > 0) && (
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-white/10 pt-5">
                {property.pois.map((poi, i) => (
                  <span
                    key={i}
                    className="flex items-center gap-1.5 text-sm text-ink/90"
                  >
                    <span aria-hidden>{poiEmoji(poi)}</span>
                    {poiLabel(poi, locale)}
                    <span className="text-gold">·</span>
                    <span className="text-muted">{poi.distance}</span>
                  </span>
                ))}
                {property.amenities.map((a) => (
                  <span
                    key={a}
                    className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-[0.68rem] uppercase tracking-[0.14em] text-gold"
                  >
                    {AMENITY_LABELS[a as Amenity]?.[locale] ?? a}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* COMPARTIR */}
      <div className="mx-auto max-w-7xl px-5 pt-8 sm:px-8">
        <ShareButtons dict={dict} title={`${property.name} · ${property.zone}`} />
      </div>

      {/* CONTENIDO */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        <div className="grid gap-14 lg:grid-cols-[1fr_380px]">
          {/* Izquierda */}
          <div className="space-y-16">
            {content.description && (
              <Reveal>
                <h2 className="kicker mb-5">{dict.property.description}</h2>
                <p className="text-lg leading-relaxed text-muted">
                  {content.description}
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {property.virtual_tour_url && (
                    <a
                      href={property.virtual_tour_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-3 rounded-full border border-line px-6 py-3 text-[0.75rem] uppercase tracking-[0.16em] text-ink transition-colors hover:border-gold hover:text-gold"
                    >
                      <Play size={15} /> {dict.property.virtualTour}
                    </a>
                  )}
                </div>
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
                <StoriesGallery
                  images={property.gallery}
                  name={property.name}
                  zone={property.zone}
                  dict={dict}
                  whatsapp={whatsapp}
                  viewAllLabel={dict.property.viewGallery}
                  propertyId={property.id}
                  locale={locale}
                />
              </Reveal>
            )}

            {video && (
              <Reveal>
                <h2 className="kicker mb-6">{dict.media.video}</h2>
                <div className="aspect-video overflow-hidden rounded-2xl border border-line">
                  <iframe
                    src={video}
                    title={property.name}
                    className="h-full w-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              </Reveal>
            )}

            {property.floor_plan && (
              <Reveal>
                <h2 className="kicker mb-6">{dict.media.plan}</h2>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={property.floor_plan}
                  alt={`${dict.media.plan} · ${property.name}`}
                  className="w-full rounded-2xl border border-line bg-white object-contain p-3"
                />
              </Reveal>
            )}

            {/* UBICACIÓN: mapa embebido + cómo llegar */}
            <Reveal>
              <h2 className="kicker mb-6">{dict.property.location}</h2>
              <div className="overflow-hidden rounded-2xl border border-line">
                <iframe
                  src={`https://www.google.com/maps?q=${mapQuery}&z=13&output=embed`}
                  title={`${dict.property.location} · ${property.name}`}
                  className="h-[320px] w-full grayscale-[35%] contrast-[1.05]"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
                <div className="flex flex-wrap items-center justify-between gap-3 bg-surface p-5">
                  <span className="flex items-center gap-3 text-ink">
                    <MapPin size={18} className="text-gold" />
                    {property.zone} · {property.province}
                  </span>
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${mapQuery}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-[0.72rem] uppercase tracking-[0.14em] text-gold transition-colors hover:bg-gold/10"
                  >
                    <Navigation size={14} /> {dict.quick.directions}
                  </a>
                </div>
              </div>
            </Reveal>

            {/* EL ENTORNO */}
            {zoneInfo && (
              <Reveal>
                <h2 className="kicker mb-6">{dict.zoneInfo.title}</h2>
                <p className="leading-relaxed text-muted">{zoneInfo.text[locale]}</p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {zoneInfo.chips.map((c) => (
                    <span
                      key={c}
                      className="rounded-full border border-line bg-surface px-4 py-1.5 text-[0.7rem] uppercase tracking-[0.12em] text-muted"
                    >
                      {CHIP_LABELS[c][locale]}
                    </span>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          {/* Derecha — sticky */}
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
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
              </div>
            </div>

            <VisitForm
              dict={dict}
              locale={locale}
              whatsapp={whatsapp}
              propertyId={property.id}
              propertyName={`${property.name} (${property.reference ?? property.slug})`}
            />

            {property.price != null && property.price > 0 && (
              <MortgageCalculator
                price={property.price}
                dict={dict}
                locale={locale}
              />
            )}
          </aside>
        </div>
      </section>

      {/* TAMBIÉN TE PUEDE INTERESAR */}
      {related.length > 0 && (
        <section className="border-t border-line bg-bg-2">
          <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
            <h2 className="mb-10 font-display text-3xl font-light text-ink sm:text-5xl">
              {dict.related.title}
            </h2>
            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PropertyCard key={p.id} property={p} locale={locale} dict={dict} />
              ))}
            </div>
          </div>
        </section>
      )}

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

      {/* CONTACTO RÁPIDO: barra móvil + flotante WhatsApp */}
      <QuickContact
        dict={dict}
        whatsapp={whatsapp}
        phone={phone}
        email={email}
        context={`${dict.stories.interested}: ${property.name} (${property.reference ?? ""})`}
      />
    </article>
  );
}
