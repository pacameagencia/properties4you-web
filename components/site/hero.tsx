"use client";

import Link from "next/link";
import Image from "next/image";
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

const SLIDE_MS = 6500;

/*
 * RENDIMIENTO: la coreografía de entrada es CSS puro (keyframes inline),
 * así corre ANTES de que hidrate el JS y el contenido pinta al primer
 * frame (LCP bajo). Framer Motion queda solo para lo interactivo:
 * parallax, spotlight, crossfade del slideshow y microinteracciones.
 */

function Words({
  text,
  accent,
  base = 0,
}: {
  text: string;
  accent?: boolean;
  base?: number;
}) {
  return (
    <span className="inline">
      {text.split(" ").map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span
            className={`hero-word inline-block ${accent ? "italic text-gold-soft" : ""}`}
            style={{ animationDelay: `${(base + i * 0.09).toFixed(2)}s` }}
          >
            {w}&nbsp;
          </span>
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

  const titleWords =
    dict.hero.title.split(" ").length + dict.hero.titleAccent.split(" ").length;

  // Parallax al scroll (mejora progresiva; sin JS no resta nada)
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

  const lineDelay = 0.3 + titleWords * 0.09;

  return (
    <section
      ref={ref}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] items-end overflow-hidden bg-[#07090b]"
    >
      <style>{`
        @keyframes hero-word-in { from { transform: translateY(110%); } to { transform: translateY(0); } }
        @keyframes hero-fade-up { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: none; } }
        @keyframes hero-fade    { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hero-line    { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes hero-settle  { from { transform: scale(1.14); filter: blur(10px); } to { transform: scale(1); filter: blur(0); } }
        .hero-word   { transform: translateY(110%); animation: hero-word-in .9s cubic-bezier(.22,1,.36,1) forwards; }
        .hero-fadeup { opacity: 0; animation: hero-fade-up .7s cubic-bezier(.22,1,.36,1) forwards; }
        .hero-fadein { opacity: 0; animation: hero-fade 1s ease forwards; }
        .hero-line   { transform: scaleX(0); animation: hero-line 1.1s cubic-bezier(.22,1,.36,1) forwards; }
        .hero-settle { animation: hero-settle 1.9s cubic-bezier(.22,1,.36,1) forwards; }
        @media (prefers-reduced-motion: reduce) {
          .hero-word, .hero-fadeup, .hero-fadein, .hero-line, .hero-settle {
            animation: none !important; opacity: 1 !important; transform: none !important; filter: none !important;
          }
        }
      `}</style>

      {/* Imagen: asienta de ampliada+borrosa a nítida (CSS, corre pre-hidratación) */}
      <motion.div style={{ y: imgY }} className="absolute inset-0">
        <div className="hero-settle absolute inset-0">
          {/* initial={false}: la primera diapositiva pinta visible en SSR (LCP) */}
          <AnimatePresence initial={false}>
            <motion.div
              key={slide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {images[slide] && (
                <Image
                  src={images[slide]}
                  alt=""
                  fill
                  priority={slide === 0}
                  fetchPriority={slide === 0 ? "high" : "auto"}
                  quality={60}
                  sizes="100vw"
                  className={`object-cover ${
                    slide % 2 === 0 ? "hero-kenburns" : "hero-kenburns-alt"
                  }`}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
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

      {/* Contenido — entrada CSS con retardos escalonados */}
      <motion.div
        style={{ y: contentY }}
        className="relative z-10 mx-auto w-full max-w-7xl px-5 pb-24 pt-40 sm:px-8"
      >
        <p className="hero-fadeup kicker mb-6" style={{ animationDelay: "0.2s" }}>
          {dict.hero.kicker}
        </p>

        <h1 className="max-w-4xl font-display text-5xl font-light leading-[1.03] text-ink sm:text-7xl lg:text-8xl">
          <Words text={dict.hero.title} base={0.25} />
          <Words
            text={dict.hero.titleAccent}
            accent
            base={0.25 + dict.hero.title.split(" ").length * 0.09}
          />
        </h1>

        {/* Barrido de línea dorada bajo el titular */}
        <div
          className="hero-line mt-7 h-px w-40 origin-left bg-gradient-to-r from-gold via-gold-soft to-transparent sm:w-64"
          style={{ animationDelay: `${lineDelay.toFixed(2)}s` }}
        />

        <p
          className="hero-fadeup mt-7 max-w-xl text-lg leading-relaxed text-muted"
          style={{ animationDelay: "0.35s" }}
        >
          {dict.hero.subtitle}
        </p>

        <div
          className="hero-fadeup mt-10 flex flex-wrap items-center gap-4"
          style={{ animationDelay: "0.5s" }}
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
        </div>

        {/* Indicadores del slideshow */}
        {images.length > 1 && (
          <div
            className="hero-fadein mt-10 flex gap-2"
            style={{ animationDelay: `${(1.0 + titleWords * 0.09).toFixed(2)}s` }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlide(i)}
                aria-label={`${dict.a11y.image} ${i + 1}`}
                className="group/dot relative h-3 w-8 cursor-pointer"
              >
                <span
                  className={`absolute inset-x-0 top-1/2 h-px -translate-y-1/2 transition-all duration-500 ${
                    i === slide ? "bg-gold" : "bg-white/25 group-hover/dot:bg-white/50"
                  }`}
                />
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Indicador de scroll */}
      <div
        className="hero-fadein absolute bottom-8 left-1/2 z-10 -translate-x-1/2 text-center"
        style={{ animationDelay: `${(1.3 + titleWords * 0.09).toFixed(2)}s` }}
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
      </div>
    </section>
  );
}
