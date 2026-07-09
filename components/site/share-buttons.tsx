"use client";

import { useState } from "react";
import { Share2, Link2, Check } from "lucide-react";
import type { Dictionary } from "@/lib/i18n/dictionaries";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.23.2 2.23.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
      <path d="M17.5 14.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.5 0 1.47 1.07 2.9 1.22 3.1.15.2 2.11 3.22 5.1 4.51.71.31 1.27.5 1.7.63.72.23 1.37.2 1.88.12.57-.08 1.76-.72 2-1.41.25-.7.25-1.29.18-1.41-.08-.13-.28-.2-.58-.35z" />
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.34A10 10 0 1 0 12 2zm0 18.2a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2z" />
    </svg>
  );
}

export function ShareButtons({
  dict,
  title,
}: {
  dict: Dictionary;
  title: string;
}) {
  const [copied, setCopied] = useState(false);

  const url = () => window.location.href;

  async function copy() {
    try {
      await navigator.clipboard.writeText(url());
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard no disponible */
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({ title, url: url() });
      } catch {
        /* cancelado */
      }
    } else {
      copy();
    }
  }

  const btn =
    "flex items-center gap-2 rounded-full border border-line px-4 py-2 text-[0.7rem] uppercase tracking-[0.14em] text-muted transition-colors hover:border-gold hover:text-gold";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-[0.68rem] uppercase tracking-[0.2em] text-faint">
        {dict.share.title}
      </span>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `https://wa.me/?text=${encodeURIComponent(`${title}\n${url()}`)}`,
            "_blank",
            "noopener",
          );
        }}
        className={btn}
      >
        <WhatsAppIcon /> WhatsApp
      </a>
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url())}`,
            "_blank",
            "noopener",
          );
        }}
        className={btn}
      >
        <FacebookIcon /> Facebook
      </a>
      <button onClick={copy} className={btn}>
        {copied ? <Check size={14} className="text-gold" /> : <Link2 size={14} />}
        {copied ? dict.share.copied : dict.share.copy}
      </button>
      <button onClick={nativeShare} className={`${btn} sm:hidden`}>
        <Share2 size={14} />
      </button>
    </div>
  );
}
