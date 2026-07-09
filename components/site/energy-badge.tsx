import { cn } from "@/lib/utils";

/**
 * Badge de certificado energético en clave de marca (oro/carbón),
 * sin el semáforo RGB de portal genérico.
 */
export function EnergyBadge({
  rating,
  className,
}: {
  rating: string | null;
  className?: string;
}) {
  if (!rating) return null;
  const label = rating.trim().toUpperCase();
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-md border border-gold/60 bg-gold/10 px-2 font-display text-sm font-semibold text-gold",
        className,
      )}
      title={`Certificado energético ${label}`}
    >
      {label}
    </span>
  );
}
