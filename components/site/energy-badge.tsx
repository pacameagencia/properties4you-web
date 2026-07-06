import { cn } from "@/lib/utils";

const SCALE: Record<string, string> = {
  A: "bg-emerald-500",
  B: "bg-green-500",
  C: "bg-lime-500",
  D: "bg-yellow-500",
  E: "bg-amber-500",
  F: "bg-orange-500",
  G: "bg-red-500",
};

export function EnergyBadge({
  rating,
  className,
}: {
  rating: string | null;
  className?: string;
}) {
  if (!rating) return null;
  const letter = rating.trim().toUpperCase().charAt(0);
  const color = SCALE[letter] ?? "bg-neutral-500";
  return (
    <span
      className={cn(
        "inline-flex h-7 min-w-7 items-center justify-center rounded-md px-2 text-sm font-semibold text-black",
        color,
        className,
      )}
      title={`Certificado energético ${rating}`}
    >
      {rating}
    </span>
  );
}
