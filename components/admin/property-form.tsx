"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { saveProperty } from "@/app/admin/actions";
import type { Property } from "@/lib/types";
import { ImageUploader } from "./image-uploader";
import { PoisEditor, AmenitiesEditor } from "./pois-editor";
import type { Poi } from "@/lib/pois";
import { propertyInputSchema } from "@/lib/property-validation";
import { IMAGE_ACCEPT, uploadError, uploadExtension } from "@/lib/upload-validation";
import { ConfirmDialog } from "./confirm-dialog";

const EDIT_LANGUAGES = [{code:"en", label:"Inglés"}, {code:"de", label:"Alemán"}, {code:"nl", label:"Neerlandés"}, {code:"fr", label:"Francés"}] as const;

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
  const [invalidField, setInvalidField] = useState("");
  const [uploads, setUploads] = useState(0);
  const [leaveUrl, setLeaveUrl] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const saving = useRef(false);
  const committed = useRef(false);
  const busy = pending || uploads > 0;
  const onBusyChange = (value: boolean) => setUploads((n) => Math.max(0, n + (value ? 1 : -1)));

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
    published: initial?.published ?? false,
    sort_order: initial?.sort_order?.toString() ?? "0",
    description_es: es.description ?? "",
    features_es: (es.features ?? []).join("\n"),
  });

  const [cover, setCover] = useState<string | null>(initial?.cover_image ?? null);
  const [gallery, setGallery] = useState(initial?.gallery ?? []);
  const [floorPlan, setFloorPlan] = useState<string | null>(
    initial?.floor_plan ?? null,
  );
  const [pois, setPois] = useState<Poi[]>(initial?.pois ?? []);
  const [amenities, setAmenities] = useState<string[]>(initial?.amenities ?? []);
  const [manualLanguages, setManualLanguages] = useState(false);
  const [languages, setLanguages] = useState(() => Object.fromEntries(EDIT_LANGUAGES.map(({code}) => [code, {description: initial?.translations?.[code]?.description ?? "", features: (initial?.translations?.[code]?.features ?? []).join("\n")}])) as Record<"en" | "de" | "nl" | "fr", {description: string; features: string}>);
  const snapshot = JSON.stringify({f, cover, gallery, floorPlan, pois, amenities, manualLanguages, languages});
  const [original] = useState(snapshot);
  const dirty = snapshot !== original;
  useEffect(() => {
    if (!dirty) return;
    const beforeUnload = (event: BeforeUnloadEvent) => { if (!committed.current) { event.preventDefault(); event.returnValue = ""; } };
    const navigate = (event: MouseEvent) => {
      if (committed.current || event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href]");
      if (!link || link.target === "_blank" || link.href === window.location.href || link.getAttribute("href")?.startsWith("#")) return;
      event.preventDefault(); event.stopPropagation(); setLeaveUrl(link.href);
    };
    window.addEventListener("beforeunload", beforeUnload);
    document.addEventListener("click", navigate, true);
    return () => { window.removeEventListener("beforeunload", beforeUnload); document.removeEventListener("click", navigate, true); };
  }, [dirty]);

  const set = (k: keyof typeof f, v: string | boolean) =>
    setF((prev) => ({ ...prev, [k]: v }));

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy || saving.current) return;
    setError(null);
    setInvalidField("");
    const slug = (f.slug || slugify(f.name)).trim();
    if (!f.name.trim() || !slug) {
      setError("El nombre es obligatorio.");
      setInvalidField("name");
      formRef.current?.querySelector<HTMLInputElement>('[name="name"]')?.focus();
      return;
    }
    const payload = {
      id: initial?.id,
      expected_updated_at: initial?.updated_at,
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
      pois: pois.filter((p) => p.distance.trim()),
      amenities,
      description_es: f.description_es,
      features_es: f.features_es.split("\n"),
      manual_translations: manualLanguages ? Object.fromEntries(EDIT_LANGUAGES.map(({code}) => [code, {description: languages[code].description, features: languages[code].features.split("\n").map((text) => text.trim()).filter(Boolean)}])) : undefined,
    };
    const checked = propertyInputSchema.safeParse(payload);
    if (!checked.success) {
      const issue = checked.error.issues[0];
      const field = String(issue.path[0] ?? "");
      setError(issue.message); setInvalidField(field);
      formRef.current?.querySelector<HTMLElement>(`[name="${field}"], #property-${field}`)?.focus();
      return;
    }
    saving.current = true;
    start(async () => {
      try {
        const res = await saveProperty(checked.data);
        if (res.ok) {
          committed.current = true;
          router.push(res.warning ? "/admin?saved=translation-pending" : "/admin?saved=property");
          router.refresh();
        } else setError(res.error ?? "Error al guardar.");
      } catch {
        setError("No se ha podido guardar. Comprueba la conexión y que tu sesión siga abierta. El formulario conserva tus cambios.");
      } finally { saving.current = false; }
    });
  }

  return (
    <form ref={formRef} noValidate onSubmit={submit} aria-busy={busy} className="space-y-8">
      <fieldset disabled={busy} className="space-y-8">
      {/* Básico */}
      <Section title="Datos básicos">
        <Grid>
          <Field label="Nombre *">
            <input
              className={inputCls}
              value={f.name}
              name="name"
              aria-invalid={invalidField === "name"}
              aria-describedby={invalidField === "name" ? "property-error" : undefined}
              onChange={(e) => set("name", e.target.value)}
              onBlur={() => !f.slug && set("slug", slugify(f.name))}
              required
            />
          </Field>
          <Field label="Slug (URL)">
            <input
              className={inputCls}
              value={f.slug}
              name="slug"
              aria-invalid={invalidField === "slug"}
              aria-describedby={invalidField === "slug" ? "property-error" : undefined}
              onChange={(e) => set("slug", slugify(e.target.value))}
              placeholder="se genera del nombre"
            />
          </Field>
          <Field label="Referencia">
            <input
              className={inputCls}
              value={f.reference}
              name="reference"
              aria-invalid={invalidField === "reference"}
              aria-describedby={invalidField === "reference" ? "property-error" : undefined}
              onChange={(e) => set("reference", e.target.value)}
              placeholder="P4Y-001"
            />
          </Field>
          <Field label="Tipo">
            <select
              className={inputCls}
              value={f.type}
              name="type"
              aria-invalid={invalidField === "type"}
              aria-describedby={invalidField === "type" ? "property-error" : undefined}
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
              name="status"
              aria-invalid={invalidField === "status"}
              aria-describedby={invalidField === "status" ? "property-error" : undefined}
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
              name="zone"
              aria-invalid={invalidField === "zone"}
              aria-describedby={invalidField === "zone" ? "property-error" : undefined}
              onChange={(e) => set("zone", e.target.value)}
              placeholder="Los Montesinos"
            />
          </Field>
          <Field label="Provincia">
            <input
              className={inputCls}
              value={f.province}
              name="province"
              aria-invalid={invalidField === "province"}
              aria-describedby={invalidField === "province" ? "property-error" : undefined}
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
              step="0.01"
              min="0"
              value={f.price}
              name="price"
              aria-invalid={invalidField === "price"}
              aria-describedby={invalidField === "price" ? "property-error" : undefined}
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
              step="1"
              min="0"
              value={f.bedrooms}
              name="bedrooms"
              aria-invalid={invalidField === "bedrooms"}
              aria-describedby={invalidField === "bedrooms" ? "property-error" : undefined}
              onChange={(e) => set("bedrooms", e.target.value)}
            />
          </Field>
          <Field label="Baños">
            <input
              type="number"
              className={inputCls}
              step="1"
              min="0"
              value={f.bathrooms}
              name="bathrooms"
              aria-invalid={invalidField === "bathrooms"}
              aria-describedby={invalidField === "bathrooms" ? "property-error" : undefined}
              onChange={(e) => set("bathrooms", e.target.value)}
            />
          </Field>
          <Field label="Superficie (m²)">
            <input
              type="number"
              className={inputCls}
              step="0.01"
              min="0"
              value={f.area_m2}
              name="area_m2"
              aria-invalid={invalidField === "area_m2"}
              aria-describedby={invalidField === "area_m2" ? "property-error" : undefined}
              onChange={(e) => set("area_m2", e.target.value)}
            />
          </Field>
          <Field label="Parcela (m²)">
            <input
              type="number"
              className={inputCls}
              step="0.01"
              min="0"
              value={f.plot_m2}
              name="plot_m2"
              aria-invalid={invalidField === "plot_m2"}
              aria-describedby={invalidField === "plot_m2" ? "property-error" : undefined}
              onChange={(e) => set("plot_m2", e.target.value)}
            />
          </Field>
          <Field label="Certificado energético">
            <select
              className={inputCls}
              value={f.energy_rating}
              name="energy_rating"
              aria-invalid={invalidField === "energy_rating"}
              aria-describedby={invalidField === "energy_rating" ? "property-error" : undefined}
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

      {/* Entorno */}
      <Section
        title="Entorno y distancias"
        hint="Servicios cercanos que se muestran bajo el precio (playa, aeropuerto, golf…). Añade, edita o borra libremente."
      >
        <PoisEditor pois={pois} onChange={setPois} />
      </Section>

      {/* Extras filtrables */}
      <Section
        title="Extras"
        hint="Aparecen como filtros en el buscador y como destacados en la ficha."
      >
        <AmenitiesEditor amenities={amenities} onChange={setAmenities} />
      </Section>

      {/* Contenido */}
      <Section
        title="Contenido (en español)"
        hint="Se traduce a alemán, neerlandés, inglés y francés al cambiar este contenido. Los cambios de precio o fotos conservan las traducciones."
      >
        <Field label="Descripción">
          <textarea
            className={`${inputCls} min-h-32 resize-none field-sizing-content`}
            value={f.description_es}
              name="description_es"
              aria-invalid={invalidField === "description_es"}
              aria-describedby={invalidField === "description_es" ? "property-error" : undefined}
            onChange={(e) => set("description_es", e.target.value)}
          />
        </Field>
        <Field label="Calidades destacadas (una por línea)">
          <textarea
            className={`${inputCls} min-h-32 resize-none field-sizing-content`}
            value={f.features_es}
              name="features_es"
              aria-invalid={invalidField === "features_es"}
              aria-describedby={invalidField === "features_es" ? "property-error" : undefined}
            onChange={(e) => set("features_es", e.target.value)}
            placeholder={"Piscina privada\nCarpintería de aluminio\n..."}
          />
        </Field>
      </Section>

      <Section title="Otros idiomas" hint="Puedes revisar y escribir las traducciones tú mismo. Si activas esta opción, se guardarán estos textos y no se pedirá traducción automática.">
        <label className="flex items-center gap-3 text-sm text-ink">
          <input type="checkbox" checked={manualLanguages} onChange={(event) => setManualLanguages(event.target.checked)} className="h-5 w-5 accent-gold" />
          Editar traducciones manualmente
        </label>
        {manualLanguages && EDIT_LANGUAGES.map(({code, label}) => (
          <details key={code} className="rounded-xl border border-line p-4" open>
            <summary className="cursor-pointer text-gold">{label}</summary>
            <div className="mt-4 space-y-4">
              <Field label={`Descripción (${label})`}>
                <textarea name={`translation_${code}`} className={`${inputCls} min-h-32 resize-none field-sizing-content`} value={languages[code].description} maxLength={20000}
                  onChange={(event) => setLanguages((prev) => ({...prev, [code]: {...prev[code], description: event.target.value}}))} />
              </Field>
              <Field label={`Calidades (${label}, una por línea)`}>
                <textarea className={`${inputCls} min-h-24 resize-none field-sizing-content`} value={languages[code].features}
                  onChange={(event) => setLanguages((prev) => ({...prev, [code]: {...prev[code], features: event.target.value}}))} />
              </Field>
            </div>
          </details>
        ))}
      </Section>

      {/* Media */}
      <Section title="Imágenes" hint="La primera o la marcada con estrella será la portada.">
        <ImageUploader
          folder={f.slug || f.name || "propiedad"}
          onBusyChange={onBusyChange}
          disabled={busy}
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
          onBusyChange={onBusyChange}
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
              name="maps_url"
              aria-invalid={invalidField === "maps_url"}
              aria-describedby={invalidField === "maps_url" ? "property-error" : undefined}
              onChange={(e) => set("maps_url", e.target.value)}
            />
          </Field>
          <Field label="Tour virtual (URL)">
            <input
              className={inputCls}
              value={f.virtual_tour_url}
              name="virtual_tour_url"
              aria-invalid={invalidField === "virtual_tour_url"}
              aria-describedby={invalidField === "virtual_tour_url" ? "property-error" : undefined}
              onChange={(e) => set("virtual_tour_url", e.target.value)}
            />
          </Field>
          <Field label="Vídeo (YouTube/Vimeo URL)">
            <input
              className={inputCls}
              value={f.video_url}
              name="video_url"
              aria-invalid={invalidField === "video_url"}
              aria-describedby={invalidField === "video_url" ? "property-error" : undefined}
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
              name="sort_order"
              aria-invalid={invalidField === "sort_order"}
              aria-describedby={invalidField === "sort_order" ? "property-error" : undefined}
              onChange={(e) => set("sort_order", e.target.value)}
            />
          </Field>
        </Grid>
      </Section>

      </fieldset>
      {uploads > 0 && <p role="status" className="text-sm text-gold">Espera a que terminen las subidas antes de guardar.</p>}
      {error && (
        <p id="property-error" role="alert" className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </p>
      )}

      <div className="sticky bottom-0 flex items-center justify-end gap-3 border-t border-line bg-bg/90 py-4 backdrop-blur">
        <button
          type="button"
          disabled={busy}
          onClick={() => dirty ? setLeaveUrl("/admin") : router.push("/admin")}
          className="rounded-full border border-line px-6 py-3 text-[0.75rem] uppercase tracking-widest text-muted hover:text-ink"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={busy}
          className="flex items-center gap-2 rounded-full bg-gold px-8 py-3 text-[0.75rem] uppercase tracking-widest text-bg disabled:opacity-50"
        >
          {pending && <Loader2 size={15} className="animate-spin" />}
          {initial ? "Guardar cambios" : "Crear propiedad"}
        </button>
      </div>
      <ConfirmDialog open={leaveUrl !== null} title="Cambios sin guardar" confirmLabel="Salir sin guardar" onCancel={() => setLeaveUrl(null)} onConfirm={() => { committed.current = true; window.location.assign(leaveUrl!); }}>
        Los cambios de esta ficha todavía no se han guardado. ¿Quieres salir y descartarlos?
      </ConfirmDialog>
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

function FloorPlanUpload({ folder, value, onChange, onBusyChange }: {
  folder: string; value: string | null; onChange: (url: string | null) => void; onBusyChange: (busy: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const input = useRef<HTMLInputElement>(null);
  async function handle(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || busy) return;
    const invalid = uploadError(file);
    if (invalid) { setError(invalid); e.target.value = ""; return; }
    setBusy(true); onBusyChange(true); setError(null);
    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();
      const path = `${slugify(folder) || "propiedad"}/plano-${crypto.randomUUID()}.${uploadExtension(file.type)}`;
      const { error } = await supabase.storage.from("properties").upload(path, file, { upsert: false, contentType: file.type });
      if (error) throw error;
      const { data } = supabase.storage.from("properties").getPublicUrl(path);
      onChange(data.publicUrl);
    } catch { setError("No se pudo subir el plano. Comprueba la conexión y tu sesión y vuelve a seleccionar el archivo."); }
    finally { setBusy(false); onBusyChange(false); if (input.current) input.current.value = ""; }
  }
  return <div>
    <div className="flex flex-wrap items-center gap-4">
      {value && (/\.pdf(?:\?|$)/i.test(value)
        ? <a href={value} target="_blank" rel="noopener noreferrer" className="text-gold underline">Ver plano PDF</a>
        // eslint-disable-next-line @next/next/no-img-element
        : <img src={value} alt="Plano" className="h-24 rounded-lg border border-line bg-white object-contain p-1" />)}
      <input ref={input} type="file" accept={IMAGE_ACCEPT} hidden onChange={(e) => void handle(e)} />
      <button type="button" disabled={busy} onClick={() => input.current?.click()} className="rounded-full border border-line px-5 py-3 text-xs text-muted hover:border-gold hover:text-gold disabled:opacity-50">{busy ? "Subiendo…" : value ? "Cambiar plano" : "Subir plano"}</button>
      {value && <button type="button" disabled={busy} onClick={() => onChange(null)} className="text-xs text-faint hover:text-red-400">Quitar plano</button>}
    </div>
    <p className="mt-2 text-xs text-faint">JPG, PNG, WebP o AVIF · máximo 10 MB. Convierte los planos PDF a imagen antes de subirlos.</p>
    {error && <p role="alert" className="mt-2 text-sm text-red-400">{error}</p>}
  </div>;
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
      role="switch"
      aria-checked={checked}
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
