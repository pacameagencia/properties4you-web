import Link from "next/link";
import { Pencil, Plus, BookOpen } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { Post } from "@/lib/queries";
import { PostRowActions } from "@/components/admin/post-row-actions";

export const dynamic = "force-dynamic";

/** Listado de artículos de la Guía del comprador. */
export default async function AdminGuiaPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });
  const posts = (data ?? []) as Post[];
  const publicados = posts.filter((p) => p.published).length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink">Guía del comprador</h1>
          <p className="mt-1 text-sm text-muted">
            {posts.length} {posts.length === 1 ? "artículo" : "artículos"} · {publicados} publicados
          </p>
        </div>
        <Link
          href="/admin/guia/new"
          className="flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[0.75rem] uppercase tracking-[0.16em] text-bg"
        >
          <Plus size={15} /> Nuevo artículo
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line py-24 text-center">
          <BookOpen size={26} className="mx-auto text-faint" />
          <p className="mt-4 text-muted">Aún no hay artículos en la Guía.</p>
          <Link href="/admin/guia/new" className="mt-2 inline-block text-sm text-gold hover:underline">
            Escribir el primero
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-left text-xs uppercase tracking-widest text-faint">
                <th className="px-3 py-4 font-medium sm:px-5">Título</th>
                <th className="hidden px-5 py-4 font-medium md:table-cell">Idiomas</th>
                <th className="hidden px-5 py-4 font-medium sm:table-cell">Orden</th>
                <th className="px-3 py-4 text-right font-medium sm:px-5">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => {
                const idiomas = ["es", "en", "de", "nl", "fr"].filter(
                  (l) => p.translations?.[l]?.title?.trim(),
                );
                return (
                  <tr key={p.id} className="border-b border-line last:border-0 hover:bg-surface/50">
                    <td className="px-3 py-4 sm:px-5">
                      <Link
                        href={`/admin/guia/${p.id}`}
                        className="flex items-center gap-2 font-medium text-ink hover:text-gold"
                      >
                        <Pencil size={13} className="text-faint" />
                        {p.translations?.es?.title || p.slug}
                        {!p.published && (
                          <span className="rounded bg-white/5 px-1.5 py-0.5 text-[0.68rem] uppercase tracking-wider text-faint">
                            Borrador
                          </span>
                        )}
                      </Link>
                      <span className="text-xs text-faint">/blog/{p.slug}</span>
                    </td>
                    <td className="hidden px-5 py-4 md:table-cell">
                      <span className={idiomas.length === 5 ? "text-muted" : "text-[#e0a0a0]"}>
                        {idiomas.length === 5 ? "5 idiomas" : `${idiomas.length}/5 · ${idiomas.join(" ")}`}
                      </span>
                    </td>
                    <td className="hidden px-5 py-4 text-muted sm:table-cell">{p.sort_order}</td>
                    <td className="px-3 py-4 text-right sm:px-5">
                      <PostRowActions id={p.id} slug={p.slug} published={p.published} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
