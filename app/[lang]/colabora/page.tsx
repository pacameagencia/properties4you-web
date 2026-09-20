import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSettings } from "@/lib/queries";
import { PARTNERS } from "@/lib/partners";
import { alternatesFor } from "@/lib/seo";
import { Reveal } from "@/components/site/reveal";
import { ContactForm } from "@/components/site/contact-form";

export const revalidate = 600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const locale = isLocale(lang) ? lang : "es";
  const c = PARTNERS[locale];
  return {
    title: c.title,
    description: c.intro.slice(0, 160),
    alternates: alternatesFor(locale, "/colabora"),
  };
}

/**
 * Programa de colaboración para agencias inmobiliarias en el extranjero: el
 * mercado principal del cliente. Una cifra grande (la comisión), tres pasos y
 * el formulario. El texto vive en lib/partners.ts.
 */
export default async function PartnersPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  const locale = lang as Locale;
  const dict = getDictionary(locale);
  const c = PARTNERS[locale];
  const settings = await getSettings();
  const email = settings?.contact_email || "info@properties4you.es";

  return (
    <>
      {/* CABECERA: titular + la cifra que importa */}
      <section className="relative overflow-hidden border-b border-line">
        <div className="pointer-events-none absolute -right-40 top-10 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[140px]" />
        <div className="relative mx-auto grid max-w-7xl items-end gap-12 px-5 pb-20 pt-40 sm:px-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Reveal>
              <p className="kicker mb-6">{dict.partners.kicker}</p>
            </Reveal>
            <Reveal delay={120}>
              <h1 className="font-display text-5xl font-light leading-[1.02] text-ink sm:text-7xl">
                {c.title}
              </h1>
            </Reveal>
            <Reveal delay={240}>
              <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted">{c.intro}</p>
            </Reveal>
          </div>
          <Reveal delay={300}>
            <div className="relative rounded-3xl border border-gold/30 bg-surface p-8 sm:p-10">
              <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />
              <p className="font-display text-[6.5rem] font-light leading-none text-gold sm:text-[8rem]">
                {c.commission}
              </p>
              <p className="mt-3 max-w-xs leading-relaxed text-muted">{c.commissionNote}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PASOS */}
      <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8">
        <Reveal>
          <h2 className="font-display text-4xl font-light text-ink sm:text-5xl">{c.stepsTitle}</h2>
        </Reveal>
        <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-line bg-line md:grid-cols-3">
          {c.steps.map((s, i) => (
            <Reveal key={s.h} delay={i * 120}>
              <div className="flex h-full flex-col bg-surface p-8">
                <span className="font-display text-5xl font-light text-gold/50">0{i + 1}</span>
                <h3 className="mt-6 font-display text-2xl text-ink">{s.h.replace(/^\d\s·\s/, "")}</h3>
                <p className="mt-4 leading-relaxed text-muted">{s.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* QUÉ RECIBES + FORMULARIO */}
      <section className="border-t border-line bg-bg-2">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <Reveal>
              <h2 className="font-display text-4xl font-light text-ink sm:text-5xl">{c.whyTitle}</h2>
            </Reveal>
            <ul className="mt-10 space-y-5">
              {c.why.map((w, i) => (
                <Reveal key={i} delay={i * 90}>
                  <li className="flex items-start gap-4 leading-relaxed text-muted">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                    {w}
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
          <Reveal delay={150}>
            <ContactForm
              dict={dict}
              locale={locale}
              kind="colabora"
              contactEmail={email}
              title={c.formTitle}
              body={c.formBody}
            />
          </Reveal>
        </div>
      </section>
    </>
  );
}
