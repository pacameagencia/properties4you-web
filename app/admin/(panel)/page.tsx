import Link from "next/link";
import { Pencil } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatPrice } from "@/lib/utils";
import type { Property } from "@/lib/types";
import { RowActions } from "@/components/admin/row-actions";

const STATUS_LABEL: Record<string, string> = {
  en_venta: "En venta",
  reservado: "Reservada",
  vendido: "Vendida",
};

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("properties")
    .select("*")
    .order("sort_order", { ascending: false })
    .order("created_at", { ascending: false });
  const properties = (data ?? []) as Property[];

  const published = properties.filter((p) => p.published).length;

  return (
    <>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl text-ink">Propiedades</h1>
          <p className="mt-1 text-sm text-muted">
            {properties.length} en total · {published} publicadas
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="rounded-full bg-gold px-6 py-3 text-[0.75rem] uppercase tracking-[0.16em] text-bg"
        >
          + Nueva propiedad
        </Link>
      </div>

      {properties.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-line py-24 text-center text-muted">
          Aún no hay propiedades. Crea la primera.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-line bg-surface text-left text-xs uppercase tracking-widest text-faint">
                <th className="px-5 py-4 font-medium">Nombre</th>
                <th className="hidden px-5 py-4 font-medium sm:table-cell">Zona</th>
                <th className="hidden px-5 py-4 font-medium md:table-cell">Estado</th>
                <th className="px-5 py-4 font-medium">Precio</th>
                <th className="px-5 py-4 text-right font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-line last:border-0 hover:bg-surface/50"
                >
                  <td className="px-5 py-4">
                    <Link
                      href={`/admin/properties/${p.id}`}
                      className="flex items-center gap-2 font-medium text-ink hover:text-gold"
                    >
                      <Pencil size={13} className="text-faint" />
                      {p.name}
                      {p.featured && <span className="text-gold">◆</span>}
                      {!p.published && (
                        <span className="rounded bg-white/5 px-1.5 py-0.5 text-[0.6rem] uppercase tracking-wider text-faint">
                          Oculta
                        </span>
                      )}
                    </Link>
                    <span className="text-xs text-faint">
                      {p.reference || p.slug}
                    </span>
                  </td>
                  <td className="hidden px-5 py-4 text-muted sm:table-cell">
                    {p.zone}
                  </td>
                  <td className="hidden px-5 py-4 text-muted md:table-cell">
                    {STATUS_LABEL[p.status] ?? p.status}
                  </td>
                  <td className="px-5 py-4 text-ink">{formatPrice(p.price)}</td>
                  <td className="px-5 py-4">
                    <RowActions id={p.id} published={p.published} name={p.name} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
