import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSettings } from "@/lib/queries";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Preloader } from "@/components/site/preloader";
import { Cursor } from "@/components/site/cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";
import "../globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  return {
    metadataBase: new URL("https://properties4you.netlify.app"),
    title: {
      default: "Properties4You · Costa Blanca",
      template: "%s · Properties4You",
    },
    description:
      "Obra nueva exclusiva en la Costa Blanca. Villas y apartamentos junto al Mediterráneo.",
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

  return (
    <html lang={lang} className={`${cormorant.variable} ${inter.variable}`}>
      <body className="grain min-h-screen">
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
