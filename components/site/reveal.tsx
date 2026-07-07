"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      setShown(true);
      return;
    }

    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      setShown(true);
    };

    // 1) Si ya está en viewport al montar → mostrar ya.
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.05) {
      reveal();
      return;
    }

    // 2) Observer para animar al entrar en viewport.
    let io: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      io = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) reveal();
        },
        { threshold: 0.01, rootMargin: "0px 0px -5% 0px" },
      );
      io.observe(el);
    }

    // 3) Red de seguridad por scroll (por si el observer no dispara con scroll suave).
    const onScroll = () => {
      if (el.getBoundingClientRect().top < window.innerHeight) reveal();
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // 4) Garantía absoluta: el contenido NUNCA queda oculto más de ~1.2 s.
    const failsafe = window.setTimeout(reveal, 1200);

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(failsafe);
    };
  }, []);

  return (
    <Tag
      ref={ref}
      className={cn("reveal", shown && "in", className)}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </Tag>
  );
}
