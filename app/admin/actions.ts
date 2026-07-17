"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { translateProperty } from "@/lib/translate";
import type { GalleryImage, PropertyContent } from "@/lib/types";

export type PropertyInput = {
  id?: string;
  slug: string;
  reference: string | null;
  name: string;
  status: string;
  published: boolean;
  featured: boolean;
  sort_order: number;
  type: string;
  zone: string | null;
  province: string | null;
  price: number | null;
  price_from: boolean;
  bedrooms: number | null;
  bathrooms: number | null;
  area_m2: number | null;
  plot_m2: number | null;
  energy_rating: string | null;
  maps_url: string | null;
  virtual_tour_url: string | null;
  cover_image: string | null;
  gallery: GalleryImage[];
  pois: import("@/lib/pois").Poi[];
  amenities: string[];
  floor_plan: string | null;
  video_url: string | null;
  description_es: string;
  features_es: string[];
};

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

export async function saveProperty(input: PropertyInput) {
  const supabase = await requireAdmin();

  const esContent: PropertyContent = {
    description: input.description_es.trim(),
    features: input.features_es.map((f) => f.trim()).filter(Boolean),
  };

  // Autotraducción ES -> DE/NL/EN (degrada a copia ES sin API key)
  const translations = await translateProperty(esContent);

  const row = {
    slug: input.slug,
    reference: input.reference,
    name: input.name,
    status: input.status,
    published: input.published,
    featured: input.featured,
    sort_order: input.sort_order,
    type: input.type,
    zone: input.zone,
    province: input.province,
    price: input.price,
    price_from: input.price_from,
    bedrooms: input.bedrooms,
    bathrooms: input.bathrooms,
    area_m2: input.area_m2,
    plot_m2: input.plot_m2,
    energy_rating: input.energy_rating,
    maps_url: input.maps_url,
    virtual_tour_url: input.virtual_tour_url,
    cover_image: input.cover_image,
    gallery: input.gallery,
    pois: input.pois,
    amenities: input.amenities,
    floor_plan: input.floor_plan,
    video_url: input.video_url,
    translations,
  };

  let error;
  if (input.id) {
    ({ error } = await supabase.from("properties").update(row).eq("id", input.id));
  } else {
    ({ error } = await supabase.from("properties").insert(row));
  }
  if (error) return { ok: false, error: error.message };

  revalidatePath("/", "layout");
  revalidatePath("/admin");
  return { ok: true };
}

export async function deleteProperty(id: string) {
  const supabase = await requireAdmin();
  const { error } = await supabase.from("properties").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  return { ok: true };
}

export async function togglePublished(id: string, published: boolean) {
  const supabase = await requireAdmin();
  const { error } = await supabase
    .from("properties")
    .update({ published })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/", "layout");
  revalidatePath("/admin");
  return { ok: true };
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}
