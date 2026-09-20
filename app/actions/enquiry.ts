"use server";

import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { sendEnquiryMail, type Enquiry } from "@/lib/mail";

/**
 * Server action común a los formularios públicos (visita, contacto,
 * colaboración): valida, guarda el lead en la bandeja del admin y manda el
 * correo al buzón de la agencia.
 *
 * El lead se guarda ANTES de enviar el correo y con el cliente anónimo (la
 * política RLS de `leads` permite INSERT a anon): si el SMTP falla, la
 * solicitud queda igualmente en el panel y el usuario ve el error con el
 * correo al que escribir. Nunca se pierde un contacto en silencio.
 */
const schema = z.object({
  kind: z.enum(["visita", "contacto", "colabora"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().max(40).optional().or(z.literal("")),
  message: z.string().trim().max(3000).optional().or(z.literal("")),
  preferredDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional()
    .or(z.literal("")),
  propertyId: z.string().uuid().optional().or(z.literal("")),
  propertyName: z.string().trim().max(200).optional().or(z.literal("")),
  propertyUrl: z.string().trim().url().max(500).optional().or(z.literal("")),
  agency: z.string().trim().max(160).optional().or(z.literal("")),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  website: z.string().trim().max(200).optional().or(z.literal("")),
  locale: z.enum(["es", "en", "de", "nl", "fr"]),
  consent: z.literal(true),
  /** Honeypot: los humanos no lo ven; si viene relleno es un bot. */
  company: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.input<typeof schema>;
export type EnquiryResult = { ok: true } | { ok: false; error: "invalid" | "mail" };

/** `leads.source` admite visita | stories | contacto: la colaboración entra como contacto. */
const SOURCE: Record<Enquiry["kind"], "visita" | "contacto"> = {
  visita: "visita",
  contacto: "contacto",
  colabora: "contacto",
};

export async function sendEnquiry(raw: EnquiryInput): Promise<EnquiryResult> {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;

  const nz = (v: string | undefined) => (v ? v : null);
  const propertyName =
    d.kind === "colabora" ? "Colabora con nosotros" : nz(d.propertyName);
  const message = [
    d.kind === "colabora" && d.agency && `Agencia: ${d.agency}`,
    d.kind === "colabora" && d.country && `País: ${d.country}`,
    d.kind === "colabora" && d.website && `Web: ${d.website}`,
    nz(d.message),
  ]
    .filter(Boolean)
    .join("\n");

  // 1) Lead a la bandeja del admin (best-effort: no bloquea el correo).
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );
    await supabase.from("leads").insert({
      property_id: nz(d.propertyId),
      property_name: propertyName,
      name: d.name,
      email: d.email,
      phone: nz(d.phone),
      message: message || null,
      preferred_date: nz(d.preferredDate),
      locale: d.locale,
      source: SOURCE[d.kind],
    });
  } catch (err) {
    console.error("[enquiry] no se pudo guardar el lead:", err);
  }

  // 2) Correo al buzón de la agencia.
  try {
    await sendEnquiryMail({
      kind: d.kind,
      name: d.name,
      email: d.email,
      phone: nz(d.phone),
      message: nz(d.message),
      preferredDate: nz(d.preferredDate),
      propertyName,
      propertyUrl: nz(d.propertyUrl),
      agency: nz(d.agency),
      country: nz(d.country),
      website: nz(d.website),
      locale: d.locale,
    });
  } catch (err) {
    console.error("[enquiry] fallo SMTP:", err);
    return { ok: false, error: "mail" };
  }
  return { ok: true };
}
