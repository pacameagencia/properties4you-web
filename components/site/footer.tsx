import Link from "next/link";
import { MapPin, Phone, Mail } from "lucide-react";
import type { Locale } from "@/lib/i18n/config";
import type { Dictionary } from "@/lib/i18n/dictionaries";
import type { SiteSettings } from "@/lib/types";

export function Footer({
  locale,
  dict,
  settings,
}: {
  locale: Locale;
  dict: Dictionary;
  settings: SiteSettings | null;
}) {
  const email = settings?.contact_email || "info@properties4you.es";
  const phone = settings?.contact_phone || "+34 650 37 92 58";
  const address = settings?.address || "03187 Los Montesinos, Alicante";

  return (
    <footer className="relative z-10 border-t border-line bg-bg-2">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-16 sm:px-8 md:grid-cols-3">
        <div>
          <div className="mb-4 flex items-center gap-[2px]">
            <span className="font-display text-xl text-ink">PROPERTIES</span>
            <span className="font-display text-xl text-gold">4</span>
            <span className="font-display text-xl text-ink">YOU</span>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-muted">
            {dict.footer.tagline}
          </p>
        </div>

        <div>
          <p className="kicker mb-5">{dict.footer.nav}</p>
          <ul className="space-y-3 text-sm">
            <li>
              <Link href={`/${locale}`} className="text-muted hover:text-ink">
                {dict.nav.home}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/propiedades`} className="text-muted hover:text-ink">
                {dict.nav.properties}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/nosotros`} className="text-muted hover:text-ink">
                {dict.nav.about}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="kicker mb-5">{dict.footer.contact}</p>
          <ul className="space-y-3 text-sm text-muted">
            <li className="flex items-center gap-3">
              <MapPin size={15} className="text-gold" /> {address}
            </li>
            <li className="flex items-center gap-3">
              <Phone size={15} className="text-gold" />
              <a href={`tel:${phone.replace(/\s/g, "")}`} className="hover:text-ink">
                {phone}
              </a>
            </li>
            <li className="flex items-center gap-3">
              <Mail size={15} className="text-gold" />
              <a href={`mailto:${email}`} className="hover:text-ink">
                {email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-line">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-2 px-5 py-6 text-xs text-faint sm:flex-row sm:items-center sm:px-8">
          <span>
            ©{new Date().getFullYear()} Properties4You · {dict.footer.rights}
          </span>
          <span>{dict.footer.disclaimer}</span>
        </div>
      </div>
    </footer>
  );
}
