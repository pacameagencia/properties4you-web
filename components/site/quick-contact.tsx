"use client";

import { Phone, Mail } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function WhatsAppGlyph({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.5 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.58-.35z" />
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.34A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

/**
 * Contacto rápido: barra fija inferior en móvil (WhatsApp · Llamar · Email)
 * y botón flotante de WhatsApp en escritorio.
 */
export function QuickContact({
  dict,
  whatsapp,
  phone,
  email,
  context,
}: {
  dict: Dictionary;
  whatsapp: string;
  phone: string;
  email: string;
  context?: string;
}) {
  const waHref = `https://wa.me/${whatsapp}${
    context ? `?text=${encodeURIComponent(context)}` : ""
  }`;

  return (
    <>
      {/* Barra móvil */}
      <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-line bg-[#0a0d10]/95 backdrop-blur-xl sm:hidden">
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 py-3 text-[#25D366]"
        >
          <WhatsAppGlyph />
          <span className="text-[0.58rem] uppercase tracking-[0.14em] text-muted">
            {dict.quick.whatsapp}
          </span>
        </a>
        <a
          href={`tel:${phone.replace(/\s/g, "")}`}
          className="flex flex-col items-center gap-1 border-x border-line py-3 text-gold"
        >
          <Phone size={18} />
          <span className="text-[0.58rem] uppercase tracking-[0.14em] text-muted">
            {dict.quick.call}
          </span>
        </a>
        <a
          href={`mailto:${email}`}
          className="flex flex-col items-center gap-1 py-3 text-ink"
        >
          <Mail size={18} />
          <span className="text-[0.58rem] uppercase tracking-[0.14em] text-muted">
            {dict.quick.email}
          </span>
        </a>
      </div>

      {/* Flotante escritorio */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.quick.whatsapp}
        className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_8px_30px_rgba(37,211,102,0.35)] transition-transform hover:scale-110 sm:grid"
      >
        <WhatsAppGlyph size={24} />
      </a>
    </>
  );
}
