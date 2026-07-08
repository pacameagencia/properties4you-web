import { notFound } from "next/navigation";
import { isLocale, locales } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { getSettings } from "@/lib/queries";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { Preloader } from "@/components/site/preloader";
import { Cursor } from "@/components/site/cursor";
import { ScrollProgress } from "@/components/site/scroll-progress";

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
    <>
      <Preloader />
      <Cursor />
      <ScrollProgress />
      <Header locale={lang} dict={dict} />
      <main className="relative z-10">{children}</main>
      <Footer locale={lang} dict={dict} settings={settings} />
    </>
  );
}
