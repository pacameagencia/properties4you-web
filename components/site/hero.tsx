"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
  useMotionTemplate,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Magnetic } from "./magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;
const SLIDE_MS = 6500;

function Words({ text, accent }: { text: string; accent?: boolean }) {
  return (
    <span className="inline">
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${accent ? "italic text-gold-soft" : ""}`}
            initial={{ y: "110%" }}
            animate={{ y: 0 }}
            transition={{ duration: 0.9, ease: EASE, delay: 0.15 + i * 0.08 }}
          >
            {w}&nbsp;
          </motion.span>
        </span>
      ))}
    </span>
  );
}

export function Hero({
  locale,
  dict,
  images,
}: {
  locale: Locale;
  dict: Dictionary;
  images: string[];
}) {
  const ref = useRef<HTMLElement>(null);
  const [slide, setSlide] = useState(0);

  // Parallax al scroll
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  // Spotlight que sigue el ratón
  const mx = useMotionValue(50);
  const my = useMotionValue(35);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(560px circle at ${sx}% ${sy}%, rgba(201,164,100,0.14), transparent 65%)`;

  // Slideshow crossfade
  useEffect(() => {
    if (images.length < 2) return;
    const iv = setInterval(() => setSlide((s) => (s + 1) % images.length), SLIDE_MS);
    return () => clearInterval(iv);
  }, [images.length]);

  function onMove(e: React.MouseEvent) {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    mx.set(((e.clientX - r.left) / r.width) * 100);
    my.set(((e.clientY - r.top) / r.height) * 100);
  }

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {/* Slideshow con Ken Burns alternado */}
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <AnimatePresence>
          <motion.div
            key={slide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.6, ease: "easeInOut" }}
            className="absolute inset-0"
          >
            <div
              className={`absolute inset-0 bg-cover bg-center ${
                slide % 2 === 0 ? "hero-kenburns" : "hero-kenburns-alt"
              }`}
              style={{ backgroundImage: `url(${images[slide] ?? ""})` }}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Veladuras */}
      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d10]/80 via-[#0a0d10]/40 to-[#0a0d10]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d10]/85 via-[#0a0d10]/20 to-transparent" />
      </motion.div>

      {/* Spotlight dorado que sigue el ratón */}
      <motion.div
        style={{ backgroundImage: spotlight }}
        className="pointer-events-none absolute inset-0 hidden sm:block"
      />

      {/* Contenido */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-40 sm:px-8"
      >
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="kicker mb-6"
        >
          {dict.hero.kicker}
        </motion.p>

        <h1 className="max-w-4xl font-display text-5xl font-light leading-[1.03] text-ink sm:text-7xl lg:text-8xl">
          <Words text={dict.hero.title} />
          <Words text={dict.hero.titleAccent} accent />
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-muted"
        >
          {dict.hero.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.78 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <Magnetic>
            <Link
              href={`/${locale}/propiedades`}
              className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-[0.78rem] uppercase tracking-[0.18em] text-bg transition-colors hover:bg-gold"
            >
              {dict.hero.ctaProperties}
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </Magnetic>
          <Link
            href={`/${locale}/nosotros`}
            className="link-underline text-[0.78rem] uppercase tracking-[0.18em] text-ink"
          >
            {dict.hero.ctaAbout}
          </Link>
        </motion.div>

        {/* Indicadores del slideshow */}
        {images.length > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="mt-10 flex gap-2"
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`Imagen ${i + 1}`}
                className="group/dot relative h-3 w-8 cursor-pointer"
              >
                <span
                  className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-all duration-500 ${
                    i === slide ? "bg-gold" : "bg-white/25 group-hover/dot:bg-white/50"
                  }`}
                />
              </button>
            ))}
          </motion.div>
        )}
      </motion.div>

      {/* Indicador de scroll */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center"
      >
        <div className="mx-auto h-10 w-px overflow-hidden bg-white/10">
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="h-full w-full bg-gold"
          />
        </div>
        <span className="mt-2 block text-[0.6rem] uppercase tracking-[0.3em] text-faint">
          {dict.hero.scroll}
        </span>
      </motion.div>
    </section>
  );
}
