"use server";

import { enquirySchema, leadMessage, type EnquiryInput } from "@/lib/enquiry-validation";
export type { EnquiryInput } from "@/lib/enquiry-validation";
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

export type EnquiryResult = { ok: true } | { ok: false; error: "invalid" | "mail" | "storage" };

/** `leads.source` admite visita | stories | contacto: la colaboración entra como contacto. */
const SOURCE: Record<Enquiry["kind"], "visita" | "contacto"> = {
  visita: "visita",
  contacto: "contacto",
  colabora: "contacto",
};

export async function sendEnquiry(raw: EnquiryInput): Promise<EnquiryResult> {
  const parsed = enquirySchema.safeParse(raw);
  if (!parsed.success) return { ok: false, error: "invalid" };
  const d = parsed.data;

  const nz = (v: string | undefined) => (v ? v : null);
  const propertyName =
    d.kind === "colabora" ? "Colabora con nosotros" : nz(d.propertyName);
  const message = leadMessage(d);

  // 1) Comprobar la escritura: Supabase devuelve errores sin lanzar excepciones.
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } },
    );
    const { error } = await supabase.from("leads").insert({
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
    if (error) {
      console.error("[enquiry] lead rechazado:", error.code);
      return { ok: false, error: "storage" };
    }
  } catch (err) {
    console.error("[enquiry] no se pudo guardar el lead:", err instanceof Error ? err.name : "error");
    return { ok: false, error: "storage" };
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
