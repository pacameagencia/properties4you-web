import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSettings } from "@/lib/queries";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Preloader } from "@/components/site/preloader";
import { LangSetter } from "@/components/site/lang-setter";
import { Cursor } from "@/components/site/cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "optional",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "optional",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  const d = getDictionary(isLocale(lang) ? lang : "es");
  return {
    metadataBase: new URL("https://properties4you.netlify.app"),
    title: {
      default: "Properties4You · Costa Blanca",
      template: "%s · Properties4You",
    },
    description: d.meta.description,
    alternates: {
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}`])),
      canonical: `/${lang}`,
    },
    openGraph: {
      type: "website",
      siteName: "Properties4You",
      title: "Properties4You · Costa Blanca",
      description:
        "Obra nueva exclusiva en la Costa Blanca. Villas y apartamentos junto al Mediterráneo.",
    },
  };
}

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  const dict = getDictionary(lang);
  const settings = await getSettings();

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "Properties4You",
    url: "https://properties4you.netlify.app",
    areaServed: "Costa Blanca, Alicante, España",
    telephone: settings?.contact_phone || "+34 650 37 92 58",
    email: settings?.contact_email || "info@properties4you.es",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Los Montesinos",
      addressRegion: "Alicante",
      postalCode: "03187",
      addressCountry: "ES",
    },
  };

  return (
    <html lang={lang} className={`${cormorant.variable} ${inter.variable}`}>
      <body className="grain min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <LangSetter locale={lang} />
      <Preloader kicker={dict.hero.kicker} />
        <Cursor />
        <ScrollProgress />
        <Header locale={lang} dict={dict} />
        <main className="relative z-10">{children}</main>
        <Footer locale={lang} dict={dict} settings={settings} />
      </body>
    </html>
  );
}
