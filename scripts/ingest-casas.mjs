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

const URL = process.env.P4Y_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.P4Y_SERVICE_KEY;
// Segunda vía de acceso: la cuenta del panel /admin. La política RLS deja
// escribir en `properties` y subir al bucket a quien esté en `app_admins`,
// que es exactamente lo que hace el panel. Sirve cuando no se tiene a mano la
// service_role (que solo se saca del dashboard de Supabase).
const ADMIN_EMAIL = process.env.P4Y_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.P4Y_ADMIN_PASSWORD;
const ANON =
  process.env.P4Y_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "sb_publishable_ZuAG90j9E1ox-M6t9KfPIA_hJhtxABE"; // clave pública del proyecto

if (!dryRun && (!URL || (!KEY && !(ADMIN_EMAIL && ADMIN_PASSWORD)))) {
  console.error("Faltan credenciales. Necesitas P4Y_SUPABASE_URL y UNA de estas dos:");
  console.error("  · P4Y_SERVICE_KEY   — service_role (Supabase → Settings → API)");
  console.error("  · P4Y_ADMIN_EMAIL + P4Y_ADMIN_PASSWORD — la cuenta del panel /admin");
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
  /* datos_parciales: campos que el promotor NO publica (p. ej. una promoción
     sin unidades a la venta todavía). Se declaran a mano en la ficha para que
     el hueco sea una decisión y no un olvido: nunca se rellenan inventando. */
  const parcial = new Set(ficha.datos_parciales ?? []);
  if (ficha.price == null && !ficha.price_from && !parcial.has("price")) p.push("sin precio");
  if (ficha.bedrooms == null && !parcial.has("bedrooms")) p.push("sin dormitorios");
  if (ficha.bathrooms == null && !parcial.has("bathrooms")) p.push("sin baños");
  if (ficha.area_m2 == null && !parcial.has("area_m2")) p.push("sin m2");
  if (!ficha.maps_url) p.push("sin maps_url");
  if (!ficha.energy_rating) p.push("sin certificado energético");
  if ((!Array.isArray(ficha.pois) || ficha.pois.length < 3) && !parcial.has("pois"))
    p.push(`POIs: ${ficha.pois?.length ?? 0} (mínimo 3)`);
  /* Mínimo 3 imágenes de la vivienda, no 5.
     Los modelos de catálogo (los que se construyen sobre la parcela que elija
     el comprador) no tienen fotos de obra: traen renders y planos comerciales,
     y de algunos el promotor solo entrega uno de cada. Exigir 5 dejaba fuera
     fichas completas y correctas. Lo que no se negocia es que haya al menos
     una imagen de la casa, y eso lo garantiza la portada. */
  if (fotos.length < 3) p.push(`solo ${fotos.length} imagen${fotos.length === 1 ? "" : "es"} (mínimo 3)`);

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
      // "plano.*" no entra en la galería: se sube al campo floor_plan, que la
      // ficha pinta en su propia sección. El cliente pidió justo eso: que los
      // planos no aparezcan mezclados entre las fotos.
      .filter((f) => EXT_FOTO.has(path.extname(f).toLowerCase()) && !/^plano\./i.test(f))
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

let supabase;
if (KEY) {
  supabase = createClient(URL, KEY, { auth: { persistSession: false } });
  console.log("Acceso: service_role\n");
} else {
  supabase = createClient(URL, ANON, { auth: { persistSession: false } });
  const { data: sesion, error: errLogin } = await supabase.auth.signInWithPassword({
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
  });
  if (errLogin) {
    console.error(`No se pudo entrar como ${ADMIN_EMAIL}: ${errLogin.message}`);
    process.exit(1);
  }
  // Estar autenticado no basta: escribir exige estar en app_admins. Si no lo
  // está, las escrituras fallarían una a una a mitad de la subida.
  const { data: esAdmin, error: errAdmin } = await supabase
    .from("app_admins")
    .select("user_id")
    .eq("user_id", sesion.user.id)
    .maybeSingle();
  if (errAdmin || !esAdmin) {
    console.error(`${ADMIN_EMAIL} no figura en app_admins: no puede escribir.`);
    process.exit(1);
  }
  console.log(`Acceso: cuenta de administrador (${ADMIN_EMAIL})\n`);
}
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

  /* Plano de la vivienda. Si la carpeta trae "plano.jpg" (o .png), se sube
     aparte y va al campo floor_plan, que la ficha pinta en su propia sección
     bajo el título "Plano de la vivienda". Así no acaba mezclado entre las
     fotos, que es justo lo que el cliente señaló en su revisión. */
  let floorPlan = ficha.floor_plan ?? null;
  const planoLocal = (await readdir(dir)).find((f) => /^plano\.(jpe?g|png|webp)$/i.test(f));
  if (planoLocal) {
    const destino = `casas/${ficha.slug}/plano.jpg`;
    let buffer = await readFile(path.join(dir, planoLocal));
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
    if (error) throw new Error(`${ficha.slug} · ${planoLocal}: ${error.message}`);
    floorPlan = supabase.storage.from(BUCKET).getPublicUrl(destino).data.publicUrl;
    subidas++;
    console.log("  plano de la vivienda subido");
  }

  // datos_parciales y las notas "_x" son del lote, no columnas de la tabla
  const { datos_parciales, ...columnas } = ficha;
  for (const k of Object.keys(columnas)) if (k.startsWith("_")) delete columnas[k];
  const fila = {
    ...columnas,
    gallery,
    floor_plan: floorPlan,
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

// ---- Verificación: que lo escrito esté de verdad ----
// Un upsert que devuelve sin error y una fila que existe no son lo mismo:
// releemos lo subido en vez de fiarnos de que ninguna llamada lanzó.
const slugs = plan.map(({ ficha }) => ficha.slug);
const { data: guardadas, error: errLectura } = await supabase
  .from("properties")
  .select("slug, cover_image, gallery")
  .in("slug", slugs);
if (errLectura) throw new Error(`No se pudo verificar lo subido: ${errLectura.message}`);

const porSlug = new Map((guardadas ?? []).map((p) => [p.slug, p]));
const fallos = [];
for (const { ficha, fotos } of plan) {
  const g = porSlug.get(ficha.slug);
  if (!g) fallos.push(`${ficha.slug}: no aparece en la tabla`);
  else if (!g.cover_image) fallos.push(`${ficha.slug}: sin portada`);
  else if ((g.gallery?.length ?? 0) !== fotos.length)
    fallos.push(`${ficha.slug}: ${g.gallery?.length ?? 0} fotos guardadas de ${fotos.length}`);
}
if (fallos.length) {
  console.error("\n✗ La subida dice que fue bien, pero la comprobación no cuadra:");
  fallos.forEach((f) => console.error(`   · ${f}`));
  process.exit(1);
}
console.log(`\n✓ Verificado: ${guardadas.length}/${plan.length} fichas están en la base de datos.`);

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
