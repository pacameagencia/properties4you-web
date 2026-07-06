export function Marquee({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="relative z-10 flex overflow-hidden border-y border-line bg-bg-2 py-5">
      <div className="flex shrink-0 animate-[marquee_38s_linear_infinite] items-center gap-10 pr-10">
        {row.map((item, i) => (
          <span
            key={i}
            className="flex items-center gap-10 whitespace-nowrap font-display text-xl text-muted"
          >
            {item}
            <span className="text-gold">◆</span>
          </span>
        ))}
      </div>
      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </div>
  );
}
