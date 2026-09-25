import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Camera } from "lucide-react";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSettings } from "@/lib/queries";
import { alternatesFor } from "@/lib/seo";
import { Reveal } from "@/components/site/reveal";
import { ABOUT, INSTAGRAM_URL } from "@/lib/about";
import fotoReinierKarina from "@/public/nosotros/reinier-karina.jpg";
import { ContactForm } from "@/components/site/contact-form";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "es";
  const dict = getDictionary(locale);
  return {
    title: dict.nav.about,
    description: ABOUT[locale].title,
    alternates: alternatesFor(locale, "/nosotros"),
  };
}

/** "**texto**" -> <strong>texto</strong>, sin HTML crudo. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? (
          <strong key={i} className="font-medium text-ink">
            {part.slice(2, -2)}
          </strong>
        ) : (
          part
        ),
      )}
    </>
  );
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
  const about = ABOUT[locale];

  return (
    <>
      {/* Quiénes somos: Reinier y Karina (texto del cliente, 2026-09-25) */}
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-40 sm:px-8">
        <Reveal>
          <p className="kicker mb-6 text-center">{about.kicker}</p>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="mx-auto max-w-4xl text-center font-display text-4xl font-light leading-tight text-ink sm:text-6xl">
            {about.title}
          </h1>
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
          <Reveal delay={160}>
            <figure className="lg:sticky lg:top-28">
              <div className="relative aspect-[3/4] overflow-hidden rounded-3xl border border-line">
                <Image
                  src={fotoReinierKarina}
                  alt={about.photoAlt}
                  fill
                  priority
                  placeholder="blur"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover"
                />
              </div>
              <figcaption className="mt-4 text-center text-sm text-faint">
                Reinier &amp; Karina · Properties4You
              </figcaption>
            </figure>
          </Reveal>

          <div className="space-y-5">
            {about.story.map((p, i) =>
              // Las frases cortas marcan el giro de la historia: van destacadas.
              p.length < 45 && !p.includes("**") ? (
                <Reveal key={i}>
                  <p className="pt-2 font-display text-2xl italic text-gold-soft sm:text-3xl">{p}</p>
                </Reveal>
              ) : (
                <Reveal key={i}>
                  <p className="text-lg leading-relaxed text-muted">
                    <Rich text={p} />
                  </p>
                </Reveal>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Por qué comprar con nosotros */}
      <section className="border-y border-line bg-bg-2">
        <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8">
          <Reveal>
            <h2 className="text-center font-display text-4xl font-light text-ink sm:text-5xl">
              {about.whyTitle}
            </h2>
          </Reveal>
          {/* Lista editorial y no rejilla: los textos tienen longitudes muy
              distintas (1 a 3 párrafos) y en tarjetas quedaban huecos. */}
          <div className="mx-auto mt-14 max-w-5xl divide-y divide-line border-y border-line">
            {about.why.map((w, i) => (
              <Reveal key={w.title}>
                <article className="grid gap-4 py-10 md:grid-cols-[5rem_minmax(0,1fr)_minmax(0,1.6fr)] md:gap-10">
                  <p className="font-display text-4xl text-gold">{String(i + 1).padStart(2, "0")}</p>
                  <h3 className="font-display text-2xl leading-snug text-ink sm:text-3xl">{w.title}</h3>
                  <div className="space-y-3">
                    {w.body.map((b, j) => (
                      <p key={j} className="leading-relaxed text-muted">
                        <Rich text={b} />
                      </p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Sigue nuestro viaje: el botón solo aparece cuando hay perfil de Instagram */}
      <section className="mx-auto max-w-3xl px-5 pt-24 text-center sm:px-8">
        <Reveal>
          <Camera className="mx-auto text-gold" size={26} />
          <h2 className="mt-5 font-display text-4xl font-light text-ink">{about.followTitle}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted">{about.followBody}</p>
          {INSTAGRAM_URL && (
            <a
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-3 rounded-full border border-gold px-8 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-gold transition-colors hover:bg-gold hover:text-bg"
            >
              <Camera size={16} /> {about.followCta}
            </a>
          )}
        </Reveal>
      </section>

      <section className="mx-auto max-w-5xl px-5 pb-28 pt-20 sm:px-8">
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

        {/* Contacto por correo: aquí aterriza "Hablar con nosotros" de la portada */}
        <Reveal delay={120}>
          <div className="mt-14">
            <ContactForm dict={dict} locale={locale} kind="contacto" contactEmail={email} />
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
