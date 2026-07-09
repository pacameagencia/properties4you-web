"use client";

import { useState } from "react";
import { CalendarDays } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Formulario "Reservar una visita": compone el mensaje y abre WhatsApp. */
export function VisitForm({
  dict,
  whatsapp,
  propertyName,
}: {
  dict: Dictionary;
  whatsapp: string;
  propertyName: string;
}) {
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const lines = [
      `${dict.visit.title} · ${propertyName}`,
      name && `${dict.visit.name}: ${name}`,
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
    </form>
  );
}
