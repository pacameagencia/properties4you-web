import type { MetadataRoute } from "next";
import { locales } from "@/lib/i18n/config";
import { getPublishedProperties, getPublishedPosts } from "@/lib/queries";
import { LEGAL_SLUGS } from "@/lib/legal";

const BASE = "https://properties4you.es";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [properties, posts] = await Promise.all([
    getPublishedProperties(),
    getPublishedPosts(),
  ]);

  const entries: MetadataRoute.Sitemap = [];
  for (const lang of locales) {
    entries.push(
      { url: `${BASE}/${lang}`, changeFrequency: "weekly", priority: 1 },
      { url: `${BASE}/${lang}/propiedades`, changeFrequency: "weekly", priority: 0.9 },
      { url: `${BASE}/${lang}/blog`, changeFrequency: "weekly", priority: 0.6 },
      { url: `${BASE}/${lang}/nosotros`, changeFrequency: "monthly", priority: 0.5 },
      { url: `${BASE}/${lang}/colabora`, changeFrequency: "monthly", priority: 0.7 },
    );
    for (const doc of LEGAL_SLUGS) {
      entries.push({ url: `${BASE}/${lang}/legal/${doc}`, changeFrequency: "yearly", priority: 0.2 });
    }
    for (const p of properties) {
      entries.push({
        url: `${BASE}/${lang}/propiedad/${p.slug}`,
        lastModified: p.updated_at,
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    for (const post of posts) {
      entries.push({
        url: `${BASE}/${lang}/blog/${post.slug}`,
        lastModified: post.updated_at,
        changeFrequency: "monthly",
        priority: 0.6,
      });
    }
  }
  return entries;
}
