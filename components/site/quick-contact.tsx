"use client";

import { Phone, Mail } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

/** Contacto de la agencia: correo en ordenador y correo/teléfono en móvil. */
export function QuickContact({dict, phone, email}: {dict: Dictionary; phone: string; email: string}) {
  return <>
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 border-t border-line bg-bg/95 backdrop-blur-xl sm:hidden">
      <a href={`mailto:${email}`} className="flex flex-col items-center gap-1 py-3 text-gold">
        <Mail size={18}/><span className="text-[0.68rem] uppercase tracking-widest">{dict.quick.email}</span>
      </a>
      <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex flex-col items-center gap-1 border-l border-line py-3 text-ink">
        <Phone size={18}/><span className="text-[0.68rem] uppercase tracking-widest">{dict.quick.call}</span>
      </a>
    </div>
    <a href={`mailto:${email}`} aria-label={dict.quick.email} className="fixed bottom-6 right-6 z-40 hidden h-14 w-14 place-items-center rounded-full bg-gold text-bg shadow-lg transition-transform hover:scale-110 sm:grid"><Mail size={24}/></a>
  </>;
}
