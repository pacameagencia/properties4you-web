"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { X, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryImage } from "@/lib/types";
import type { Dictionary } from "@/lib/i18n/dictionaries";

const STORY_MS = 5000;
const REACTIONS = ["🔥", "😍", "🏡"];

export function StoriesGallery({
  images,
  name,
  zone,
  dict,
  whatsapp,
  viewAllLabel,
}: {
  images: GalleryImage[];
  name: string;
  zone: string | null;
  dict: Dictionary;
  whatsapp: string; // dígitos, ej. 34650379258
  viewAllLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [message, setMessage] = useState("");
  const inputFocused = useRef(false);

  const count = images.length;

  const close = useCallback(() => {
    setOpen(false);
    setPaused(false);
    setMessage("");
  }, []);

  const go = useCallback(
    (dir: number) => {
      setIndex((i) => {
        const n = i + dir;
        if (n < 0) return 0;
        if (n >= count) {
          setOpen(false);
          return i;
        }
        return n;
      });
    },
    [count],
  );

  // Teclado + scroll lock
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (inputFocused.current) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, go, close]);

  const waLink = (text: string) =>
    `https://wa.me/${whatsapp}?text=${encodeURIComponent(
      `${text}\n\n· ${name}${zone ? ` (${zone})` : ""}\n${typeof window !== "undefined" ? window.location.href : ""}`,
    )}`;

  function sendMessage() {
    const text = message.trim() || dict.stories.interested;
    window.open(waLink(text), "_blank", "noopener");
    setMessage("");
  }

  if (!count) return null;

  return (
    <>
      {/* Grid de miniaturas — abre las stories */}
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
            {i === 5 && count > 6 && (
              <span className="absolute inset-0 grid place-items-center bg-black/60 font-display text-2xl text-ink">
                +{count - 6}
              </span>
            )}
          </button>
        ))}
      </div>
      <button
        onClick={() => {
          setIndex(0);
          setOpen(true);
        }}
        className="link-underline mt-6 text-[0.78rem] uppercase tracking-[0.16em] text-gold"
      >
        {viewAllLabel} ({count}) →
      </button>

      {/* ============ VISOR STORIES (portal: escapa del stacking context de main) ============ */}
      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[150] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          >
            <style>{`
              @keyframes story-fill { from { width: 0% } to { width: 100% } }
            `}</style>

            {/* Contenedor 9:16 */}
            <motion.div
              initial={{ scale: 0.92, y: 24 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 16 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="relative h-[100dvh] w-full overflow-hidden bg-[#0b0e11] sm:h-[92vh] sm:max-h-[860px] sm:w-auto sm:aspect-[9/16] sm:rounded-3xl sm:border sm:border-line"
              onPointerDown={(e) => {
                const t = e.target as HTMLElement;
                if (!t.closest("[data-noswipe]")) setPaused(true);
              }}
              onPointerUp={() => setPaused(false)}
              onPointerCancel={() => setPaused(false)}
            >
              {/* Imagen actual */}
              <AnimatePresence mode="popLayout">
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  {/* fondo: misma foto difuminada rellenando el 9:16 */}
                  <Image
                    src={images[index].url}
                    alt=""
                    aria-hidden
                    fill
                    sizes="(max-width:640px) 100vw, 500px"
                    className="scale-125 object-cover opacity-50 blur-2xl"
                  />
                  {/* foto completa, sin recorte */}
                  <Image
                    src={images[index].url}
                    alt={images[index].alt || name}
                    fill
                    sizes="(max-width:640px) 100vw, 500px"
                    priority
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/70 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/80 to-transparent" />

              {/* Barras de progreso segmentadas */}
              <div className="absolute inset-x-0 top-0 z-20 flex gap-1 p-3">
                {images.map((_, i) => (
                  <div
                    key={i}
                    className="h-[3px] flex-1 overflow-hidden rounded-full bg-white/25"
                  >
                    {i < index && <div className="h-full w-full bg-white" />}
                    {i === index && (
                      <div
                        key={`fill-${index}`}
                        onAnimationEnd={() => go(1)}
                        className="h-full bg-white"
                        style={{
                          animation: `story-fill ${STORY_MS}ms linear forwards`,
                          animationPlayState: paused ? "paused" : "running",
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Cabecera tipo IG */}
              <div className="absolute inset-x-0 top-5 z-20 flex items-center justify-between px-4 pt-2">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/60 bg-black/40 font-display text-sm text-gold backdrop-blur">
                    P4Y
                  </span>
                  <div className="leading-tight">
                    <p className="text-sm font-medium text-white">{name}</p>
                    <p className="text-[0.68rem] uppercase tracking-[0.14em] text-white/60">
                      {zone} · {index + 1}/{count}
                    </p>
                  </div>
                </div>
                <button
                  data-noswipe
                  onClick={close}
                  aria-label="Cerrar"
                  className="grid h-9 w-9 place-items-center rounded-full bg-black/40 text-white/90 backdrop-blur hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Zonas táctiles prev / next */}
              <button
                aria-label="Anterior"
                onClick={() => go(-1)}
                className="absolute inset-y-0 left-0 z-10 w-1/3"
              />
              <button
                aria-label="Siguiente"
                onClick={() => go(1)}
                className="absolute inset-y-0 right-0 z-10 w-2/3"
              />

              {/* Flechas desktop */}
              <button
                onClick={() => go(-1)}
                className="absolute left-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white/70 backdrop-blur hover:text-white sm:grid"
                aria-label="Anterior"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => go(1)}
                className="absolute right-3 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-black/30 p-2 text-white/70 backdrop-blur hover:text-white sm:grid"
                aria-label="Siguiente"
              >
                <ChevronRight size={20} />
              </button>

              {/* Pie: reacciones + mensaje → WhatsApp */}
              <div
                data-noswipe
                className="absolute inset-x-0 bottom-0 z-20 flex flex-col gap-3 p-4 pb-5"
              >
                <div className="flex justify-center gap-3">
                  {REACTIONS.map((r) => (
                    <a
                      key={r}
                      href={waLink(`${r} ${dict.stories.interested}`)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="grid h-11 w-11 place-items-center rounded-full bg-white/10 text-xl backdrop-blur transition-transform hover:scale-125"
                    >
                      {r}
                    </a>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onFocus={() => {
                      inputFocused.current = true;
                      setPaused(true);
                    }}
                    onBlur={() => {
                      inputFocused.current = false;
                      setPaused(false);
                    }}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder={dict.stories.reply}
                    className="h-12 flex-1 rounded-full border border-white/25 bg-black/40 px-5 text-sm text-white placeholder:text-white/50 outline-none backdrop-blur focus:border-gold"
                  />
                  <button
                    onClick={sendMessage}
                    aria-label={dict.stories.send}
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#25D366] text-white transition-transform hover:scale-105"
                  >
                    <Send size={19} />
                  </button>
                </div>
                <p className="text-center text-[0.6rem] uppercase tracking-[0.22em] text-white/40">
                  {dict.stories.tapHint}
                </p>
              </div>
            </motion.div>
          </motion.div>
            )}
          </AnimatePresence>,
          document.body,
        )}
    </>
  );
}
