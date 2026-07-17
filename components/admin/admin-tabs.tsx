"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2, Inbox, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

/** Pestañas del panel: Propiedades · Leads (con contador de nuevos) · Ajustes. */
export function AdminTabs({ newLeads }: { newLeads: number }) {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin", label: "Propiedades", icon: Building2, exact: false },
    { href: "/admin/leads", label: "Leads", icon: Inbox, exact: true },
    { href: "/admin/ajustes", label: "Ajustes", icon: Settings, exact: true },
  ];

  const isActive = (t: (typeof tabs)[number]) =>
    t.href === "/admin"
      ? pathname === "/admin" || pathname.startsWith("/admin/properties")
      : pathname.startsWith(t.href);

  return (
    <nav className="mx-auto flex max-w-6xl gap-1 overflow-x-auto px-5 sm:px-8">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          className={cn(
            "flex items-center gap-2 whitespace-nowrap border-b-2 px-4 py-3 text-[0.78rem] uppercase tracking-[0.14em] transition-colors",
            isActive(t)
              ? "border-gold text-gold"
              : "border-transparent text-muted hover:text-ink",
          )}
        >
          <t.icon size={15} />
          {t.label}
          {t.href === "/admin/leads" && newLeads > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1.5 text-[0.65rem] font-semibold text-bg">
              {newLeads}
            </span>
          )}
        </Link>
      ))}
    </nav>
  );
}
