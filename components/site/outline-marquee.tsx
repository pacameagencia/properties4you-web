/** Marquee tipográfico editorial: palabras gigantes en outline deslizando. */
export function OutlineMarquee({
  words,
  reverse = false,
  gold = false,
}: {
  words: string[];
  reverse?: boolean;
  gold?: boolean;
}) {
  const row = [...words, ...words, ...words];
  const dur = Math.max(30, words.join("").length * 1.6);

  return (
    <div className="pointer-events-none relative z-10 select-none overflow-hidden bg-bg py-4">
      <style>{`
        @keyframes om-left  { to { transform: translateX(calc(-100%/3)); } }
        @keyframes om-right { from { transform: translateX(calc(-100%/3)); } to { transform: translateX(0); } }
        @media (prefers-reduced-motion: reduce) { .om-track { animation: none !important; } }
      `}</style>
      <div
        className="om-track flex w-max items-center gap-12 whitespace-nowrap"
        style={{ animation: `${reverse ? "om-right" : "om-left"} ${dur}s linear infinite` }}
      >
        {row.map((w, i) => (
          <span key={i} className="flex items-center gap-12">
            <span
              className={`font-display text-[16vw] font-light uppercase leading-none tracking-tight sm:text-[9vw] ${
                gold ? "text-outline-gold" : "text-outline"
              }`}
            >
              {w}
            </span>
            <span className="text-2xl text-gold/50">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}
