"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/** Barra fina dorada arriba que marca el progreso de lectura. */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 26,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[120] h-[2px] origin-left bg-gradient-to-r from-gold/40 via-gold to-gold-soft"
    />
  );
}
