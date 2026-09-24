/**
 * Control de calidad de lote/textos: palabras vetadas, contacto del promotor,
 * exclamaciones y cifras de las líneas "Ref …" contra los datos de Amay.
 *   node revisa-textos.mjs
 */
import { readFile, readdir } from "node:fs/promises";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const hechos = Object.fromEntries(JSON.parse(await readFile(path.join(DIR, "lote/hechos.json"), "utf8")).map((h) => [h.slug, h]));
const VETADAS = /\b(increíble|espectacular|de ensueño|únic[oa]|joya|oasis|paraíso|descubre|sumérgete|embárcate|desbloquea|sin duda|no es solo)\b/i;
const CONTACTO = /(\+34|\b6\d{2}\s?\d{2}\s?\d{2}\s?\d{2}\b|@|amayproperties|www\.|cont[aá]ct(a|en)nos|ll[aá]manos|Astrid|Fred)/i;

let problemas = 0;
for (const f of (await readdir(path.join(DIR, "lote/textos"))).sort()) {
  const slug = f.replace(/\.json$/, "");
  const t = JSON.parse(await readFile(path.join(DIR, "lote/textos", f), "utf8"));
  const h = hechos[slug];
  const p = [];
  for (const l of ["es", "en", "de", "nl", "fr"]) {
    const todo = [t[l].description, ...t[l].features].join("\n");
    if (CONTACTO.test(todo)) p.push(`${l}: contacto del promotor → "${todo.match(CONTACTO)[0]}"`);
    if (/!/.test(todo)) p.push(`${l}: exclamación`);
  }
  const es = [t.es.description, ...t.es.features].join("\n");
  if (VETADAS.test(es)) p.push(`es: palabra vetada "${es.match(VETADAS)[0]}"`);
  // líneas Ref: precio y m² tienen que coincidir con la unidad
  const refs = t.es.features.filter((x) => /^Ref /.test(x));
  if (h.unidades.length > 1 && refs.length !== h.unidades.length) p.push(`líneas Ref: ${refs.length} de ${h.unidades.length} viviendas`);
  for (const linea of refs) {
    const ref = linea.match(/^Ref (\S+)/)[1];
    const u = h.unidades.find((x) => x.ref_amay === ref);
    if (!u) { p.push(`Ref desconocida ${ref}`); continue; }
    const precio = Number((linea.match(/([\d.]+)\s*€/)?.[1] ?? "").replace(/\./g, ""));
    if (u.precio && precio !== u.precio) p.push(`${ref}: precio ${precio} ≠ ${u.precio}`);
    const m2 = Number(linea.match(/·\s*([\d,.]+)\s*m²/)?.[1]?.replace(",", "."));
    if (u.m2_construidos && m2 && m2 !== u.m2_construidos) p.push(`${ref}: ${m2} m² ≠ ${u.m2_construidos}`);
  }
  // precios que aparezcan en la descripción tienen que existir en los datos
  const precios = new Set(h.unidades.map((u) => u.precio));
  for (const m of t.es.description.matchAll(/([\d]{1,3}(?:\.\d{3})+)\s*€/g)) {
    const v = Number(m[1].replace(/\./g, ""));
    if (!precios.has(v)) p.push(`descripción cita ${m[0]} y no es precio de ninguna vivienda`);
  }
  if (p.length) { problemas += p.length; console.log(`✗ ${slug}\n   · ${p.join("\n   · ")}`); }
  else console.log(`✓ ${slug}`);
}
console.log(`\n${problemas} problemas`);
process.exit(problemas ? 1 : 0);
