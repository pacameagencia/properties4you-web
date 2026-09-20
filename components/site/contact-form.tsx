"use client";

import { useState } from "react";
import { Mail, Handshake } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
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
 * Formulario de contacto general (Nosotros, "Hablar con nosotros" de la
 * portada) y de agencias (Colabora con nosotros). Los dos mandan correo al
 * buzón de la agencia y dejan el lead en el panel.
 */
export function ContactForm({
  dict,
  locale,
  kind,
  contactEmail,
  title,
  body,
}: {
  dict: Dictionary;
  locale: Locale;
  kind: "contacto" | "colabora";
  contactEmail: string;
  title?: string;
  body?: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [agency, setAgency] = useState("");
  const [country, setCountry] = useState("");
  const [website, setWebsite] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);
  const [company, setCompany] = useState("");
  const [state, setState] = useState<SendState>("idle");
  const [result, setResult] = useState<EnquiryResult | null>(null);

  const partner = kind === "colabora";
  const prefix = partner ? "partner" : "contact";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!consent || state === "sending") return;
    setState("sending");
    const r = await sendEnquiry({
      kind,
      name,
      email,
      phone,
      message,
      agency: partner ? agency : "",
      country: partner ? country : "",
      website: partner ? website : "",
      propertyUrl: typeof window !== "undefined" ? window.location.href : "",
      locale,
      consent: true,
      company,
    });
    setResult(r);
    setState(r.ok ? "sent" : "error");
  }

  const Icon = partner ? Handshake : Mail;

  return (
    <form
      id="contacto"
      onSubmit={submit}
      className="relative scroll-mt-28 rounded-2xl border border-line bg-surface p-6 sm:p-8"
    >
      <h3 className="flex items-center gap-3 font-display text-2xl text-ink">
        <Icon size={20} className="text-gold" />
        {title ?? dict.forms.contactTitle}
      </h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{body ?? dict.forms.contactBody}</p>
      <Honeypot value={company} onChange={setCompany} />

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {partner && (
          <div className="sm:col-span-2">
            <label htmlFor={`${prefix}-agency`} className={labelCls}>
              {dict.forms.agency}
            </label>
            <input
              id={`${prefix}-agency`}
              value={agency}
              onChange={(e) => setAgency(e.target.value)}
              autoComplete="organization"
              required
              className={inputCls}
            />
          </div>
        )}
        <div>
          <label htmlFor={`${prefix}-name`} className={labelCls}>
            {dict.visit.name}
          </label>
          <input
            id={`${prefix}-name`}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="name"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor={`${prefix}-email`} className={labelCls}>
            {dict.forms.email}
          </label>
          <input
            id={`${prefix}-email`}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor={`${prefix}-phone`} className={labelCls}>
            {dict.visit.phone}
          </label>
          <input
            id={`${prefix}-phone`}
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            className={inputCls}
          />
        </div>
        {partner ? (
          <>
            <div>
              <label htmlFor={`${prefix}-country`} className={labelCls}>
                {dict.forms.country}
              </label>
              <input
                id={`${prefix}-country`}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                autoComplete="country-name"
                required
                className={inputCls}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor={`${prefix}-website`} className={labelCls}>
                {dict.forms.website}
              </label>
              <input
                id={`${prefix}-website`}
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://"
                className={inputCls}
              />
            </div>
          </>
        ) : (
          <div className="hidden sm:block" aria-hidden />
        )}
        <div className="sm:col-span-2">
          <label htmlFor={`${prefix}-message`} className={labelCls}>
            {dict.visit.message}
          </label>
          <textarea
            id={`${prefix}-message`}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            required={!partner}
            className={inputCls}
          />
        </div>
      </div>

      <ConsentField id={`${prefix}-consent`} checked={consent} onChange={setConsent} dict={dict} locale={locale} />

      <button
        type="submit"
        disabled={!consent || state === "sending" || state === "sent"}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[0.75rem] uppercase tracking-[0.16em] text-bg transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto sm:px-10"
      >
        {state === "sending" ? dict.forms.sending : partner ? dict.forms.partnerCta : dict.forms.send}
      </button>
      {!consent && state === "idle" && (
        <p className="mt-2 text-[0.68rem] text-faint">{dict.legal.consentRequired}</p>
      )}
      <SendStatus state={state} result={result} dict={dict} contactEmail={contactEmail} />
    </form>
  );
}
