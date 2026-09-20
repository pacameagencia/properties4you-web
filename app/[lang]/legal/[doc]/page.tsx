import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, type Locale } from "@/lib/i18n/config";
import { LEGAL, LEGAL_SLUGS, TITULAR, PENDIENTE, type LegalSlug } from "@/lib/legal";
import { alternatesFor } from "@/lib/seo";

export const revalidate = 86400;

function isLegalSlug(v: string): v is LegalSlug {
  return (LEGAL_SLUGS as string[]).includes(v);
}

export function generateStaticParams() {
  return locales.flatMap((lang) => LEGAL_SLUGS.map((doc) => ({ lang, doc })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; doc: string }>;
}): Promise<Metadata> {
  const { lang, doc } = await params;
  const locale = isLocale(lang) ? lang : "es";
  if (!isLegalSlug(doc)) return {};
  const d = LEGAL[locale][doc];
  return {
    title: d.title,
    description: d.intro.slice(0, 160),
    alternates: alternatesFor(locale, `/legal/${doc}`),
  };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ lang: string; doc: string }>;
}) {
  const { lang, doc } = await params;
  if (!isLocale(lang) || !isLegalSlug(doc)) notFound();
  const locale = lang as Locale;
  const d = LEGAL[locale][doc];

  const updatedLabel: Record<Locale, string> = {
    es: "Última actualización",
    en: "Last updated",
    de: "Zuletzt aktualisiert",
    nl: "Laatst bijgewerkt",
    fr: "Dernière mise à jour",
  };

  return (
    <section className="mx-auto max-w-3xl px-5 pb-28 pt-36 sm:px-8">
      <h1 className="font-display text-4xl font-light leading-[1.1] text-ink sm:text-6xl">
        {d.title}
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">{d.intro}</p>
      <p className="mt-4 text-xs uppercase tracking-[0.16em] text-faint">
        {updatedLabel[locale]}:{" "}
        <time dateTime={TITULAR.actualizado}>
          {new Intl.DateTimeFormat(locale === "en" ? "en-GB" : locale, {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(TITULAR.actualizado))}
        </time>
      </p>

      <div className="mt-14 space-y-12">
        {d.sections.map((s) => (
          <section key={s.h}>
            <h2 className="font-display text-2xl text-ink sm:text-3xl">{s.h}</h2>
            <div className="mt-4 space-y-3">
              {/* Los datos registrales que el cliente aún no ha dado (razón
                  social, NIF, registro) no se pintan hasta que estén en
                  TITULAR: mejor una línea menos que un «PENDIENTE» en público. */}
              {s.p.filter((text) => !text.includes(PENDIENTE)).map((text, i) => (
                <p key={i} className="leading-relaxed text-muted">
                  {text}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}
