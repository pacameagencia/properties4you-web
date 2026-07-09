"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu, X, Heart } from "lucide-react";
import { locales, type Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import { useEntrance } from "@/lib/use-entrance";
import { useFavorites } from "@/lib/favorites";
import { cn } from "@/lib/utils";

export function Header({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const ready = useEntrance();
  const { favs } = useFavorites();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  const rest = pathname.replace(/^\/(es|en|de|nl|fr)/, "") || "";
  const swapLocale = (l: Locale) => `/${l}${rest}`;

  const links = [
    { href: `/${locale}`, label: dict.nav.home },
    { href: `/${locale}/propiedades`, label: dict.nav.properties },
    { href: `/${locale}/blog`, label: dict.nav.blog },
    { href: `/${locale}/nosotros`, label: dict.nav.about },
  ];

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={ready ? { y: 0, opacity: 1 } : {}}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-[#0a0d10]/85 backdrop-blur-xl border-b border-line py-3"
          : "bg-transparent py-6",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link href={`/${locale}`} className="group flex items-center gap-[2px]">
          <span className="font-display text-lg font-medium tracking-wide text-ink">
            PROPERTIES
          </span>
          <span className="font-display text-lg font-medium text-gold">4</span>
          <span className="font-display text-lg font-medium tracking-wide text-ink">
            YOU
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-9 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="link-underline text-[0.8rem] uppercase tracking-[0.16em] text-muted transition-colors hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
          <Link
            href={`/${locale}/favoritos`}
            aria-label={dict.favs.title}
            className="relative text-muted transition-colors hover:text-gold"
          >
            <Heart size={17} />
            {favs.length > 0 && (
              <span className="absolute -right-2 -top-2 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[0.58rem] font-semibold text-bg">
                {favs.length}
              </span>
            )}
          </Link>
          <div className="ml-2 flex items-center gap-2 border-l border-line pl-5">
            {locales.map((l) => (
              <Link
                key={l}
                href={swapLocale(l)}
                className={cn(
                  "text-[0.72rem] uppercase tracking-widest transition-colors",
                  l === locale ? "text-gold" : "text-faint hover:text-ink",
                )}
              >
                {l}
              </Link>
            ))}
          </div>
        </nav>

        <button
          onClick={() => setOpen((v) => !v)}
          className="text-ink md:hidden"
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "overflow-hidden border-line bg-[#0a0d10]/95 backdrop-blur-xl transition-all duration-500 md:hidden",
          open ? "max-h-96 border-t" : "max-h-0",
        )}
      >
        <nav className="flex flex-col gap-1 px-6 py-5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="py-3 font-display text-2xl text-ink"
            >
              {l.label}
            </Link>
          ))}
          <div className="mt-4 flex gap-4 border-t border-line pt-5">
            {locales.map((l) => (
              <Link
                key={l}
                href={swapLocale(l)}
                className={cn(
                  "text-sm uppercase tracking-widest",
                  l === locale ? "text-gold" : "text-faint",
                )}
              >
                {l}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </motion.header>
  );
}
