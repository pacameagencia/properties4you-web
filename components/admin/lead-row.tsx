"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Phone, MessageCircle } from "lucide-react";
import { updateLeadStatus, deleteLead } from "@/app/admin/actions";
import { cn } from "@/lib/utils";

export type LeadRowData = {
  id: string;
  created_at: string;
  property_name: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  message: string | null;
  preferred_date: string | null;
  locale: string | null;
  source: string;
  status: string;
};

const STATUS_STYLES: Record<string, string> = {
  nuevo: "border-gold/60 bg-gold/10 text-gold",
  contactado: "border-sea/60 bg-sea/10 text-sea",
  cerrado: "border-line text-faint",
};

const SOURCE_LABEL: Record<string, string> = {
  visita: "📅 Formulario de visita",
  stories: "📱 Stories",
  contacto: "✉️ Contacto",
};

export function LeadRow({ lead }: { lead: LeadRowData }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [status, setStatus] = useState(lead.status);

  const waDigits = (lead.phone ?? "").replace(/\D/g, "");
  const fecha = new Date(lead.created_at).toLocaleString("es-ES", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  function setLeadStatus(next: string) {
    setStatus(next);
    start(async () => {
      const res = await updateLeadStatus(lead.id, next);
      if (!res.ok) setStatus(lead.status);
      router.refresh();
    });
  }

  return (
    <div
      className={cn(
        "rounded-2xl border bg-surface p-5 transition-opacity",
        status === "cerrado" ? "border-line opacity-60" : "border-line",
        status === "nuevo" && "border-gold/40",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-ink">
              {lead.name || "(sin nombre)"}
            </span>
            {lead.locale && (
              <span className="rounded bg-white/5 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wider text-faint">
                {lead.locale}
              </span>
            )}
            <span className="text-xs text-faint">{fecha}</span>
          </div>
          <p className="mt-0.5 text-xs text-muted">
            {SOURCE_LABEL[lead.source] ?? lead.source}
            {lead.property_name && (
              <>
                {" · "}
                <span className="text-gold">{lead.property_name}</span>
              </>
            )}
            {lead.preferred_date && ` · 📆 ${lead.preferred_date}`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <select
            value={status}
            disabled={pending}
            onChange={(e) => setLeadStatus(e.target.value)}
            aria-label="Estado del lead"
            className={cn(
              "rounded-full border px-3 py-1.5 text-[0.7rem] uppercase tracking-widest outline-none",
              STATUS_STYLES[status] ?? "border-line text-muted",
              "bg-bg",
            )}
          >
            <option value="nuevo">Nuevo</option>
            <option value="contactado">Contactado</option>
            <option value="cerrado">Cerrado</option>
          </select>
          <button
            disabled={pending}
            onClick={() => {
              if (!confirm("¿Eliminar este lead?")) return;
              start(async () => {
                await deleteLead(lead.id);
                router.refresh();
              });
            }}
            title="Eliminar"
            className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-red-500/50 hover:text-red-400 disabled:opacity-40"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {lead.message && (
        <p className="mt-3 whitespace-pre-wrap rounded-lg bg-bg px-4 py-3 text-sm leading-relaxed text-muted">
          {lead.message}
        </p>
      )}

      {(lead.phone || lead.email) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {lead.phone && (
            <>
              <a
                href={`tel:${lead.phone.replace(/\s/g, "")}`}
                className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-gold hover:text-gold"
              >
                <Phone size={12} /> {lead.phone}
              </a>
              {waDigits && (
                <a
                  href={`https://wa.me/${waDigits.startsWith("34") || waDigits.length > 9 ? waDigits : "34" + waDigits}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full border border-[#25D366]/40 px-3 py-1.5 text-xs text-[#25D366] hover:bg-[#25D366]/10"
                >
                  <MessageCircle size={12} /> WhatsApp
                </a>
              )}
            </>
          )}
          {lead.email && (
            <a
              href={`mailto:${lead.email}`}
              className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-muted hover:border-gold hover:text-gold"
            >
              ✉️ {lead.email}
            </a>
          )}
        </div>
      )}
    </div>
  );
}
