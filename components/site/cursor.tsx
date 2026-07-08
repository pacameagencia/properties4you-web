"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/** Cursor custom: punto dorado + anillo con inercia. Solo puntero fino (desktop). */
export function Cursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [hidden, setHidden] = useState(true);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 24, mass: 0.5 });
  const ry = useSpring(y, { stiffness: 260, damping: 24, mass: 0.5 });

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!fine) return;
    setEnabled(true);
    document.documentElement.classList.add("p4y-cursor");

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
      const t = e.target as HTMLElement;
      setHovering(!!t.closest("a, button, [role='button'], input, select, textarea, label"));
    };
    const leave = () => setHidden(true);
    window.addEventListener("mousemove", move, { passive: true });
    document.documentElement.addEventListener("mouseleave", leave);
    return () => {
      window.removeEventListener("mousemove", move);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.classList.remove("p4y-cursor");
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <>
      {/* punto */}
      <motion.div
        style={{ x, y }}
        className="pointer-events-none fixed left-0 top-0 z-[300]"
        animate={{ opacity: hidden ? 0 : 1 }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full bg-gold transition-all duration-300 ${
            hovering ? "h-1.5 w-1.5 opacity-80" : "h-2 w-2"
          }`}
        />
      </motion.div>
      {/* anillo con inercia */}
      <motion.div
        style={{ x: rx, y: ry }}
        className="pointer-events-none fixed left-0 top-0 z-[299]"
        animate={{ opacity: hidden ? 0 : 1 }}
      >
        <div
          className={`-translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 ${
            hovering
              ? "h-14 w-14 border-gold/80 bg-gold/10"
              : "h-8 w-8 border-gold/40"
          }`}
        />
      </motion.div>
    </>
  );
}
