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
        onClick={() =>
          start(async () => {
            const res = await togglePublished(id, !pub);
            if (res.ok) setPub(!pub);
          })
        }
        title={pub ? "Publicada — click para ocultar" : "Oculta — click para publicar"}
        className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:text-ink disabled:opacity-40"
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
