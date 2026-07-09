"use client";

import { useEffect, useState } from "react";

export function CountUp({
  value,
  suffix = "",
  duration = 1700,
  className,
}: {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const [n, setN] = useState(value);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min((t - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(value * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    // arranca desde 0 al montar
    // eslint-disable-next-line react-hooks/set-state-in-effect -- inicialización del contador al montar
    setN(0);
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);

  return (
    <span className={className}>
      {n}
      {suffix}
    </span>
  );
}
