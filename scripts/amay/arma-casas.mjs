/**
 * Une lote/hechos.json (datos de Amay) + lote/textos/<slug>.json (redacción)
 * en lote/casas.json, el formato que sube scripts/ingest-casas.mjs.
 *
 * Todas las cifras salen de los datos de Amay, nunca del texto redactado.
 *
 *   node arma-casas.mjs
 */
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const LOTE = path.join(DIR, "lote");
const hechos = JSON.parse(await readFile(path.join(LOTE, "hechos.json"), "utf8"));

const min = (xs) => { const v = xs.filter((x) => x != null && !Number.isNaN(x)); return v.length ? Math.min(...v) : null; };
const moda = (xs) => { const c = {}; xs.forEach((x) => (c[x] = (c[x] || 0) + 1)); return Object.entries(c).sort((a, b) => b[1] - a[1])[0]?.[0]; };

/** "600 Mts." → "600 m" · "40 Mins." → "40 min" · "5 Km." → "5 km" */
function distancia(v) {
  if (!v) return null;
  const m = String(v).match(/([\d.,]+)\s*([A-Za-z]+)/);
  if (!m) return null;
  const n = m[1].replace(/\.$/, "");
  const u = m[2].toLowerCase();
  if (u.startsWith("mt") || u === "m") return `${n} m`;
  if (u.startsWith("min")) return `${n} min`;
  if (u.startsWith("km")) return `${n} km`;
  return null;
}

/** POIs deterministas a partir de las distancias que publica Amay. */
function poisDeDatos(uds) {
  const out = [];
  const add = (type, v) => { const d = distancia(v); if (d && !out.some((p) => p.type === type)) out.push({ type, distance: d }); };
  for (const u of uds) {
    add("beach", u.dist_playa);
    add("airport", u.dist_aeropuerto);
    add("golf", u.dist_golf);
    add("services", u.dist_ocio);
  }
  return out;
}

/* Líneas por vivienda ("Ref … · planta · dorm. · m² · precio"). Las escribe el
   código desde los datos de Amay, no el redactor: el modelo se saltaba unidades
   (Waldorf, Marquesado) y erraba referencias (AMLD por AMDL). */
const PLANTA = {
  "Planta Baja": { en: "Ground floor", de: "Erdgeschoss", nl: "Begane grond", fr: "Rez-de-chaussée" },
  "Primera Planta": { en: "First floor", de: "1. Etage", nl: "Eerste verdieping", fr: "1er étage" },
  "Planta Alta": { en: "Upper floor", de: "Obergeschoss", nl: "Bovenverdieping", fr: "Étage" },
  "Tercera Planta": { en: "Third floor", de: "3. Etage", nl: "Derde verdieping", fr: "3e étage" },
  "Cuarta planta": { en: "Fourth floor", de: "4. Etage", nl: "Vierde verdieping", fr: "4e étage" },
  "Ático": { en: "Penthouse", de: "Penthouse", nl: "Penthouse", fr: "Attique" },
};
const DORM = { es: "dorm.", en: "bed.", de: "Schlafz.", nl: "slpk.", fr: "ch." };
const PARC = { es: "parcela", en: "plot", de: "Grundstück", nl: "perceel", fr: "terrain" };
const precioTxt = (v, l) =>
  l === "en" ? `€${v.toLocaleString("en-GB")}` : l === "fr" ? `${v.toLocaleString("fr-FR").replace(/ | /g, " ")} €` : `${v.toLocaleString("de-DE")} €`;
const m2Txt = (v, l) => (l === "en" ? String(v) : String(v).replace(".", ","));
function lineasRef(uds, l) {
  return uds.map((u) => {
    const p = [`Ref ${u.ref_amay}`];
    if (u.planta) p.push(l === "es" ? u.planta : PLANTA[u.planta]?.[l] ?? u.planta);
    if (u.dormitorios != null) p.push(`${u.dormitorios} ${DORM[l]}`);
    if (u.m2_construidos != null) p.push(`${m2Txt(u.m2_construidos, l)} m²`);
    if (u.m2_parcela != null) p.push(`${PARC[l]} ${m2Txt(u.m2_parcela, l)} m²`);
    if (u.precio) p.push(precioTxt(u.precio, l));
    return p.join(" · ");
  });
}

const TIPOS_POI = new Set(["beach", "airport", "golf", "hospital", "supermarket", "school", "services", "marina", "restaurant", "playground", "pharmacy"]);

const casas = [];
const avisos = [];
for (const [i, h] of hechos.entries()) {
  let t;
  try {
    t = JSON.parse(await readFile(path.join(LOTE, "textos", `${h.slug}.json`), "utf8"));
  } catch {
    avisos.push(`${h.slug}: SIN TEXTO`);
    continue;
  }
  const u = h.unidades;
  const precios = u.map((x) => x.precio).filter(Boolean);
  const energias = u.map((x) => x.energia).filter(Boolean);
  const letra = moda(energias.filter((e) => /^[A-G]$/.test(e)));

  // POIs: los de los datos mandan. Si esta vivienda no trae distancias, valen las
  // que Amay publica para otras viviendas de la MISMA promoción (misma urbanización).
  // La 124 "Llave en mano" no cuenta: mezcla edificios distintos.
  const hermanas = h.promocion_amay && h.promocion_amay.nombre !== "Llave en Mano - Costa Blanca"
    ? hechos.filter((x) => x.promocion_amay?.nombre === h.promocion_amay.nombre).flatMap((x) => x.unidades)
    : [];
  const pois = poisDeDatos([...u, ...hermanas]);
  for (const p of t.pois ?? []) {
    if (TIPOS_POI.has(p.type) && p.distance && !pois.some((q) => q.type === p.type)) pois.push({ type: p.type, distance: String(p.distance) });
  }

  const conGeo = h.lat != null && h.lng != null;
  const amenities = [];
  // "Privada" siempre cuenta; un "Sí" a secas solo en villas (en un piso puede ser la comunitaria)
  if (u.some((x) => /privad/i.test(x.piscina ?? "") || (h.type === "villa" && /^s[ií]$/i.test(x.piscina ?? ""))))
    amenities.push("private_pool");
  if (u.some((x) => x.etiquetas.includes("Vistas al mar"))) amenities.push("sea_views");
  if (h.ready || u.some((x) => x.etiquetas.includes("Llave en mano") || x.estado === "Key Ready")) amenities.push("ready_now");

  const parciales = [];
  const ficha = {
    slug: h.slug,
    reference: `AMAY-${String(i + 1).padStart(2, "0")}`,
    name: h.name,
    zone: h.zone,
    province: h.province,
    type: h.type,
    status: "en_venta",
    price: precios.length ? Math.min(...precios) : null,
    // "Desde" si la ficha agrupa varias viviendas o si Amay ya lo marca así
    price_from: u.length > 1 || u.some((x) => x.precio_desde),
    bedrooms: min(u.map((x) => x.dormitorios)),
    bathrooms: min(u.map((x) => x.banos)),
    area_m2: min(u.map((x) => x.m2_construidos)),
    plot_m2: h.type === "villa" ? min(u.map((x) => x.m2_parcela)) : null,
    energy_rating: letra ?? "en_tramite",
    latitude: conGeo ? h.lat : null,
    longitude: conGeo ? h.lng : null,
    maps_url: conGeo
      ? `https://maps.google.com/?q=${h.lat},${h.lng}`
      : `https://maps.google.com/?q=${encodeURIComponent(`${h.name.split(" · ")[0]}, ${h.zone}, ${h.province}`)}`,
    video_url: h.video ? `https://www.youtube.com/watch?v=${h.video}` : null,
    sort_order: 70 - i,
    featured: false,
    published: true,
    amenities,
    pois,
    translations: Object.fromEntries(["es", "en", "de", "nl", "fr"].map((l) => {
      const calidades = t[l].features.filter((x) => !/^Ref\s/.test(x));
      return [l, { description: t[l].description, features: u.length > 1 ? [...calidades, ...lineasRef(u, l)] : calidades }];
    })),
  };
  // Promociones sin unidades en Amay (Balcones de Vivi, Villas Pinoso): lo que
  // el promotor dice en su texto de promoción, y nada más.
  if (h.slug === "villas-pinoso-el-valle-de-hondon") { ficha.bedrooms = 3; ficha.bathrooms = 2; }
  if (h.slug === "balcones-de-vivi") { ficha.bedrooms = 2; }
  for (const k of ["price", "bedrooms", "bathrooms", "area_m2"]) if (ficha[k] == null) parciales.push(k);
  if (pois.length < 3) parciales.push("pois");
  if (parciales.length) {
    ficha.datos_parciales = parciales;
    avisos.push(`${h.slug}: sin publicar por el promotor → ${parciales.join(", ")}`);
  }
  casas.push(ficha);
}

await writeFile(path.join(LOTE, "casas.json"), JSON.stringify(casas, null, 2));
console.log(`${casas.length} fichas en lote/casas.json`);
avisos.forEach((a) => console.log("  · " + a));
