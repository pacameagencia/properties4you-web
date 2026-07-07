"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { Magnetic } from "./magnetic";

const EASE = [0.22, 1, 0.36, 1] as const;

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
  heroImage,
}: {
  locale: Locale;
  dict: Dictionary;
  heroImage: string | null;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);

  return (
    <section
      ref={ref}
      className="relative flex min-h-[100svh] items-end overflow-hidden"
    >
      {heroImage && (
        <motion.div
          style={{ y: imgY, scale: imgScale }}
          className="absolute inset-0"
        >
          <div
            className="hero-kenburns absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          />
        </motion.div>
      )}

      <motion.div style={{ opacity: overlayOpacity }} className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0d10]/80 via-[#0a0d10]/40 to-[#0a0d10]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0d10]/85 via-[#0a0d10]/20 to-transparent" />
      </motion.div>
      <div className="pointer-events-none absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-gold/10 blur-[130px]" />

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
      </motion.div>

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
