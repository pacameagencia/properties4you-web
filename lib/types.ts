import type { Locale } from "./i18n/config";

export type GalleryImage = { url: string; alt?: string };

export type PropertyContent = {
  description?: string;
  features?: string[];
};

export type Translations = Partial<Record<Locale, PropertyContent>>;

export type Property = {
  id: string;
  slug: string;
  reference: string | null;
  name: string;
  status: "en_venta" | "reservado" | "vendido";
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
  latitude: number | null;
  longitude: number | null;
  maps_url: string | null;
  virtual_tour_url: string | null;
  cover_image: string | null;
  gallery: GalleryImage[];
  floor_plan: string | null;
  video_url: string | null;
  translations: Translations;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: number;
  contact_email: string | null;
  contact_phone: string | null;
  address: string | null;
  translations: Partial<Record<Locale, { aboutTitle?: string; aboutBody?: string }>>;
};
