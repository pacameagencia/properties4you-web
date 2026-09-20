"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { EnquiryResult } from "@/app/actions/enquiry";

/** Piezas compartidas por los tres formularios que envían correo. */

export const inputCls =
  "w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-sm text-ink outline-none transition-colors focus:border-gold placeholder:text-faint";

export const labelCls = "mb-1.5 block text-[0.66rem] uppercase tracking-[0.16em] text-faint";

export type SendState = "idle" | "sending" | "sent" | "error";

/** Casilla de consentimiento RGPD: acto afirmativo, sin marcar por defecto. */
export function ConsentField({
  id,
  checked,
  onChange,
  dict,
  locale,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  dict: Dictionary;
  locale: Locale;
}) {
  return (
    <label className="mt-5 flex cursor-pointer items-start gap-3 text-xs leading-relaxed text-muted">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        required
        aria-describedby={id}
        className="mt-0.5 h-4 w-4 shrink-0 cursor-pointer accent-[#c9a464]"
      />
      <span id={id}>
        {dict.legal.consent}{" "}
        <Link
          href={`/${locale}/legal/privacidad`}
          target="_blank"
          className="text-gold underline underline-offset-2"
        >
          {dict.legal.consentLink}
        </Link>
      </span>
    </label>
  );
}

/** Campo trampa para bots: invisible para personas, ignorado por lectores. */
export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div aria-hidden className="absolute -left-[9999px] top-0 h-px w-px overflow-hidden">
      <label>
        company
        <input tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
      </label>
    </div>
  );
}

/** Mensaje de estado tras enviar. */
export function SendStatus({
  state,
  result,
  dict,
  contactEmail,
}: {
  state: SendState;
  result: EnquiryResult | null;
  dict: Dictionary;
  contactEmail: string;
}) {
  if (state === "sent") {
    return (
      <p className="mt-3 text-center text-xs text-gold" role="status">
        ✓ {dict.forms.sent}
      </p>
    );
  }
  if (state === "error") {
    const invalid = result && !result.ok && result.error === "invalid";
    return (
      <p className="mt-3 text-center text-xs text-[#e0a0a0]" role="alert">
        {invalid ? dict.legal.consentRequired : dict.forms.error}{" "}
        {!invalid && (
          <a href={`mailto:${contactEmail}`} className="underline underline-offset-2">
            {contactEmail}
          </a>
        )}
      </p>
    );
  }
  return null;
}
