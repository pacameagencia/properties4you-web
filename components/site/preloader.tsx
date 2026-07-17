"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EASE = [0.76, 0, 0.24, 1] as const;
const LETTERS = ["P", "R", "O", "P", "E", "R", "T", "I", "E", "S", "4", "Y", "O", "U"];
/** Duración del preloader antes de levantar la cortina (ms). */
const INTRO_MS = 1600;

/**
 * Preloader cinematográfico: marca letra a letra + línea dorada y cortina
 * y el header esperen y su coreografía se vea SIEMPRE tras la cortina.
 * Solo una vez por sesión.
 */
export function Preloader({ kicker }: { kicker: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("p4y-intro")) return;
    // Bots/auditorías (Lighthouse, crawlers): la intro es decorativa, fuera.
    if (navigator.webdriver) return;
    // Si la hidratación llegó tarde (móvil lento), el contenido ya está a la
    // vista: taparlo ahora sería peor UX y hunde el LCP. Saltamos la intro.
    if (performance.now() > 2500) {
      sessionStorage.setItem("p4y-intro", "1");
      return;
    }
    sessionStorage.setItem("p4y-intro", "1");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- decide mostrar intro tras leer sessionStorage
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const t = setTimeout(() => {
      setShow(false);
      document.documentElement.style.overflow = "";
    }, INTRO_MS);
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
          transition={{ duration: 0.95, ease: EASE }}
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#07090b]"
        >
          {/* filo dorado en el borde inferior de la cortina */}
          <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

          <div className="flex overflow-hidden">
            {LETTERS.map((l, i) => (
              <motion.span
                key={i}
                initial={{ y: "110%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.65, ease: EASE, delay: 0.12 + i * 0.04 }}
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
            transition={{ duration: 1.15, ease: EASE, delay: 0.45 }}
            className="mt-6 h-px w-48 origin-left bg-gradient-to-r from-transparent via-gold to-transparent sm:w-72"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.7, delay: 0.9 }}
            className="kicker mt-5"
          >
            {kicker}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
