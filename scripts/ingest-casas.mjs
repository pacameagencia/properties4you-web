/**
 * Ingesta de promociones: sube fotos a Storage y hace upsert de las fichas.
 *
 *   node scripts/ingest-casas.mjs <carpeta> [--dry-run] [--solo=slug]
 *
 * La carpeta debe contener:
 *   casas.json     → array de fichas (ver FICHA_EJEMPLO al final de este archivo)
 *   <slug>/        → una carpeta de fotos por ficha (jpg/png/webp, orden alfabético)
 *
 * Credenciales por entorno, nunca en el código (este repo es público):
 *   P4Y_SUPABASE_URL=https://<ref>.supabase.co
 *   P4Y_SERVICE_KEY=<service_role>
 *
 * Valida TODAS las fichas antes de subir un solo byte: o entra la tanda entera,
 * o no entra nada. Las reglas son las mismas que audit-data.mjs comprueba
 * después, así que una ingesta correcta deja la auditoría en verde.
 *
 * Es idempotente: reingestar el mismo slug reemplaza sus fotos y su ficha.
 */
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";

const LANGS = ["es", "en", "de", "nl", "fr"];
const BUCKET = "properties";
const EXT_FOTO = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const ANCHO_MAX = 2000;
const CALIDAD = 82;

const [carpeta, ...flags] = process.argv.slice(2);
const dryRun = flags.includes("--dry-run");
const solo = flags.find((f) => f.startsWith("--solo="))?.slice(7);

if (!carpeta) {
  console.error("Uso: node scripts/ingest-casas.mjs <carpeta> [--dry-run] [--solo=slug]");
  process.exit(1);
}

const URL = process.env.P4Y_SUPABASE_URL;
const KEY = process.env.P4Y_SERVICE_KEY;
if (!dryRun && (!URL || !KEY)) {
  console.error("Faltan P4Y_SUPABASE_URL y/o P4Y_SERVICE_KEY en el entorno.");
  process.exit(1);
}

// sharp es solo para la ingesta, no entra en el bundle de la web.
let sharp = null;
try {
  ({ default: sharp } = await import("sharp"));
} catch {
  console.warn("⚠ sharp no está instalado — las fotos subirán sin redimensionar.");
  console.warn("  Para redimensionar: npm i -D sharp\n");
}

/** Reglas de calidad: las mismas que audit-data.mjs exige después. */
function validar(ficha, fotos) {
  const p = [];
  if (!ficha.slug?.trim()) p.push("sin slug");
  if (!ficha.name?.trim()) p.push("sin nombre");
  if (!ficha.reference) p.push("sin referencia");
  if (!ficha.zone) p.push("sin zona");
  if (ficha.price == null && !ficha.price_from) p.push("sin precio");
  if (ficha.bedrooms == null) p.push("sin dormitorios");
  if (ficha.bathrooms == null) p.push("sin baños");
  if (ficha.area_m2 == null) p.push("sin m2");
  if (!ficha.maps_url) p.push("sin maps_url");
  if (!ficha.energy_rating) p.push("sin certificado energético");
  if (!Array.isArray(ficha.pois) || ficha.pois.length < 3) p.push(`POIs: ${ficha.pois?.length ?? 0} (mínimo 3)`);
  if (fotos.length < 5) p.push(`solo ${fotos.length} foto${fotos.length === 1 ? "" : "s"} (mínimo 5)`);

  const es = ficha.translations?.es?.description?.trim();
  for (const l of LANGS) {
    const t = ficha.translations?.[l];
    if (!t?.description?.trim()) p.push(`sin descripción ${l.toUpperCase()}`);
    else if (l !== "es" && es && t.description.trim() === es)
      p.push(`descripción ${l.toUpperCase()} es copia literal del ES`);
    if (!t?.features?.filter((f) => f?.trim()).length) p.push(`sin características ${l.toUpperCase()}`);
  }
  return p;
}

async function fotosDe(dir) {
  try {
    const todo = await readdir(dir);
    return todo
      .filter((f) => EXT_FOTO.has(path.extname(f).toLowerCase()))
      .sort((a, b) => a.localeCompare(b, "es", { numeric: true }));
  } catch {
    return [];
  }
}

const fichas = JSON.parse(await readFile(path.join(carpeta, "casas.json"), "utf8"));
const lote = solo ? fichas.filter((f) => f.slug === solo) : fichas;
if (!lote.length) {
  console.error(solo ? `No hay ninguna ficha con slug "${solo}".` : "casas.json está vacío.");
  process.exit(1);
}

// ---- Validación previa: nada se sube si algo falla ----
console.log(`Validando ${lote.length} ficha(s)…\n`);
let invalidas = 0;
const plan = [];
for (const ficha of lote) {
  const dir = path.join(carpeta, ficha.slug ?? "");
  const fotos = await fotosDe(dir);
  const problemas = validar(ficha, fotos);
  if (problemas.length) {
    invalidas++;
    console.log(`✗ ${ficha.slug ?? "(sin slug)"}`);
    problemas.forEach((x) => console.log(`   · ${x}`));
  } else {
    console.log(`✓ ${ficha.slug} — ${fotos.length} fotos · ${ficha.pois.length} POIs · 5 lenguas`);
    plan.push({ ficha, dir, fotos });
  }
}
if (invalidas) {
  console.error(`\n${invalidas} ficha(s) con huecos. No se sube nada hasta que estén completas.`);
  process.exit(1);
}
if (dryRun) {
  console.log("\n--dry-run: validación superada, no se ha subido nada.");
  process.exit(0);
}

// ---- Subida ----
// Import perezoso: validar y --dry-run no deben depender de node_modules.
const { createClient } = await import("@supabase/supabase-js");
const supabase = createClient(URL, KEY, { auth: { persistSession: false } });
let subidas = 0;

for (const { ficha, dir, fotos } of plan) {
  console.log(`\n▸ ${ficha.slug}`);
  const gallery = [];

  for (const [i, nombre] of fotos.entries()) {
    const destino = `casas/${ficha.slug}/${String(i + 1).padStart(2, "0")}.jpg`;
    let buffer = await readFile(path.join(dir, nombre));
    if (sharp) {
      buffer = await sharp(buffer)
        .rotate()
        .resize({ width: ANCHO_MAX, withoutEnlargement: true })
        .jpeg({ quality: CALIDAD, progressive: true })
        .toBuffer();
    }
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(destino, buffer, { contentType: "image/jpeg", upsert: true });
    if (error) throw new Error(`${ficha.slug} · ${nombre}: ${error.message}`);

    const { data } = supabase.storage.from(BUCKET).getPublicUrl(destino);
    gallery.push({ url: data.publicUrl, alt: `${ficha.name} — imagen ${i + 1}` });
    process.stdout.write(`\r  fotos ${i + 1}/${fotos.length}`);
    subidas++;
  }
  console.log("");

  const fila = {
    ...ficha,
    gallery,
    cover_image: gallery[0].url,
    published: ficha.published ?? true,
    status: ficha.status ?? "en_venta",
    type: ficha.type ?? "villa",
    province: ficha.province ?? "Alicante",
    price_from: ficha.price_from ?? false,
    featured: ficha.featured ?? false,
    amenities: ficha.amenities ?? [],
    updated_at: new Date().toISOString(),
  };

  const { error } = await supabase.from("properties").upsert(fila, { onConflict: "slug" });
  if (error) throw new Error(`${ficha.slug}: ${error.message}`);
  console.log(`  ficha guardada · ${gallery.length} fotos`);
}

console.log(`\nListo: ${plan.length} ficha(s), ${subidas} fotos.`);
console.log("Comprueba con: node scripts/audit-data.mjs");
console.log("Si alguna zona es nueva, añádela a lib/zones.ts y despliega (el resto sale vivo sin deploy).");

/* FICHA_EJEMPLO — una entrada de casas.json:
{
  "slug": "villas-del-mar",
  "reference": "P4Y-011",
  "name": "Villas del Mar",
  "zone": "Torrevieja",
  "type": "villa",
  "price": 349000,
  "price_from": true,
  "bedrooms": 3,
  "bathrooms": 2,
  "area_m2": 112,
  "plot_m2": 300,
  "energy_rating": "En trámite",
  "latitude": 37.9787,
  "longitude": -0.6822,
  "maps_url": "https://maps.google.com/?q=37.9787,-0.6822",
  "sort_order": 110,
  "amenities": ["private_pool", "sea_views"],
  "pois": [
    { "type": "beach", "distance": "10 min" },
    { "type": "golf", "distance": "5 min" },
    { "type": "airport", "distance": "45 min" }
  ],
  "translations": {
    "es": { "description": "…", "features": ["…"] },
    "en": { "description": "…", "features": ["…"] },
    "de": { "description": "…", "features": ["…"] },
    "nl": { "description": "…", "features": ["…"] },
    "fr": { "description": "…", "features": ["…"] }
  }
}
*/
