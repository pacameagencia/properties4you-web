"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { settingsSchema } from "@/lib/settings-validation";
import { translateProperty } from "@/lib/translate";
import { locales } from "@/lib/i18n/config";
import type { PropertyContent, Translations } from "@/lib/types";
import { propertyInputSchema, resolvePropertyTranslations, type PropertyInput } from "@/lib/property-validation";
export type { PropertyInput } from "@/lib/property-validation";

/* revalidatePath("/", "layout") no invalida las rutas [lang] en el build de
   producción: hay que revalidar cada path concreto para que los cambios del
   admin se vean al momento (y no tras la ventana ISR de 10 min). */
function revalidateSite(slug?: string | null) {
  for (const l of locales) {
    revalidatePath(`/${l}`);
    revalidatePath(`/${l}/propiedades`);
    revalidatePath(`/${l}/favoritos`);
    if (slug) revalidatePath(`/${l}/propiedad/${slug}`);
  }
  revalidatePath("/admin");
  revalidatePath("/sitemap.xml");
}

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  const { data: admin } = await supabase
    .from("app_admins")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!admin) throw new Error("No autorizado");
  return supabase;
}

export async function saveProperty(raw: PropertyInput) {
  const supabase = await requireAdmin();
  const parsed = propertyInputSchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const input = parsed.data;
  let previous: { slug: string; translations: Translations; updated_at: string } | null = null;
  if (input.id) {
    const { data, error } = await supabase.from("properties").select("slug, translations, updated_at").eq("id", input.id).maybeSingle();
    if (error || !data) return { ok: false, error: "No se pudo cargar la propiedad. Recarga la página e inténtalo de nuevo." };
    previous = data;
    if (previous.updated_at !== input.expected_updated_at) return { ok: false, error: "Esta ficha cambió en otra sesión. Conserva tus cambios y recarga la versión actual antes de guardar." };
  }
  const es: PropertyContent = { description: input.description_es, features: input.features_es.filter(Boolean) };
  const { translations, warning } = input.manual_translations
    ? {translations: {es, ...input.manual_translations}, warning: undefined}
    : await resolvePropertyTranslations(es, previous?.translations, translateProperty);
  if (warning && previous && locales.some((locale) => locale !== "es" && previous?.translations[locale]?.description)) return { ok: false, error: "No se pudo actualizar la traducción. La ficha conserva sus idiomas. Vuelve a intentarlo o activa «Editar traducciones manualmente»." };
  if (input.published && locales.some((locale) => !translations[locale]?.description?.trim())) {
    return { ok: false, error: "No se ha podido completar la traducción. Desmarca Publicada para guardar un borrador en español sin perder el contenido." };
  }
  const { id, expected_updated_at, description_es, features_es, manual_translations, ...fields } = input;
  void description_es; void features_es; void manual_translations;
  const row = { ...fields, translations };
  const query = id
    ? supabase.from("properties").update(row).eq("id", id).eq("updated_at", expected_updated_at!)
    : supabase.from("properties").insert(row);
  const { data, error } = await query.select("id").maybeSingle();
  if (error) return { ok: false, error: error.code === "23505" ? "Ya existe una propiedad con esta URL. Cambia el campo Slug." : "No se pudo guardar. Revisa tu conexión y vuelve a intentarlo." };
  if (!data) return { ok: false, error: "La ficha cambió en otra sesión. Recarga la versión actual antes de guardar." };
  if (previous?.slug && previous.slug !== input.slug) revalidateSite(previous.slug);
  revalidateSite(input.slug);
  return { ok: true, warning };
}

export async function deleteProperty(id: string) {
  const supabase = await requireAdmin();
  const { data: prev } = await supabase
    .from("properties")
    .select("slug")
    .eq("id", id)
    .single();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateSite(prev?.slug);
  return { ok: true };
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = await requireAdmin();
  if (published) {
    const { data: property, error: readError } = await supabase.from("properties").select("name, cover_image, translations").eq("id", id).maybeSingle();
    if (readError || !property) return { ok: false, error: "No se pudo cargar la propiedad." };
    if (!property.name.trim() || !property.cover_image || locales.some((locale) => !property.translations?.[locale]?.description?.trim()))
      return { ok: false, error: "Completa la portada y las descripciones en los cinco idiomas antes de publicar." };
  }
  const { data, error } = await supabase
    .from("properties")
    .update({ published })
    .eq("id", id)
    .select("slug")
    .single();
  if (error) return { ok: false, error: error.message };
  revalidateSite(data?.slug);
  return { ok: true };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

// ==================== LEADS ====================

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await requireAdmin();
  if (!["nuevo", "contactado", "cerrado"].includes(status))
    return { ok: false, error: "Estado inválido" };
  const { error } = await supabase.from("leads").update({ status }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/leads");
  return { ok: true };
}

export async function deleteLead(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("leads").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/admin/leads");
  return { ok: true };
}

// ==================== AJUSTES ====================

export async function saveSettings(input: {
  contact_email: string;
  contact_phone: string;
  address: string;
}) {
  const supabase = await requireAdmin();
  const parsed = settingsSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  input = parsed.data;
  const { error } = await supabase
    .from("site_settings")
    .update({
      contact_email: input.contact_email.trim() || null,
      contact_phone: input.contact_phone.trim() || null,
      address: input.address.trim() || null,
    })
    .eq("id", 1);
  if (error) return { ok: false, error: error.message };
  for (const locale of locales) revalidatePath(`/${locale}`, "layout");
  revalidateSite();
  return { ok: true };
}
