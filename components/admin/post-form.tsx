"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Loader2, Trash2, Eye, EyeOff } from "lucide-react";
import { savePost, deletePost, type PostInput } from "@/app/admin/actions";
import { ImageUploader } from "./image-uploader";
import type { Post } from "@/lib/queries";

const inputCls =
  "w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold placeholder:text-faint";
const labelCls = "mb-2 block text-xs uppercase tracking-widest text-faint";

/** Convierte un título en identificador de URL: "Guía del NIE" → "guia-del-nie". */
function slugify(v: string): string {
  return v
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 80);
}

/**
 * Alta y edición de artículos de la Guía del comprador.
 *
 * Se escribe solo en español: al guardar, el texto se traduce a los otros
 * cuatro idiomas. Si la traducción falla, no se guarda nada y se dice por qué.
 */
export function PostForm({ initial }: { initial: Post | null }) {
  const router = useRouter();
  const es = initial?.translations?.es ?? {};

  const [f, setF] = useState<PostInput>({
    id: initial?.id,
    slug: initial?.slug ?? "",
    published: initial?.published ?? false,
    sort_order: initial?.sort_order ?? 0,
    cover_image: initial?.cover_image ?? null,
    title_es: es.title ?? "",
    excerpt_es: es.excerpt ?? "",
    body_es: es.body ?? "",
  });
  const [slugTocado, setSlugTocado] = useState(Boolean(initial));
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  function set<K extends keyof PostInput>(k: K, v: PostInput[K]) {
    setF((prev) => ({ ...prev, [k]: v }));
    setSaved(false);
  }

  function onTitulo(v: string) {
    setF((prev) => ({
      ...prev,
      title_es: v,
      slug: slugTocado ? prev.slug : slugify(v),
    }));
    setSaved(false);
  }

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    start(async () => {
      const res = await savePost(f);
      if (res.ok) {
        setSaved(true);
        router.push("/admin/guia");
        router.refresh();
      } else {
        setError(res.error ?? "No se pudo guardar.");
      }
    });
  }

  function borrar() {
    if (!f.id) return;
    if (!confirm("¿Borrar este artículo? No se puede deshacer.")) return;
    start(async () => {
      const res = await deletePost(f.id!);
      if (res.ok) {
        router.push("/admin/guia");
        router.refresh();
      } else setError(res.error ?? "No se pudo borrar.");
    });
  }

  return (
    <form onSubmit={submit} className="space-y-6">
      <section className="space-y-5 rounded-2xl border border-line bg-surface p-6">
        <label className="block">
          <span className={labelCls}>Título (español)</span>
          <input
            value={f.title_es}
            onChange={(e) => onTitulo(e.target.value)}
            placeholder="Cómo conseguir el NIE para comprar en España"
            required
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Dirección del artículo</span>
          <div className="flex items-center gap-2">
            <span className="shrink-0 text-sm text-faint">/blog/</span>
            <input
              value={f.slug}
              onChange={(e) => {
                setSlugTocado(true);
                set("slug", e.target.value);
              }}
              placeholder="como-conseguir-el-nie"
              required
              className={inputCls}
            />
          </div>
          <span className="mt-1.5 block text-xs text-faint">
            Se rellena solo con el título. Si el artículo ya está publicado, cambiarla rompe
            el enlace antiguo.
          </span>
        </label>

        <label className="block">
          <span className={labelCls}>Entradilla</span>
          <textarea
            value={f.excerpt_es}
            onChange={(e) => set("excerpt_es", e.target.value)}
            rows={2}
            placeholder="El resumen que se ve en el listado de la Guía y en Google."
            className={inputCls}
          />
        </label>

        <label className="block">
          <span className={labelCls}>Artículo</span>
          <textarea
            value={f.body_es}
            onChange={(e) => set("body_es", e.target.value)}
            rows={18}
            placeholder={"Escribe aquí.\n\nUna línea en blanco separa párrafos.\n\n## Así se pone un subtítulo\n\n- Y así una lista"}
            className={`${inputCls} font-mono text-sm leading-relaxed`}
          />
          <span className="mt-1.5 block text-xs text-faint">
            Línea en blanco = párrafo nuevo · <code>##</code> al principio de una línea = subtítulo ·
            <code> -</code> = punto de una lista.
          </span>
        </label>
      </section>

      <section className="space-y-5 rounded-2xl border border-line bg-surface p-6">
        <div>
          <span className={labelCls}>Imagen de portada</span>
          {/* Solo portada: la galería del uploader se deja vacía a propósito,
              un artículo no la usa. */}
          <ImageUploader
            folder={`blog/${f.slug || "articulo"}`}
            cover={f.cover_image}
            gallery={[]}
            onChange={(next) => set("cover_image", next.cover)}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className={labelCls}>Orden</span>
            <input
              type="number"
              value={f.sort_order}
              onChange={(e) => set("sort_order", Number(e.target.value) || 0)}
              className={inputCls}
            />
            <span className="mt-1.5 block text-xs text-faint">
              Número más alto, más arriba en la Guía.
            </span>
          </label>

          <label className="flex cursor-pointer items-center gap-3 self-end pb-2.5">
            <input
              type="checkbox"
              checked={f.published}
              onChange={(e) => set("published", e.target.checked)}
              className="h-5 w-5 cursor-pointer accent-[#c9a464]"
            />
            <span className="flex items-center gap-2 text-sm text-ink">
              {f.published ? <Eye size={15} className="text-gold" /> : <EyeOff size={15} className="text-faint" />}
              {f.published ? "Publicado en la web" : "Borrador (no se ve)"}
            </span>
          </label>
        </div>

        {/* Salida de emergencia: sin clave de traducción, guardar fallaría y el
            artículo se perdería. Así al menos se guarda el español. */}
        <label className="flex cursor-pointer items-start gap-3 border-t border-line pt-5">
          <input
            type="checkbox"
            checked={Boolean(f.skipTranslate)}
            onChange={(e) => set("skipTranslate", e.target.checked)}
            className="mt-0.5 h-5 w-5 cursor-pointer accent-[#c9a464]"
          />
          <span className="text-sm text-muted">
            Guardar solo en español, sin traducir
            <span className="mt-1 block text-xs text-faint">
              Los demás idiomas mostrarán el español hasta que vuelvas a guardar sin esta casilla.
              El listado te avisa con «1/5 idiomas».
            </span>
          </span>
        </label>
      </section>

      {error && (
        <p className="rounded-lg border border-[#5c2b2b] bg-[#2a1616] px-4 py-3 text-sm text-[#e0a0a0]" role="alert">
          {error}
        </p>
      )}
      {saved && (
        <p className="text-sm text-gold" role="status">
          ✓ Guardado y traducido a los cinco idiomas.
        </p>
      )}

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-full bg-gold px-8 py-3.5 text-[0.75rem] uppercase tracking-[0.16em] text-bg disabled:opacity-50"
        >
          {pending && <Loader2 size={15} className="animate-spin" />}
          {pending ? "Guardando y traduciendo…" : "Guardar artículo"}
        </button>
        {f.id && (
          <button
            type="button"
            onClick={borrar}
            disabled={pending}
            className="flex items-center gap-2 rounded-full border border-line px-6 py-3.5 text-[0.75rem] uppercase tracking-[0.16em] text-muted transition-colors hover:border-[#5c2b2b] hover:text-[#e0a0a0] disabled:opacity-50"
          >
            <Trash2 size={15} /> Borrar
          </button>
        )}
        <span className="text-xs text-faint">
          Al guardar se traduce a inglés, alemán, neerlandés y francés.
        </span>
      </div>
    </form>
  );
}
