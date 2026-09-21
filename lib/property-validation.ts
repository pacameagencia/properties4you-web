import { z } from "zod";
import type { PropertyContent, Translations } from "./types";

const text = z.string().trim();
const nullableText = text.nullable();
const amount = z.number().finite().nonnegative("El valor no puede ser negativo.").nullable();
const integer = z.number().int("Introduce un número entero.").nonnegative().nullable();
const webUrl = text.url("Introduce una URL completa.").refine((v) => /^https?:\/\//i.test(v), "Usa una URL http o https.");
const nullableUrl = webUrl.nullable();
const translatedContent = z.object({description: text.max(20000), features: z.array(text.max(1000)).max(100)});

export const propertyInputSchema = z.object({
  id: z.string().uuid().optional(),
  expected_updated_at: z.string().optional(),
  slug: text.min(1, "Indica una URL para la propiedad.").max(180).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "La URL solo admite letras minúsculas, números y guiones."),
  name: text.min(1, "El nombre es obligatorio.").max(200),
  reference: nullableText,
  status: z.enum(["en_venta", "reservado", "vendido"]),
  published: z.boolean(), featured: z.boolean(), sort_order: z.number().int(),
  type: z.enum(["villa", "apartamento", "atico", "bungalow", "adosado", "duplex", "parcela"]),
  zone: nullableText, province: nullableText,
  price: amount, price_from: z.boolean(), bedrooms: integer, bathrooms: integer,
  area_m2: amount, plot_m2: amount,
  energy_rating: z.enum(["A", "B", "C", "D", "E", "F", "G", "en_tramite"]).nullable(),
  maps_url: nullableUrl, virtual_tour_url: nullableUrl, video_url: nullableUrl,
  cover_image: nullableUrl, floor_plan: nullableUrl,
  gallery: z.array(z.object({ url: webUrl, alt: z.string().optional() })).max(100),
  pois: z.array(z.object({ type: z.enum(["beach", "airport", "golf", "hospital", "supermarket", "school", "services", "marina", "restaurant", "playground", "pharmacy", "custom"]), distance: text.max(100), custom_label: z.string().optional(), icon: z.string().optional() })),
  amenities: z.array(z.enum(["sea_views", "private_pool", "ready_now", "frontline_golf"])),
  manual_translations: z.object({en: translatedContent, de: translatedContent, nl: translatedContent, fr: translatedContent}).optional(),
  description_es: text.max(20000),
  features_es: z.array(text.max(1000)).max(100),
}).superRefine((v, ctx) => {
  if (v.id && !v.expected_updated_at) ctx.addIssue({code:"custom",path:["expected_updated_at"],message:"Recarga la ficha antes de guardar."});
  if (v.published && !v.cover_image) ctx.addIssue({code:"custom",path:["cover_image"],message:"Añade una portada antes de publicar."});
  if (v.published && !v.description_es) ctx.addIssue({code:"custom",path:["description_es"],message:"Añade una descripción antes de publicar."});
});
export type PropertyInput = z.input<typeof propertyInputSchema>;

export function sameContent(a: PropertyContent | undefined, b: PropertyContent): boolean {
  return (a?.description ?? "").trim() === (b.description ?? "").trim()
    && JSON.stringify(a?.features ?? []) === JSON.stringify(b.features ?? []);
}

/** A price/photo edit must not invoke a translator or overwrite existing languages. */
export async function resolvePropertyTranslations(
  es: PropertyContent,
  previous: Translations | undefined,
  translate: (source: PropertyContent) => Promise<Translations>,
): Promise<{ translations: Translations; warning?: string }> {
  if (previous && sameContent(previous.es, es)) return { translations: { ...previous, es } };
  try {
    return { translations: await translate(es) };
  } catch {
    // Never publish old translations against a changed Spanish source.
    return { translations: { es }, warning: "Guardado en español. La traducción automática no está disponible; revisa los idiomas antes de publicar." };
  }
}
