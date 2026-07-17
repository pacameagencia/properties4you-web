"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import { saveLead } from "@/lib/leads";

/**
 * Formulario "Reservar una visita": registra el lead en el panel admin
 * y abre WhatsApp con el mensaje compuesto.
 */
export function VisitForm({
  dict,
  locale,
  whatsapp,
  propertyId,
  propertyName,
}: {
  dict: Dictionary;
  locale: Locale;
  whatsapp: string;
  propertyId: string;
  propertyName: string;
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    // 1) lead a la bandeja del admin (best-effort, no bloquea)
    void saveLead({
      property_id: propertyId,
      property_name: propertyName,
      name,
      phone,
      message,
      preferred_date: date || null,
      locale,
      source: "visita",
    });
    setSent(true);
    // 2) WhatsApp con el mensaje compuesto (flujo de contacto directo)
    const lines = [
      `${dict.visit.title} · ${propertyName}`,
      name && `${dict.visit.name}: ${name}`,
      phone && `📞 ${phone}`,
      date && `${dict.visit.date}: ${date}`,
      message,
      typeof window !== "undefined" ? window.location.href : "",
    ].filter(Boolean);
    window.open(
      `https://wa.me/${whatsapp}?text=${encodeURIComponent(lines.join("\n"))}`,
      "_blank",
      "noopener",
    );
  }

  const input =
    "w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold placeholder:text-faint";

  return (
    <form
      onSubmit={submit}
      className="rounded-2xl border border-line bg-surface p-6"
    >
      <h3 className="flex items-center gap-3 font-display text-xl text-ink">
        <CalendarDays size={18} className="text-gold" />
        {dict.visit.title}
      </h3>
      <div className="mt-5 space-y-3">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={dict.visit.name}
          aria-label={dict.visit.name}
          required
          className={input}
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={dict.visit.phone}
          aria-label={dict.visit.phone}
          className={input}
        />
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label={dict.visit.date}
          className={`${input} [color-scheme:dark]`}
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={dict.visit.message}
          aria-label={dict.visit.message}
          rows={3}
          className={input}
        />
      </div>
      <button
        type="submit"
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[0.75rem] uppercase tracking-[0.16em] text-bg transition-transform hover:scale-[1.02]"
      >
        {dict.visit.cta}
      </button>
      {sent && (
        <p className="mt-3 text-center text-xs text-gold" role="status">
          ✓ {dict.visit.sent}
        </p>
      )}
    </form>
  );
}
