"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2 } from "lucide-react";
import { deleteProperty, togglePublished } from "@/app/admin/actions";

export function RowActions({
  id,
  published,
  name,
}: {
  id: string;
  published: boolean;
  name: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [pub, setPub] = useState(published);

  return (
    <div className="flex items-center justify-end gap-2">
      <button
        disabled={pending}
        onClick={() => {
          // Ocultar saca la ficha de la web en vivo: pedir confirmación
          // (publicarla de nuevo no la pide, es la acción "segura")
          if (pub && !confirm(`¿Ocultar "${name}" de la web? Podrás volver a publicarla con el mismo botón.`))
            return;
          start(async () => {
            const res = await togglePublished(id, !pub);
            if (res.ok) setPub(!pub);
          });
        }}
        aria-label={pub ? "Publicada — ocultar de la web" : "Oculta — publicar en la web"}
        title={pub ? "Publicada — click para ocultar" : "Oculta — click para publicar"}
        className={`grid h-8 w-8 place-items-center rounded-lg border disabled:opacity-40 ${
          pub
            ? "border-gold/40 bg-gold/10 text-gold hover:text-gold-soft"
            : "border-line text-faint hover:text-ink"
        }`}
      >
        {pub ? <Eye size={15} /> : <EyeOff size={15} />}
      </button>
      <button
        disabled={pending}
        onClick={() => {
          if (!confirm(`¿Eliminar "${name}"? Esta acción no se puede deshacer.`)) return;
          start(async () => {
            const res = await deleteProperty(id);
            if (res.ok) router.refresh();
            else alert(res.error);
          });
        }}
        title="Eliminar"
        className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-red-500/50 hover:text-red-400 disabled:opacity-40"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
