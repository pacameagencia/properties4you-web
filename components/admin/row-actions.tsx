"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { deleteProperty, togglePublished } from "@/app/admin/actions";
import { ConfirmDialog } from "./confirm-dialog";

export function RowActions({ id, published, name }: { id: string; published: boolean; name: string }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [action, setAction] = useState<"visibility" | "delete" | null>(null);
  const [error, setError] = useState<string | null>(null);
  function run() {
    if (pending || !action) return;
    setError(null);
    start(async () => {
      try {
        const result = action === "delete" ? await deleteProperty(id) : await togglePublished(id, !published);
        if (result.ok) { setAction(null); router.refresh(); }
        else setError(result.error ?? "No se ha podido completar la acción.");
      } catch { setError("No se ha podido guardar. Comprueba la conexión y vuelve a intentarlo."); }
    });
  }
  return (
    <div className="flex items-center justify-end gap-2">
      <button type="button" disabled={pending} onClick={() => { setError(null); setAction("visibility"); }}
        aria-label={`${published ? "Ocultar" : "Publicar"} ${name}`}
        className={`grid h-11 w-11 place-items-center rounded-lg border disabled:opacity-40 ${published ? "border-gold/40 text-gold" : "border-line text-faint"}`}>
        {published ? <Eye size={16} /> : <EyeOff size={16} />}
      </button>
      <button type="button" disabled={pending} onClick={() => { setError(null); setAction("delete"); }} aria-label={`Eliminar ${name}`}
        className="grid h-11 w-11 place-items-center rounded-lg border border-line text-muted hover:border-red-500/50 hover:text-red-400 disabled:opacity-40">
        <Trash2 size={16} />
      </button>
      <ConfirmDialog open={action !== null} title={action === "delete" ? "Eliminar propiedad" : published ? "Ocultar propiedad" : "Publicar propiedad"}
        confirmLabel={pending ? "Guardando…" : action === "delete" ? "Eliminar" : published ? "Ocultar" : "Publicar"}
        busy={pending} onConfirm={run} onCancel={() => setAction(null)}>
        <p>{name}</p>
        <p className="mt-2">{action === "delete" ? "Se eliminará la ficha. Esta acción no se puede deshacer." : published ? "La ficha dejará de aparecer en la web. Podrás publicarla de nuevo." : "La ficha será visible para todos los visitantes de la web."}</p>
        {error && <p role="alert" className="mt-3 text-red-400">{error}</p>}
      </ConfirmDialog>
    </div>
  );
}
