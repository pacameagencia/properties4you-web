"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "@/lib/types";

export function Gallery({
  images,
  name,
  viewAllLabel,
}: {
  images: GalleryImage[];
  name: string;
  viewAllLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const go = useCallback(
    (dir: number) => setIndex((i) => (i + dir + images.length) % images.length),
    [images.length],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go]);

  if (!images.length) return null;

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {images.slice(0, 6).map((img, i) => (
          <button
            key={i}
            onClick={() => {
              setIndex(i);
              setOpen(true);
            }}
            className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-line"
          >
            <Image
              src={img.url}
              alt={img.alt || `${name} ${i + 1}`}
              fill
              sizes="(max-width:768px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {i === 5 && images.length > 6 && (
              <span className="absolute inset-0 grid place-items-center bg-black/60 font-display text-2xl text-ink">
                +{images.length - 6}
              </span>
            )}
          </button>
        ))}
      </div>

      {images.length > 6 && (
        <button
          onClick={() => {
            setIndex(0);
            setOpen(true);
          }}
          className="link-underline mt-6 text-[0.78rem] uppercase tracking-[0.16em] text-gold"
        >
          {viewAllLabel} ({images.length}) →
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur">
          <button
            onClick={() => setOpen(false)}
            className="absolute right-5 top-5 text-ink/80 hover:text-ink"
            aria-label="Cerrar"
          >
            <X size={28} />
          </button>
          <button
            onClick={() => go(-1)}
            className="absolute left-3 text-ink/70 hover:text-ink sm:left-8"
            aria-label="Anterior"
          >
            <ChevronLeft size={40} />
          </button>
          <div className="relative h-[78vh] w-[92vw] max-w-6xl">
            <Image
              src={images[index].url}
              alt={images[index].alt || name}
              fill
              sizes="92vw"
              className="object-contain"
            />
          </div>
          <button
            onClick={() => go(1)}
            className="absolute right-3 text-ink/70 hover:text-ink sm:right-8"
            aria-label="Siguiente"
          >
            <ChevronRight size={40} />
          </button>
          <span className="absolute bottom-6 left-1/2 -translate-x-1/2 text-xs tracking-widest text-faint">
            {index + 1} / {images.length}
          </span>
        </div>
      )}
    </>
  );
}
