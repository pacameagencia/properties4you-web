"use client";

import { createClient } from "./supabase/client";

export type NewLead = {
  property_id?: string | null;
  property_name?: string | null;
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  message?: string | null;
  preferred_date?: string | null; // yyyy-mm-dd
  locale?: string;
  source: "visita" | "stories" | "contacto";
};

/** Registra una reacción y confirma únicamente si Supabase la acepta. */
export async function saveLead(lead: NewLead): Promise<boolean> {
  try {
    const supabase = createClient();
    const { error } = await supabase.from("leads").insert({
      property_id: lead.property_id ?? null,
      property_name: lead.property_name ?? null,
      name: lead.name?.trim() || null,
      email: lead.email?.trim() || null,
      phone: lead.phone?.trim() || null,
      message: lead.message?.trim() || null,
      preferred_date: lead.preferred_date || null,
      locale: lead.locale ?? null,
      source: lead.source,
    });
    return !error;
  } catch {
    return false;
  }
}
