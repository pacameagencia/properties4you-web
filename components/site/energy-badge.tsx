import { cn } from "@/lib/utils";

/**
 * Badge de certificado energético en clave de marca (oro/carbón),
 * sin el semáforo RGB de portal genérico.
 */
export function EnergyBadge({
  rating,
  pendingLabel = "En trámite",
  className,
}: {
  rating: string | null;
  /** Texto localizado para el valor especial "en_tramite". */
  pendingLabel?: string;
  className?: string;
}) {
  if (!rating) return null;
  const pending = rating.trim().toLowerCase() === "en_tramite";
  const label = pending ? pendingLabel : rating.trim().toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-gold/60 bg-gold/10 px-2 font-display text-sm font-semibold text-gold",
        pending && "text-[0.72rem] font-normal italic tracking-wide",
        className,
      )}
      title={`Certificado energético ${label}`}
    >
      {label}
    </span>
  );
}
