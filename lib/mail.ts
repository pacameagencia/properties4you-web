import nodemailer from "nodemailer";

/**
 * Correo saliente del sitio: los formularios (visita, contacto, colaboración)
 * llegan al buzón de la agencia por SMTP en vez de abrir WhatsApp.
 *
 * Por qué SMTP y no un servicio de terceros: el buzón info@properties4you.es
 * ya existe (Hostinger) y así el correo sale y entra en la cuenta del cliente,
 * sin pasar por infraestructura de la agencia.
 *
 * Variables (en /opt/properties4you/.env del VPS y en .env.local en local):
 *   SMTP_HOST=smtp.hostinger.com
 *   SMTP_PORT=465
 *   SMTP_USER=info@properties4you.es
 *   SMTP_PASS_B64=…   (contraseña en base64: la real lleva caracteres que un
 *                      .env leído por Docker y por Next no interpreta igual)
 *   SMTP_PASS=…       (alternativa en claro, si algún día la contraseña es simple)
 *   CONTACT_TO=info@properties4you.es   (destino; por defecto SMTP_USER)
 */
function smtpPass(): string | undefined {
  const b64 = process.env.SMTP_PASS_B64;
  if (b64) return Buffer.from(b64, "base64").toString("utf8");
  return process.env.SMTP_PASS || undefined;
}
export type Enquiry = {
  kind: "visita" | "contacto" | "colabora";
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  preferredDate?: string | null;
  propertyName?: string | null;
  propertyUrl?: string | null;
  agency?: string | null;
  country?: string | null;
  website?: string | null;
  locale: string;
};

export function isMailConfigured(): boolean {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && smtpPass());
}

function transport() {
  const port = Number(process.env.SMTP_PORT ?? 465);
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: process.env.SMTP_USER, pass: smtpPass() },
  });
}

const KIND_LABEL: Record<Enquiry["kind"], string> = {
  visita: "Solicitud de visita",
  contacto: "Mensaje de contacto",
  colabora: "Agencia interesada en colaborar",
};

function esc(v: string): string {
  return v.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c] ?? c);
}

/** Envía la consulta al buzón de la agencia. Lanza si SMTP falla. */
export async function sendEnquiryMail(e: Enquiry): Promise<void> {
  if (!isMailConfigured()) {
    throw new Error("SMTP no configurado: faltan SMTP_HOST / SMTP_USER / SMTP_PASS");
  }
  const to = process.env.CONTACT_TO || process.env.SMTP_USER!;
  const subject = `[Web] ${KIND_LABEL[e.kind]}${e.propertyName ? ` · ${e.propertyName}` : ""} · ${e.name}`;

  const rows: Array<[string, string | null | undefined]> = [
    ["Nombre", e.name],
    ["Email", e.email],
    ["Teléfono", e.phone],
    ["Idioma", e.locale],
    ["Propiedad", e.propertyName],
    ["Ficha", e.propertyUrl],
    ["Fecha preferida", e.preferredDate],
    ["Agencia", e.agency],
    ["País", e.country],
    ["Web", e.website],
  ];
  const text = [
    KIND_LABEL[e.kind],
    ...rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`),
    "",
    e.message || "(sin mensaje)",
  ].join("\n");
  const html = `<div style="font:15px/1.5 -apple-system,Segoe UI,sans-serif;color:#1a1a1a">
  <h2 style="font-weight:500;margin:0 0 16px">${esc(KIND_LABEL[e.kind])}</h2>
  <table style="border-collapse:collapse">${rows
    .filter(([, v]) => v)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:4px 12px 4px 0;color:#666">${esc(k)}</td><td style="padding:4px 0">${esc(String(v))}</td></tr>`,
    )
    .join("")}</table>
  <p style="white-space:pre-wrap;margin-top:20px;padding:14px;background:#f5f2ec;border-radius:8px">${esc(e.message || "(sin mensaje)")}</p>
  <p style="color:#888;font-size:12px;margin-top:20px">Enviado desde properties4you.es · responde a este correo y le llegará a ${esc(e.email)}.</p>
</div>`;

  await transport().sendMail({
    from: `"Properties4You · web" <${process.env.SMTP_USER}>`,
    to,
    replyTo: `"${e.name.replace(/"/g, "")}" <${e.email}>`,
    subject,
    text,
    html,
  });
}
