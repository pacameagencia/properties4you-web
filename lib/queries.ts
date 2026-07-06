import { createClient } from "./supabase/server";
import type { Property, SiteSettings } from "./types";

export async function getSettings(): Promise<SiteSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return (data as SiteSettings) ?? null;
}

export async function getPublishedProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) {
    console.error("getPublishedProperties:", error.message);
    return [];
  }
  return (data ?? []) as Property[];
}

export async function getFeaturedProperties(limit = 6): Promise<Property[]> {
  const all = await getPublishedProperties();
  const featured = all.filter((p) => p.featured);
  return (featured.length ? featured : all).slice(0, limit);
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  if (error) {
    console.error("getPropertyBySlug:", error.message);
    return null;
  }
  return (data as Property) ?? null;
}
