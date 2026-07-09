"use client";

import { useMemo, useState } from "react";
import { Calculator } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { formatPrice } from "@/lib/utils";

export function MortgageCalculator({
  price,
  dict,
  locale,
}: {
  price: number;
  dict: Dictionary;
  locale: Locale;
}) {
  const [down, setDown] = useState(20); // % entrada
  const [years, setYears] = useState(25);
  const [rate, setRate] = useState(3.2);

  const monthly = useMemo(() => {
    const principal = price * (1 - down / 100);
    const r = rate / 100 / 12;
    const n = years * 12;
    if (r === 0) return principal / n;
    return (principal * r) / (1 - Math.pow(1 + r, -n));
  }, [price, down, years, rate]);

  const row = "flex items-center justify-between gap-4 text-sm";
  const slider =
    "h-1 w-full cursor-pointer appearance-none rounded-full bg-line-2 accent-[#c9a464]";

  return (
    <div className="rounded-2xl border border-line bg-surface p-6">
      <h3 className="flex items-center gap-3 font-display text-xl text-ink">
        <Calculator size={18} className="text-gold" />
        {dict.tools.mortgage}
      </h3>

      <div className="mt-5 space-y-5">
        <div>
          <div className={row}>
            <span className="text-muted">{dict.tools.downPayment}</span>
            <span className="text-ink">
              {down}% · {formatPrice((price * down) / 100, locale)}
            </span>
          </div>
          <input
            type="range"
            min={10}
            max={60}
            step={5}
            aria-label={dict.tools.downPayment}
            value={down}
            onChange={(e) => setDown(Number(e.target.value))}
            className={`${slider} mt-2`}
          />
        </div>

        <div>
          <div className={row}>
            <span className="text-muted">{dict.tools.years}</span>
            <span className="text-ink">{years}</span>
          </div>
          <input
            type="range"
            min={10}
            max={35}
            step={5}
            aria-label={dict.tools.years}
            value={years}
            onChange={(e) => setYears(Number(e.target.value))}
            className={`${slider} mt-2`}
          />
        </div>

        <div>
          <div className={row}>
            <span className="text-muted">{dict.tools.rate}</span>
            <span className="text-ink">{rate.toFixed(1)}%</span>
          </div>
          <input
            type="range"
            min={1.5}
            max={6}
            step={0.1}
            aria-label={dict.tools.rate}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className={`${slider} mt-2`}
          />
        </div>
      </div>

      <div className="mt-6 border-t border-line pt-5 text-center">
        <p className="text-[0.68rem] uppercase tracking-[0.2em] text-faint">
          {dict.tools.monthly}
        </p>
        <p className="mt-1 font-display text-4xl text-gold">
          {formatPrice(Math.round(monthly), locale)}
        </p>
        <p className="mt-3 text-xs text-faint">{dict.tools.disclaimer}</p>
      </div>
    </div>
  );
}
