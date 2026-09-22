"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Upload, X, Star, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { IMAGE_ACCEPT, uploadError, uploadExtension } from "@/lib/upload-validation";
import type { GalleryImage } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ImageUploader({ folder, cover, gallery, onChange, onBusyChange, disabled = false }: {
  folder: string; cover: string | null; gallery: GalleryImage[];
  onChange: (next: { cover: string | null; gallery: GalleryImage[] }) => void;
  onBusyChange: (busy: boolean) => void; disabled?: boolean;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const lock = useRef(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const [error, setError] = useState<string | null>(null);
  const locked = uploading || disabled;

  async function handleFiles(files: FileList | null) {
    if (!files?.length || lock.current || disabled) return;
    if (gallery.length + files.length > 100) { setError("Puedes añadir hasta 100 imágenes por propiedad."); return; }
    lock.current = true; setUploading(true); onBusyChange(true); setError(null);
    const added: GalleryImage[] = [];
    const errors: string[] = [];
    try {
      const supabase = createClient();
      const base = folder.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "propiedad";
      for (const [index, file] of Array.from(files).entries()) {
        const invalid = uploadError(file);
        if (invalid) { errors.push(invalid); continue; }
        setProgress(`${index + 1} / ${files.length} · ${file.name}`);
        try {
          const path = `${base}/${crypto.randomUUID()}.${uploadExtension(file.type)}`;
          const { error: uploadFailure } = await supabase.storage.from("properties").upload(path, file, {cacheControl:"3600", upsert:false, contentType:file.type});
          if (uploadFailure) { errors.push(`${file.name}: no se pudo subir. Comprueba la conexión y tu sesión.`); continue; }
          const { data } = supabase.storage.from("properties").getPublicUrl(path);
          added.push({url:data.publicUrl, alt:folder});
        } catch { errors.push(`${file.name}: conexión interrumpida. Vuelve a seleccionar este archivo.`); }
      }
    } catch { errors.push("No se pudo iniciar la subida. Comprueba tu sesión."); }
    finally {
      if (added.length) onChange({cover:cover ?? added[0].url, gallery:[...gallery,...added]});
      setError(errors.length ? errors.join("\n") : null);
      lock.current = false; setUploading(false); onBusyChange(false); setProgress("");
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function remove(url: string) {
    const next = gallery.filter((g) => g.url !== url);
    onChange({ cover: cover === url ? next[0]?.url ?? null : cover, gallery: next });
  }
  function move(index: number, delta: number) {
    const next = [...gallery];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    onChange({cover, gallery:next});
  }
  const action = "grid h-9 w-9 place-items-center rounded-md bg-black/75 text-ink hover:text-gold disabled:opacity-30";
  return (
    <div aria-busy={uploading}>
      <input ref={inputRef} type="file" accept={IMAGE_ACCEPT} multiple hidden onChange={(e) => void handleFiles(e.target.files)} />
      <button type="button" id="property-cover_image" onClick={() => inputRef.current?.click()} disabled={locked}
        onDragOver={(e) => e.preventDefault()} onDrop={(e) => { e.preventDefault(); void handleFiles(e.dataTransfer.files); }}
        className="flex w-full items-center justify-center gap-3 rounded-xl border border-dashed border-line-2 bg-bg py-8 text-sm text-muted hover:border-gold hover:text-gold disabled:opacity-50">
        {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
        {uploading ? "Subiendo imágenes…" : "Subir imágenes (arrastra o haz clic)"}
      </button>
      <p className="mt-2 text-xs text-faint">JPG, PNG, WebP o AVIF · máximo 10 MB por imagen · {gallery.length}/100 imágenes. Guarda la ficha para conservar los cambios.</p>
      {progress && <p role="status" className="mt-2 text-sm text-gold">{progress}</p>}
      {error && <p role="alert" className="mt-2 whitespace-pre-line text-sm text-red-400">{error}</p>}
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {gallery.map((img, index) => (
          <div key={img.url} className={cn("relative aspect-[4/3] overflow-hidden rounded-lg border",cover === img.url ? "border-gold" : "border-line")}>
            <Image src={img.url} alt={img.alt || `Foto ${index + 1}`} fill sizes="(max-width:640px) 45vw, 220px" className="object-cover" />
            <div className="absolute inset-x-0 top-0 flex justify-between p-1.5">
              <button type="button" disabled={locked} onClick={() => onChange({cover:img.url,gallery})} aria-label={`Usar foto ${index+1} como portada`} title="Marcar como portada" aria-pressed={cover === img.url} className={action}><Star size={15} fill={cover === img.url ? "currentColor" : "none"} /></button>
              <button type="button" disabled={locked} onClick={() => remove(img.url)} aria-label={`Quitar foto ${index+1}`} title="Quitar imagen de esta ficha" className={action}><X size={15}/></button>
            </div>
            <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-black/65 px-1.5 py-1">
              <span className="text-xs text-white">{cover === img.url ? "Portada" : `${index+1}`}</span>
              <div className="flex gap-1">
                <button type="button" className={action} disabled={locked || index === 0} onClick={() => move(index,-1)} aria-label={`Adelantar foto ${index+1}`}><ArrowLeft size={14}/></button>
                <button type="button" className={action} disabled={locked || index === gallery.length-1} onClick={() => move(index,1)} aria-label={`Retrasar foto ${index+1}`}><ArrowRight size={14}/></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
