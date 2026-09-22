"use client";

import { useRef, useState } from "react";
import { CalendarDays } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { enquirySchema } from "@/lib/enquiry-validation";
import { sendEnquiry, type EnquiryResult } from "@/app/actions/enquiry";
import {
  ConsentField,
  Honeypot,
  SendStatus,
  inputCls,
  labelCls,
  type SendState,
} from "./enquiry-fields";

/**
 * "Reservar una visita": manda un correo al buzón de la agencia (y deja el
 * lead en el panel). Antes abría WhatsApp con el número personal; el cliente
 * pidió correo porque en un PC el enlace de WhatsApp no funciona y da menos
 * confianza.
 *
 * Cada campo lleva etiqueta visible: el de fecha, sin ella, en iPhone se veía
 * como una barra vacía y el cliente pensó que pedía la fecha de nacimiento.
 */
export function VisitForm({
  dict,
  locale,
  propertyId,
  propertyName,
  contactEmail,
}: {
  dict: Dictionary;
  locale: Locale;
  propertyId: string;
  propertyName: string;
  contactEmail: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const [invalidField, setInvalidField] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [state, setState] = useState<SendState>("idle");
  const [result, setResult] = useState<EnquiryResult | null>(null);

  const today = new Date().toISOString().slice(0, 10);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || (state === "sending" || state === "sent")) return;
    const input = {
      kind: "visita" as const,
      name,
      email,
      phone,
      message,
      preferredDate: date,
      propertyId,
      propertyName,
      propertyUrl: typeof window !== "undefined" ? window.location.href : "",
      locale,
      consent: true as const,
      company,
    };
    const checked = enquirySchema.safeParse(input);
    if (!checked.success) {
      const field = String(checked.error.issues[0].path[0]);
      setInvalidField(field);
      setResult({ok: false, error: "invalid"});
      setState("error");
      formRef.current?.querySelector<HTMLElement>(`[name="${field}"]`)?.focus();
      return;
    }
    setInvalidField("");
    setState("sending");
    const r: EnquiryResult = await sendEnquiry(checked.data).catch(() => ({ ok: false as const, error: "mail" as const }));
    setResult(r);
    setState(r.ok ? "sent" : "error");
  }

  return (
    <form
      ref={formRef}
      noValidate
      aria-busy={state === "sending"}
      id="visita"
      onSubmit={submit}
      className="relative scroll-mt-28 rounded-2xl border border-line bg-surface p-6"
    >
      <h3 className="flex items-center gap-3 font-display text-xl text-ink">
        <CalendarDays size={18} className="text-gold" />
        {dict.visit.title}
      </h3>
      <Honeypot value={company} onChange={setCompany} />
      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="visit-name" className={labelCls}>
            {dict.visit.name}
          </label>
          <input
            id="visit-name"
            name="name"
            aria-invalid={invalidField === "name"}
            aria-describedby={invalidField === "name" ? "visit-validation" : undefined}
            minLength={2}
            maxLength={120}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="visit-email" className={labelCls}>
            {dict.forms.email}
          </label>
          <input
            id="visit-email"
            name="email"
            aria-invalid={invalidField === "email"}
            aria-describedby={invalidField === "email" ? "visit-validation" : undefined}
            type="email"
            maxLength={200}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="visit-phone" className={labelCls}>
            {dict.visit.phone}
          </label>
          <input
            id="visit-phone"
            name="phone"
            aria-invalid={invalidField === "phone"}
            aria-describedby={invalidField === "phone" ? "visit-validation" : undefined}
            type="tel"
            maxLength={40}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="visit-date" className={labelCls}>
            {dict.forms.dateLabel}
          </label>
          <input
            id="visit-date"
            name="preferredDate"
            aria-invalid={invalidField === "preferredDate"}
            aria-describedby={invalidField === "preferredDate" ? "visit-validation" : undefined}
            type="date"
            value={date}
            min={today}
            onChange={(e) => setDate(e.target.value)}
            className={`${inputCls} min-h-[42px] [color-scheme:dark]`}
          />
        </div>
        <div>
          <label htmlFor="visit-message" className={labelCls}>
            {dict.visit.message}
          </label>
          <textarea
            id="visit-message"
            name="message"
            aria-invalid={invalidField === "message"}
            aria-describedby={invalidField === "message" ? "visit-validation" : undefined}
            maxLength={2000}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            className={`${inputCls} resize-none field-sizing-content`}
          />
        </div>
      </div>

      <ConsentField id="visit-consent" checked={consent} onChange={setConsent} dict={dict} locale={locale} />

      <button
        type="submit"
        disabled={!consent || state === "sending" || state === "sent"}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[0.75rem] uppercase tracking-[0.16em] text-bg transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100"
      >
        {state === "sending" ? dict.forms.sending : dict.visit.cta}
      </button>
      {!consent && state === "idle" && (
        <p className="mt-2 text-center text-[0.68rem] text-faint">{dict.legal.consentRequired}</p>
      )}
      <div id="visit-validation"><SendStatus state={state} result={result} dict={dict} contactEmail={contactEmail} /></div>
    </form>
  );
}
