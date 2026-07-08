"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1] as const;
const LETTERS = ["P", "R", "O", "P", "E", "R", "T", "I", "E", "S", "4", "Y", "O", "U"];

/**
 * Preloader cinematográfico: marca que se revela letra a letra + línea dorada,
 * y cortina que sube. Solo una vez por sesión (el cliente lo mira a diario).
 */
export function Preloader({ kicker }: { kicker: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("p4y-intro")) return;
    sessionStorage.setItem("p4y-intro", "1");
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = "";
    }, 2300);
    return () => {
      clearTimeout(t);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          exit={{ y: "-100%" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#07090b]"
        >
          <div className="flex overflow-hidden">
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.7, ease: EASE, delay: 0.15 + i * 0.045 }}
                className={`font-display text-3xl tracking-[0.18em] sm:text-5xl ${
                  l === "4" ? "text-gold" : "text-ink"
                }`}
              >
                {l}
              </motion.span>
            ))}
          </div>

          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1.3, ease: EASE, delay: 0.5 }}
            className="mt-6 h-px w-48 origin-left bg-gradient-to-r from-transparent via-gold to-transparent sm:w-72"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            className="kicker mt-5"
          >
            {kicker}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
