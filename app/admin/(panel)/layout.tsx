import Link from "next/link";
import { redirect } from "next/navigation";
import { Home, Plus, LogOut } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { signOutAction } from "../actions";

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

  return (
    <div className="min-h-screen bg-bg">
      <header className="sticky top-0 z-40 border-b border-line bg-bg/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="flex items-center gap-[2px]">
              <span className="font-display text-lg text-ink">PROPERTIES</span>
              <span className="font-display text-lg text-gold">4</span>
              <span className="font-display text-lg text-ink">YOU</span>
            </Link>
            <span className="hidden text-xs uppercase tracking-widest text-faint sm:inline">
              Panel de gestión
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/es"
              target="_blank"
              className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-widest text-muted hover:text-ink"
            >
              <Home size={14} /> Ver web
            </Link>
            <Link
              href="/admin/properties/new"
              className="flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-xs uppercase tracking-widest text-bg"
            >
              <Plus size={14} /> Nueva
            </Link>
            <form action={signOutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-full border border-line px-4 py-2 text-xs uppercase tracking-widest text-muted hover:text-ink"
              >
                <LogOut size={14} /> Salir
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10 sm:px-8">{children}</main>
    </div>
  );
}
