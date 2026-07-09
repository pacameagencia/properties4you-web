"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveProperty, type PropertyInput } from "@/app/admin/actions";
import type { Property } from "@/lib/types";
import { ImageUploader } from "./image-uploader";

const TYPES = ["villa", "apartamento", "atico", "bungalow", "adosado", "duplex", "parcela"];
const STATUSES = [
  { v: "en_venta", l: "En venta" },
  { v: "reservado", l: "Reservada" },
  { v: "vendido", l: "Vendida" },
];
const ENERGY = ["A", "B", "C", "D", "E", "F", "G", "en_tramite"];

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const numOrNull = (v: string) => (v.trim() === "" ? null : Number(v));

export function PropertyForm({ initial }: { initial: Property | null }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const es = initial?.translations?.es ?? {};

  const [f, setF] = useState({
    name: initial?.name ?? "",
    slug: initial?.slug ?? "",
    reference: initial?.reference ?? "",
    type: initial?.type ?? "villa",
    status: initial?.status ?? "en_venta",
    zone: initial?.zone ?? "",
    province: initial?.province ?? "Alicante",
    price: initial?.price?.toString() ?? "",
    price_from: initial?.price_from ?? true,
    bedrooms: initial?.bedrooms?.toString() ?? "",
    bathrooms: initial?.bathrooms?.toString() ?? "",
    area_m2: initial?.area_m2?.toString() ?? "",
    plot_m2: initial?.plot_m2?.toString() ?? "",
    energy_rating: initial?.energy_rating ?? "",
    maps_url: initial?.maps_url ?? "",
    virtual_tour_url: initial?.virtual_tour_url ?? "",
    video_url: initial?.video_url ?? "",
    featured: initial?.featured ?? false,
    published: initial?.published ?? true,
    sort_order: initial?.sort_order?.toString() ?? "0",
    description_es: es.description ?? "",
    features_es: (es.features ?? []).join("\n"),
  });

  const [cover, setCover] = useState<string | null>(initial?.cover_image ?? null);
  const [gallery, setGallery] = useState(initial?.gallery ?? []);
  const [floorPlan, setFloorPlan] = useState<string | null>(
    initial?.floor_plan ?? null,
  );

  const set = (k: keyof typeof f, v: string | boolean) =>
    setF((prev) => ({ ...prev, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const slug = (f.slug || slugify(f.name)).trim();
    if (!f.name.trim() || !slug) {
      setError("El nombre es obligatorio.");
      return;
    }
    const payload: PropertyInput = {
      id: initial?.id,
      slug,
      name: f.name.trim(),
      reference: f.reference.trim() || null,
      type: f.type,
      status: f.status,
      zone: f.zone.trim() || null,
      province: f.province.trim() || null,
      price: numOrNull(f.price),
      price_from: f.price_from,
      bedrooms: numOrNull(f.bedrooms),
      bathrooms: numOrNull(f.bathrooms),
      area_m2: numOrNull(f.area_m2),
      plot_m2: numOrNull(f.plot_m2),
      energy_rating: f.energy_rating || null,
      maps_url: f.maps_url.trim() || null,
      virtual_tour_url: f.virtual_tour_url.trim() || null,
      video_url: f.video_url.trim() || null,
      floor_plan: floorPlan,
      featured: f.featured,
      published: f.published,
      sort_order: Number(f.sort_order) || 0,
      cover_image: cover,
      gallery,
      description_es: f.description_es,
      features_es: f.features_es.split("\n"),
    };
    start(async () => {
      const res = await saveProperty(payload);
      if (res.ok) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(res.error ?? "Error al guardar.");
      }
    });
  }

  return (
    <form onSubmit={submit} className="space-y-8">
      {/* Básico */}
      <Section title="Datos básicos">
        <Grid>
          <Field label="Nombre *">
            <input
              className={inputCls}
              value={f.name}
              onChange={(e) => set("name", e.target.value)}
              onBlur={() => !f.slug && set("slug", slugify(f.name))}
              required
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              className={inputCls}
              value={f.slug}
              onChange={(e) => set("slug", slugify(e.target.value))}
              placeholder="se genera del nombre"
            />
          </Field>
          <Field label="Referencia">
            <input
              className={inputCls}
              value={f.reference}
              onChange={(e) => set("reference", e.target.value)}
              placeholder="P4Y-001"
            />
          </Field>
          <Field label="Tipo">
            <select
              className={inputCls}
              value={f.type}
              onChange={(e) => set("type", e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Estado">
            <select
              className={inputCls}
              value={f.status}
              onChange={(e) => set("status", e.target.value)}
            >
              {STATUSES.map((s) => (
                <option key={s.v} value={s.v}>
                  {s.l}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Zona">
            <input
              className={inputCls}
              value={f.zone}
              onChange={(e) => set("zone", e.target.value)}
              placeholder="Los Montesinos"
            />
          </Field>
          <Field label="Provincia">
            <input
              className={inputCls}
              value={f.province}
              onChange={(e) => set("province", e.target.value)}
            />
          </Field>
        </Grid>
      </Section>

      {/* Características */}
      <Section title="Características">
        <Grid>
          <Field label="Precio (€)">
            <input
              type="number"
              className={inputCls}
              value={f.price}
              onChange={(e) => set("price", e.target.value)}
            />
          </Field>
          <Field label="Mostrar 'Desde'">
            <Toggle checked={f.price_from} onChange={(v) => set("price_from", v)} />
          </Field>
          <Field label="Dormitorios">
            <input
              type="number"
              className={inputCls}
              value={f.bedrooms}
              onChange={(e) => set("bedrooms", e.target.value)}
            />
          </Field>
          <Field label="Baños">
            <input
              type="number"
              className={inputCls}
              value={f.bathrooms}
              onChange={(e) => set("bathrooms", e.target.value)}
            />
          </Field>
          <Field label="Superficie (m²)">
            <input
              type="number"
              className={inputCls}
              value={f.area_m2}
              onChange={(e) => set("area_m2", e.target.value)}
            />
          </Field>
          <Field label="Parcela (m²)">
            <input
              type="number"
              className={inputCls}
              value={f.plot_m2}
              onChange={(e) => set("plot_m2", e.target.value)}
            />
          </Field>
          <Field label="Certificado energético">
            <select
              className={inputCls}
              value={f.energy_rating}
              onChange={(e) => set("energy_rating", e.target.value)}
            >
              <option value="">—</option>
              {ENERGY.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </Field>
        </Grid>
      </Section>

      {/* Contenido */}
      <Section
        title="Contenido (en español)"
        hint="Se traduce automáticamente a alemán, neerlandés e inglés al guardar."
      >
        <Field label="Descripción">
          <textarea
            className={`${inputCls} min-h-32`}
            value={f.description_es}
            onChange={(e) => set("description_es", e.target.value)}
          />
        </Field>
        <Field label="Calidades destacadas (una por línea)">
          <textarea
            className={`${inputCls} min-h-32`}
            value={f.features_es}
            onChange={(e) => set("features_es", e.target.value)}
            placeholder={"Piscina privada\nCarpintería de aluminio\n..."}
          />
        </Field>
      </Section>

      {/* Media */}
      <Section title="Imágenes" hint="La primera o la marcada con estrella será la portada.">
        <ImageUploader
          folder={f.slug || f.name || "propiedad"}
          cover={cover}
          gallery={gallery}
          onChange={({ cover, gallery }) => {
            setCover(cover);
            setGallery(gallery);
          }}
        />
      </Section>

      {/* Plano de la vivienda */}
      <Section title="Plano de la vivienda" hint="Imagen del plano (opcional).">
        <FloorPlanUpload
          folder={f.slug || f.name || "propiedad"}
          value={floorPlan}
          onChange={setFloorPlan}
        />
      </Section>

      {/* Enlaces */}
      <Section title="Enlaces">
        <Grid>
          <Field label="Google Maps (URL)">
            <input
              className={inputCls}
              value={f.maps_url}
              onChange={(e) => set("maps_url", e.target.value)}
            />
          </Field>
          <Field label="Tour virtual (URL)">
            <input
              className={inputCls}
              value={f.virtual_tour_url}
              onChange={(e) => set("virtual_tour_url", e.target.value)}
            />
          </Field>
          <Field label="Vídeo (YouTube/Vimeo URL)">
            <input
              className={inputCls}
              value={f.video_url}
              onChange={(e) => set("video_url", e.target.value)}
              placeholder="https://youtube.com/watch?v=…"
            />
          </Field>
        </Grid>
      </Section>

      {/* Publicación */}
      <Section title="Publicación">
        <Grid>
          <Field label="Destacada (aparece en portada)">
            <Toggle checked={f.featured} onChange={(v) => set("featured", v)} />
          </Field>
          <Field label="Publicada (visible en la web)">
            <Toggle checked={f.published} onChange={(v) => set("published", v)} />
          </Field>
          <Field label="Orden (mayor = antes)">
            <input
              type="number"
              className={inputCls}
              value={f.sort_order}
              onChange={(e) => set("sort_order", e.target.value)}
            />
          </Field>
        </Grid>
      </Section>

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-line bg-bg/90 py-4 backdrop-blur">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-full border border-line px-6 py-3 text-[0.75rem] uppercase tracking-widest text-muted hover:text-ink"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={pending}
          className="flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-[0.75rem] uppercase tracking-widest text-bg disabled:opacity-50"
        >
          {pending && <Loader2 size={15} className="animate-spin" />}
          {initial ? "Guardar cambios" : "Crear propiedad"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-lg border border-line bg-bg px-4 py-2.5 text-ink outline-none transition-colors focus:border-gold";

function Section({
  title,
  hint,
  children,
}: {
  title: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-line bg-surface p-6">
      <h2 className="font-display text-2xl text-ink">{title}</h2>
      {hint && <p className="mt-1 text-sm text-faint">{hint}</p>}
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-5 sm:grid-cols-2">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs uppercase tracking-widest text-faint">
        {label}
      </span>
      {children}
    </label>
  );
}

function FloorPlanUpload({
  folder,
  value,
  onChange,
}: {
  folder: string;
  value: string | null;
  onChange: (url: string | null) => void;
}) {
  const [busy, setBusy] = useState(false);

  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${slugify(folder) || "propiedad"}/plano-${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("properties")
      .upload(path, file, { upsert: true });
    if (!error) {
      const { data } = supabase.storage.from("properties").getPublicUrl(path);
      onChange(data.publicUrl);
    }
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-4">
      {value ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={value}
          alt="Plano"
          className="h-24 rounded-lg border border-line bg-white object-contain p-1"
        />
      ) : null}
      <label className="cursor-pointer rounded-full border border-line px-5 py-2.5 text-[0.72rem] uppercase tracking-widest text-muted hover:border-gold hover:text-gold">
        {busy ? "Subiendo…" : value ? "Cambiar plano" : "Subir plano"}
        <input type="file" accept="image/*,.pdf" hidden onChange={handle} />
      </label>
      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-faint hover:text-red-400"
        >
          Quitar
        </button>
      )}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition-colors ${
        checked ? "bg-gold" : "bg-line-2"
      }`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-bg transition-all ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  );
}
