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

/**
 * Registra un lead en la bandeja del admin. Nunca bloquea el flujo del
 * usuario: si falla (red, RLS), se ignora silenciosamente y WhatsApp
 * se abre igual.
 */
export async function saveLead(lead: NewLead): Promise<void> {
  try {
    const supabase = createClient();
    await supabase.from("leads").insert({
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
  } catch {
    // best-effort: el contacto por WhatsApp sigue su curso
  }
}
