"use client";

import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

export function FavButton({
  slug,
  className,
  label,
}: {
  slug: string;
  className?: string;
  label?: { save: string; saved: string };
}) {
  const { has, toggle } = useFavorites();
  const active = has(slug);

  return (
    <button
      type="button"
      aria-label={active ? label?.saved ?? "Guardada" : label?.save ?? "Guardar"}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/35 backdrop-blur transition-all duration-300",
        active
          ? "border-gold/70 text-gold"
          : "text-ink/80 hover:text-ink hover:border-white/40",
        className,
      )}
    >
      <Heart size={16} fill={active ? "currentColor" : "none"} />
    </button>
  );
}
