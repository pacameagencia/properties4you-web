import { createClient as createAnonClient } from "@supabase/supabase-js";
import type { Property, SiteSettings } from "./types";

/**
 * Cliente anónimo SIN cookies para las páginas públicas: permite render
 * estático/ISR (CDN, sin cold-starts). RLS solo expone propiedades publicadas.
 */
function publicClient() {
  return createAnonClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

export async function getSettings(): Promise<SiteSettings | null> {
  const supabase = publicClient();
  const { data } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();
  return (data as SiteSettings) ?? null;
}

export async function getPublishedProperties(): Promise<Property[]> {
  const supabase = publicClient();
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

export type Post = {
  id: string;
  slug: string;
  published: boolean;
  cover_image: string | null;
  sort_order: number;
  translations: Partial<
    Record<string, { title?: string; excerpt?: string; body?: string }>
  >;
  created_at: string;
  updated_at: string;
};

export async function getPublishedPosts(): Promise<Post[]> {
  const supabase = publicClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: false });
  return (data ?? []) as Post[];
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const supabase = publicClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .maybeSingle();
  return (data as Post) ?? null;
}

export async function getPropertyBySlug(slug: string): Promise<Property | null> {
  const supabase = publicClient();
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
