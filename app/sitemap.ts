import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getPublishedProperties } from "@/lib/queries";

const BASE = "https://properties4you.netlify.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getPublishedProperties();

  const entries: MetadataRoute.Sitemap = [];
  for (const lang of locales) {
    entries.push(
      { url: `${BASE}/${lang}`, changeFrequency: "weekly", priority: 1 },
      { url: `${BASE}/${lang}/propiedades`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${BASE}/${lang}/nosotros`, changeFrequency: "monthly", priority: 0.5 },
    );
    for (const p of properties) {
      entries.push({
        url: `${BASE}/${lang}/propiedad/${p.slug}`,
        lastModified: p.updated_at,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
  }
  return entries;
}
