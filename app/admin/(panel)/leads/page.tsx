import { Inbox } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { LeadRow, type LeadRowData } from "@/components/admin/lead-row";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);
  const leads = (data ?? []) as LeadRowData[];

  const nuevos = leads.filter((l) => l.status === "nuevo").length;

  return (
    <>
      <div className="mb-8">
        <h1 className="font-display text-4xl text-ink">Leads</h1>
        <p className="mt-1 text-sm text-muted">
          {leads.length} en total · {nuevos} sin gestionar. Cada formulario de
          visita o mensaje de la galería queda registrado aquí, además de
          abrirse en WhatsApp.
        </p>
      </div>

      {leads.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-line py-24 text-center">
          <div>
            <Inbox className="mx-auto mb-4 text-faint" size={28} />
            <p className="text-muted">
              Aún no hay leads. Cuando alguien pida una visita o escriba desde
              la galería, aparecerá aquí.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {leads.map((l) => (
            <LeadRow key={l.id} lead={l} />
          ))}
        </div>
      )}
    </>
  );
}
