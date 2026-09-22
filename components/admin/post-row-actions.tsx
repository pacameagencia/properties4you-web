"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Trash2, ExternalLink } from "lucide-react";
import { deletePost, togglePostPublished } from "@/app/admin/actions";

/** Publicar/ocultar, ver en la web y borrar, por fila de la Guía. */
export function PostRowActions({
  id,
  slug,
  published,
}: {
  id: string;
  slug: string;
  published: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [pub, setPub] = useState(published);

  return (
    <div className="flex items-center justify-end gap-2">
      {pub && (
        <a
          href={`/es/blog/${slug}`}
          target="_blank"
          rel="noopener noreferrer"
          title="Ver en la web"
          aria-label="Ver en la web"
          className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:text-ink"
        >
          <ExternalLink size={15} />
        </a>
      )}
      <button
        disabled={pending}
        onClick={() => {
          // Ocultar saca el artículo de la web en vivo: se confirma.
          // Publicar no pregunta, es la acción segura.
          if (pub && !confirm("¿Ocultar este artículo de la Guía? Podrás volver a publicarlo con el mismo botón."))
            return;
          start(async () => {
            const res = await togglePostPublished(id, !pub);
            if (res.ok) setPub(!pub);
            else alert(res.error);
          });
        }}
        aria-label={pub ? "Publicado — ocultar de la web" : "Borrador — publicar en la web"}
        title={pub ? "Publicado — click para ocultar" : "Borrador — click para publicar"}
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
          if (!confirm("¿Eliminar este artículo? Esta acción no se puede deshacer.")) return;
          start(async () => {
            const res = await deletePost(id);
            if (res.ok) router.refresh();
            else alert(res.error);
          });
        }}
        title="Eliminar"
        aria-label="Eliminar"
        className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted hover:border-red-500/50 hover:text-red-400 disabled:opacity-40"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}
