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
    // EHLO con el dominio: sin esto el saludo sale como "[127.0.0.1]", una
    // señal más para los filtros de spam (el acuse caía en Junk, 2026-10-05).
    name: "properties4you.es",
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

/* ───────────────────── confirmación al cliente ─────────────────────
   El cliente pidió (2026-10-05) que quien escribe reciba un acuse en su
   correo. Va en el idioma del formulario y NO repite el texto libre del
   mensaje: así el formulario no sirve para mandar texto arbitrario a
   direcciones ajenas (abuso como relé de spam). */
type Lang = "es" | "en" | "de" | "nl" | "fr";
type ConfText = {
  subject: string;
  hello: (n: string) => string;
  intro: Record<Enquiry["kind"], string>;
  property: string;
  date: string;
  next: string;
  contact: string;
  sign: string;
  footer: string;
};
const CONF: Record<Lang, ConfText> = {
  es: {
    subject: "Hemos recibido tu mensaje · Properties4You",
    hello: (n) => `Hola ${n}:`,
    intro: {
      visita: "Gracias por solicitar una visita. Hemos recibido tu solicitud correctamente.",
      contacto: "Gracias por escribirnos. Hemos recibido tu mensaje correctamente.",
      colabora: "Gracias por tu interés en colaborar con nosotros. Hemos recibido tu solicitud correctamente.",
    },
    property: "Vivienda",
    date: "Fecha preferida",
    next: "Lo revisamos personalmente y te responderemos lo antes posible.",
    contact: "Si quieres añadir algo, responde a este correo o escríbenos por WhatsApp:",
    sign: "Un saludo,\nReinier y Karina · Properties4You",
    footer: "Recibes este correo porque has enviado un formulario en properties4you.es.",
  },
  en: {
    subject: "We've received your message · Properties4You",
    hello: (n) => `Hi ${n},`,
    intro: {
      visita: "Thank you for requesting a viewing. We have received your request.",
      contacto: "Thank you for getting in touch. We have received your message.",
      colabora: "Thank you for your interest in working with us. We have received your request.",
    },
    property: "Property",
    date: "Preferred date",
    next: "We'll review it personally and get back to you as soon as possible.",
    contact: "If you'd like to add anything, just reply to this email or message us on WhatsApp:",
    sign: "Kind regards,\nReinier & Karina · Properties4You",
    footer: "You are receiving this email because you submitted a form on properties4you.es.",
  },
  de: {
    subject: "Wir haben Ihre Nachricht erhalten · Properties4You",
    hello: (n) => `Hallo ${n},`,
    intro: {
      visita: "Vielen Dank für Ihre Besichtigungsanfrage. Wir haben sie erhalten.",
      contacto: "Vielen Dank für Ihre Nachricht. Wir haben sie erhalten.",
      colabora: "Vielen Dank für Ihr Interesse an einer Zusammenarbeit. Wir haben Ihre Anfrage erhalten.",
    },
    property: "Immobilie",
    date: "Wunschtermin",
    next: "Wir prüfen sie persönlich und melden uns so schnell wie möglich.",
    contact: "Möchten Sie etwas ergänzen? Antworten Sie einfach auf diese E-Mail oder schreiben Sie uns per WhatsApp:",
    sign: "Viele Grüße\nReinier & Karina · Properties4You",
    footer: "Sie erhalten diese E-Mail, weil Sie ein Formular auf properties4you.es gesendet haben.",
  },
  nl: {
    subject: "We hebben je bericht ontvangen · Properties4You",
    hello: (n) => `Hoi ${n},`,
    intro: {
      visita: "Bedankt voor je aanvraag voor een bezichtiging. We hebben hem goed ontvangen.",
      contacto: "Bedankt voor je bericht. We hebben het goed ontvangen.",
      colabora: "Bedankt voor je interesse om met ons samen te werken. We hebben je aanvraag goed ontvangen.",
    },
    property: "Woning",
    date: "Voorkeursdatum",
    next: "We bekijken het persoonlijk en nemen zo snel mogelijk contact met je op.",
    contact: "Wil je iets toevoegen? Beantwoord gewoon deze e-mail of stuur ons een bericht via WhatsApp:",
    sign: "Hartelijke groet,\nReinier & Karina · Properties4You",
    footer: "Je ontvangt deze e-mail omdat je een formulier hebt verstuurd op properties4you.es.",
  },
  fr: {
    subject: "Nous avons bien reçu votre message · Properties4You",
    hello: (n) => `Bonjour ${n},`,
    intro: {
      visita: "Merci pour votre demande de visite. Nous l'avons bien reçue.",
      contacto: "Merci pour votre message. Nous l'avons bien reçu.",
      colabora: "Merci pour votre intérêt à collaborer avec nous. Nous avons bien reçu votre demande.",
    },
    property: "Bien",
    date: "Date souhaitée",
    next: "Nous l'examinons personnellement et vous répondrons dès que possible.",
    contact: "Pour ajouter quelque chose, répondez simplement à cet e-mail ou écrivez-nous sur WhatsApp :",
    sign: "Bien cordialement,\nReinier & Karina · Properties4You",
    footer: "Vous recevez cet e-mail car vous avez envoyé un formulaire sur properties4you.es.",
  },
};

/** Acuse de recibo al cliente, en su idioma. Lanza si SMTP falla. */
export async function sendConfirmationMail(e: Enquiry, phone: string): Promise<void> {
  if (!isMailConfigured()) throw new Error("SMTP no configurado");
  const lang = (["es", "en", "de", "nl", "fr"].includes(e.locale) ? e.locale : "en") as Lang;
  const t = CONF[lang];
  const agency = process.env.CONTACT_TO || process.env.SMTP_USER!;
  const name = e.name.trim().split(/\s+/)[0].slice(0, 40);
  const wa = `https://wa.me/${phone.replace(/\D/g, "")}`;
  const shown = (
    [
      [t.property, e.kind === "colabora" ? null : e.propertyName],
      [t.date, e.preferredDate],
    ] as Array<[string, string | null | undefined]>
  ).filter(([, v]) => v);

  const text = [
    t.hello(name),
    "",
    t.intro[e.kind],
    ...(shown.length ? ["", ...shown.map(([k, v]) => `${k}: ${v}`)] : []),
    "",
    t.next,
    "",
    t.contact,
    `${phone} · ${wa}`,
    agency,
    "",
    t.sign,
    "",
    t.footer,
  ].join("\n");

  const gold = "#9a7b1c";
  const table = shown.length
    ? `<table style="border-collapse:collapse;margin:6px 0 16px;font:15px/1.5 -apple-system,Segoe UI,sans-serif">${shown
        .map(
          ([k, v]) =>
            `<tr><td style="padding:3px 14px 3px 0;color:#8a7f6e">${esc(k)}</td><td style="padding:3px 0">${esc(String(v))}</td></tr>`,
        )
        .join("")}</table>`
    : "";
  const html = `<div style="background:#f5f2ec;padding:32px 16px;font:16px/1.6 Georgia,serif;color:#1a1a1a">
  <div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e7e0d3">
    <div style="background:#0b0f13;padding:22px 28px;color:#f3efe7;font-size:18px;letter-spacing:.08em">PROPERTIES<span style="color:#c9a227">4</span>YOU</div>
    <div style="padding:28px">
      <p style="margin:0 0 14px">${esc(t.hello(name))}</p>
      <p style="margin:0 0 14px">${esc(t.intro[e.kind])}</p>
      ${table}
      <p style="margin:0 0 14px">${esc(t.next)}</p>
      <p style="margin:0 0 8px">${esc(t.contact)}</p>
      <p style="margin:0 0 20px"><a href="${wa}" style="color:${gold}">${esc(phone)}</a> · <a href="mailto:${esc(agency)}" style="color:${gold}">${esc(agency)}</a></p>
      <p style="margin:0;white-space:pre-line">${esc(t.sign)}</p>
    </div>
    <div style="padding:14px 28px;border-top:1px solid #eee6d8;color:#9b9284;font:12px/1.5 -apple-system,Segoe UI,sans-serif">${esc(t.footer)}</div>
  </div>
</div>`;

  await transport().sendMail({
    from: `"Properties4You" <${process.env.SMTP_USER}>`,
    to: e.email,
    replyTo: agency,
    subject: t.subject,
    text,
    html,
  });
}
