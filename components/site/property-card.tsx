"use client";

import Link from "next/link";
import { useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { BedDouble, Bath, Maximize, ArrowUpRight } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { Property } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { PropertyMedia } from "./property-media";
import { FavButton } from "./fav-button";

const MotionLink = motion.create(Link);

export function PropertyCard({
  property,
  locale,
  dict,
  priority,
}: {
  property: Property;
  locale: Locale;
  dict: Dictionary;
  priority?: boolean;
}) {
  const p = property;
  const typeLabel = dict.types[p.type] ?? p.type;

  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), {
    stiffness: 200,
    damping: 18,
  });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), {
    stiffness: 200,
    damping: 18,
  });

  // Glare: destello dorado que sigue al ratón dentro de la tarjeta
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const glareOpacity = useMotionValue(0);
  const glare = useMotionTemplate`radial-gradient(420px circle at ${gx}% ${gy}%, rgba(216,186,134,0.16), transparent 65%)`;

  function onMove(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    gx.set(((e.clientX - r.left) / r.width) * 100);
    gy.set(((e.clientY - r.top) / r.height) * 100);
    glareOpacity.set(1);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
    glareOpacity.set(0);
  }

  return (
    <motion.div style={{ perspective: 1000 }}>
      <MotionLink
        ref={ref}
        href={`/${locale}/propiedad/${p.slug}`}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        className="group relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface transition-colors duration-500 hover:border-gold/40"
      >
        {/* glare dorado que sigue al ratón */}
        <motion.div
          style={{ backgroundImage: glare, opacity: glareOpacity }}
          className="pointer-events-none absolute inset-0 z-30 transition-opacity duration-500"
        />
        <div className="relative aspect-[4/3] overflow-hidden">
          <div className="shine absolute inset-0 z-20" />
          <div className="relative h-full w-full transition-transform duration-[1100ms] ease-out group-hover:scale-[1.08]">
            <PropertyMedia src={p.cover_image} alt={p.name} priority={priority} />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
          <span className="absolute left-4 top-4 z-10 rounded-full border border-white/20 bg-black/40 px-3 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-ink backdrop-blur">
            {dict.status[p.status] ?? p.status}
          </span>
          <span className="absolute right-4 top-4 z-10 flex items-center gap-2">
            <FavButton
              slug={p.slug}
              label={{ save: dict.favs.save, saved: dict.favs.saved }}
            />
            <span className="grid h-9 w-9 place-items-center rounded-full border border-white/20 bg-black/30 text-ink opacity-0 backdrop-blur transition-all duration-500 group-hover:opacity-100">
              <ArrowUpRight size={16} />
            </span>
          </span>
        </div>

        <div
          className="flex flex-1 flex-col p-6"
          style={{ transform: "translateZ(30px)" }}
        >
          <p className="kicker mb-2 text-gold/80">
            ◆ {p.zone} · {p.province}
          </p>
          <h3 className="font-display text-2xl font-medium text-ink">{p.name}</h3>

          <div className="mt-4 flex items-center gap-5 text-sm text-muted">
            {p.bedrooms != null && (
              <span className="flex items-center gap-1.5">
                <BedDouble size={15} className="text-faint" /> {p.bedrooms}
              </span>
            )}
            {p.bathrooms != null && (
              <span className="flex items-center gap-1.5">
                <Bath size={15} className="text-faint" /> {p.bathrooms}
              </span>
            )}
            {p.area_m2 != null && (
              <span className="flex items-center gap-1.5">
                <Maximize size={15} className="text-faint" /> {p.area_m2} m²
              </span>
            )}
          </div>

          <div className="mt-6 flex items-end justify-between border-t border-line pt-5">
            <div>
              <p className="text-[0.62rem] uppercase tracking-[0.2em] text-faint">
                {typeLabel} · {p.price_from ? dict.card.from : ""}
              </p>
              <p className="font-display text-2xl text-ink">
                {formatPrice(p.price, locale)}
              </p>
            </div>
            <span className="text-[0.72rem] uppercase tracking-[0.16em] text-gold transition-transform duration-500 group-hover:translate-x-1">
              {dict.card.view} →
            </span>
          </div>
        </div>
      </MotionLink>
    </motion.div>
  );
}
