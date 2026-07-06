"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Star, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";

function slugifyBase(name: string) {
  return (
    name
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "propiedad"
  );
}

export function ImageUploader({
  folder,
  cover,
  gallery,
  onChange,
}: {
  folder: string;
  cover: string | null;
  gallery: GalleryImage[];
  onChange: (next: { cover: string | null; gallery: GalleryImage[] }) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleFiles(files: FileList | null) {
    if (!files || !files.length) return;
    setUploading(true);
    setError(null);
    const supabase = createClient();
    const base = slugifyBase(folder);
    const added: GalleryImage[] = [];

    for (const file of Array.from(files)) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${base}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;
      const { error: upErr } = await supabase.storage
        .from("properties")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (upErr) {
        setError(upErr.message);
        continue;
      }
      const { data } = supabase.storage.from("properties").getPublicUrl(path);
      added.push({ url: data.publicUrl, alt: "" });
    }

    const nextGallery = [...gallery, ...added];
    onChange({
      cover: cover ?? added[0]?.url ?? null,
      gallery: nextGallery,
    });
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  function remove(url: string) {
    const nextGallery = gallery.filter((g) => g.url !== url);
    onChange({
      cover: cover === url ? nextGallery[0]?.url ?? null : cover,
      gallery: nextGallery,
    });
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-line-2 bg-bg py-8 text-sm text-muted transition-colors hover:border-gold hover:text-ink disabled:opacity-50"
      >
        {uploading ? (
          <Loader2 size={18} className="animate-spin" />
        ) : (
          <Upload size={18} />
        )}
        {uploading ? "Subiendo…" : "Subir imágenes (arrastra o haz clic)"}
      </button>
      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}

      {gallery.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {gallery.map((img) => (
            <div
              key={img.url}
              className={cn(
                "group relative aspect-[4/3] overflow-hidden rounded-lg border",
                cover === img.url ? "border-gold" : "border-line",
              )}
            >
              <Image
                src={img.url}
                alt=""
                fill
                sizes="200px"
                className="object-cover"
              />
              <div className="absolute inset-0 flex items-start justify-between p-1.5 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => onChange({ cover: img.url, gallery })}
                  title="Marcar como portada"
                  className={cn(
                    "grid h-6 w-6 place-items-center rounded-md bg-black/60 backdrop-blur",
                    cover === img.url ? "text-gold" : "text-ink",
                  )}
                >
                  <Star size={12} fill={cover === img.url ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => remove(img.url)}
                  title="Quitar"
                  className="grid h-6 w-6 place-items-center rounded-md bg-black/60 text-ink backdrop-blur hover:text-red-400"
                >
                  <X size={12} />
                </button>
              </div>
              {cover === img.url && (
                <span className="absolute bottom-1 left-1 rounded bg-gold px-1.5 py-0.5 text-[0.55rem] uppercase tracking-wider text-bg">
                  Portada
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
