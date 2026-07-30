import Link from "next/link";
import { redirect } from "next/navigation";
import { Home, Plus, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "../actions";
import { AdminTabs } from "@/components/admin/admin-tabs";

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const { count: newLeads } = await supabase
    .from("leads")
    .select("id", { count: "exact", head: true })
    .eq("status", "nuevo");

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-5 py-4 sm:px-8">
          <div className="flex min-w-0 items-center gap-6">
            <Link href="/admin" className="flex shrink-0 items-center gap-[2px]">
              <span className="font-display text-base text-ink sm:text-lg">PROPERTIES</span>
              <span className="font-display text-base text-gold sm:text-lg">4</span>
              <span className="font-display text-base text-ink sm:text-lg">YOU</span>
            </Link>
            <span className="hidden text-xs uppercase tracking-widest text-faint md:inline">
              Panel de gestión
            </span>
          </div>
          {/* En móvil los botones quedan a solo-icono para no chocar con el logo */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/es"
              target="_blank"
              aria-label="Ver web"
              className="flex items-center gap-2 rounded-full border border-line p-2.5 text-xs uppercase tracking-widest text-muted hover:text-ink sm:px-4 sm:py-2"
            >
              <Home size={14} /> <span className="hidden sm:inline">Ver web</span>
            </Link>
            <Link
              href="/admin/properties/new"
              aria-label="Nueva propiedad"
              className="flex items-center gap-2 rounded-full bg-gold p-2.5 text-xs uppercase tracking-widest text-bg sm:px-4 sm:py-2"
            >
              <Plus size={14} /> <span className="hidden sm:inline">Nueva</span>
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                aria-label="Salir"
                className="flex items-center gap-2 rounded-full border border-line p-2.5 text-xs uppercase tracking-widest text-muted hover:text-ink sm:px-4 sm:py-2"
              >
                <LogOut size={14} /> <span className="hidden sm:inline">Salir</span>
              </button>
            </form>
          </div>
        </div>
        <AdminTabs newLeads={newLeads ?? 0} />
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
