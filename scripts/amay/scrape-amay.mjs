/**
 * Extrae TODO el catálogo público de amayproperties.com (promociones + viviendas)
 * a raw/promos.json y raw/units.json, y descarga las fotos a raw/img/.
 *
 *   node scrape-amay.mjs            # extrae y descarga
 *   node scrape-amay.mjs --no-img   # solo datos
 *
 * Idempotente: una foto ya descargada no se vuelve a bajar.
 */
import { mkdir, writeFile, access } from "node:fs/promises";
import path from "node:path";

const BASE = "https://amayproperties.com";
const OUT = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
const RAW = path.join(OUT, "raw");
const IMG = path.join(RAW, "img");
const noImg = process.argv.includes("--no-img");
const UA = { "user-agent": "Mozilla/5.0 (compatible; P4Y-catalogo/1.0)" };

let cookie = "";
async function get(u, tries = 3) {
  for (let i = 0; i < tries; i++) {
    try {
      const r = await fetch(u.startsWith("http") ? u : BASE + u, { headers: { ...UA, cookie } });
      const sc = r.headers.getSetCookie?.() ?? [];
      if (sc.length) cookie = [...new Set([...cookie.split("; ").filter(Boolean), ...sc.map((c) => c.split(";")[0])])].join("; ");
      if (!r.ok) throw new Error(`${r.status} ${u}`);
      return { html: await r.text(), url: r.url };
    } catch (e) {
      if (i === tries - 1) throw e;
      await new Promise((s) => setTimeout(s, 1500 * (i + 1)));
    }
  }
}

const decode = (s) =>
  s.replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
   .replace(/&aacute;/g, "á").replace(/&eacute;/g, "é").replace(/&iacute;/g, "í").replace(/&oacute;/g, "ó")
   .replace(/&uacute;/g, "ú").replace(/&ntilde;/g, "ñ").replace(/&euro;/g, "€").replace(/&raquo;/g, "»")
   .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCharCode(parseInt(h, 16)))
   .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(+d));

function tokens(html) {
  return decode(
    html.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<style[\s\S]*?<\/style>/g, "")
      .replace(/<!--|-->/g, "").replace(/<[^>]+>/g, "\n"),
  ).split("\n").map((s) => s.trim()).filter(Boolean);
}
const num = (s) => (s == null ? null : Number(String(s).replace(/[^\d,]/g, "").replace(",", ".")) || null);

// ───────────────────────── 1. inventario de URLs ─────────────────────────
async function inventario() {
  const units = new Map();
  const add = (href) => {
    const m = href.match(/^\/propiedad\/(\d+)\//);
    if (m && !units.has(m[1])) units.set(m[1], href);
  };
  // listado paginado (la paginación va por sesión: necesita la cookie)
  const first = await get("/propiedades/");
  for (let off = 1; off <= 3000; off += 12) {
    const { html } = off === 1 ? first : await get(`/propiedades/?pag=1&p=${off}`);
    const before = units.size;
    [...html.matchAll(/href="(\/propiedad\/\d+\/[^"]+)"/g)].forEach((m) => add(m[1]));
    if (units.size === before) break;
  }
  // mapa del sitio (a veces trae fichas que el listado no pinta)
  const { html: sm } = await get("/mapa-del-sitio/");
  [...sm.matchAll(/href="(\/propiedad\/\d+\/[^"]+)"/g)].forEach((m) => add(m[1]));
  const { html: pr } = await get("/promociones/");
  const promos = [...new Set([...pr.matchAll(/href="(\/promociones\/\d+\/[^"]+)"/g)].map((m) => m[1]))];
  return { units, promos };
}

// ───────────────────────── 2. promoción ─────────────────────────
async function promo(href) {
  const { html } = await get(href);
  const id = href.split("/")[2];
  const t = tokens(html.slice(html.indexOf("Buscar propiedades", html.indexOf("Reset"))));
  const iDesc = t.indexOf("Descripción");
  const name = t[iDesc - 3] === "Desde" ? t[iDesc - 4] : t[iDesc - 3];
  const iProps = t.indexOf("Propiedades", iDesc);
  const body = t.slice(iDesc + 1, iProps).filter((x) => x !== "Fotografía");
  const piloto = body.find((x) => /^Piloto:/.test(x)) ? body[body.findIndex((x) => /^Piloto:/.test(x)) + 1] : null;
  const description = body.filter((x) => !/^Piloto:/.test(x) && x !== piloto);
  const priceFrom = num(t[t.indexOf("Desde", iDesc - 6) + 1]);
  // imágenes de la promoción (van dentro de un comentario HTML, pero existen)
  const imgs = [...new Set([...html.matchAll(/src="(\/media\/images\/news\/(?!thumbnails)[^"]+\.(?:jpe?g|png|webp))"/gi)].map((m) => m[1]))];
  const unitIds = [...new Set([...html.matchAll(/\/propiedad\/(\d+)\//g)].map((m) => m[1]))];
  const title = decode(html.match(/<title>([^<]*)/)?.[1] ?? "").trim();
  const videos = [...new Set([...html.matchAll(/youtube\.com\/embed\/([\w-]{6,})/g)].map((m) => m[1]))];
  const geo = html.match(/showMap\w*\('gmap',\s*\[\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*\]/);
  return { id, href, title, name, priceFrom, description: description.filter((x) => x !== "Vídeos"), piloto, imgs, unitIds, videos,
    lat: geo ? Number(geo[1]) : null, lng: geo ? Number(geo[2]) : null };
}

// ───────────────────────── 3. vivienda ─────────────────────────
async function unit(id, href) {
  const { html, url } = await get(href);
  const ref = html.match(/class="referencia">\s*([^<]+?)\s*</)?.[1] ?? null;
  const labels = [...html.matchAll(/class="badge[^"]*label-\d+">([^<]+)</g)].map((m) => decode(m[1]).trim());
  const h1 = html.slice(html.indexOf("<h1"), html.indexOf("</h1>") + 5);
  const h1t = tokens(h1);
  const t = tokens(html.slice(html.indexOf("<h1")));
  const iCar = t.indexOf("Características", t.indexOf("Características") + 1) > -1
    ? t.indexOf("Características", t.indexOf("Características") + 1) : t.indexOf("Características");
  const iEnd = t.findIndex((x, i) => i > iCar && (x === "Favoritos" || x === "Localización"));
  const zona = t.slice(iCar + 1, iEnd);
  const kv = {};
  const extras = [];
  for (let i = 0; i < zona.length; i++) {
    const x = zona[i];
    if (x === "Descripción") break;
    if (/:$/.test(x)) {
      let v = zona[i + 1];
      if (zona[i + 2] === "2" && /m$/.test(v)) i++; // "57m" + "2" (sup)
      kv[x.slice(0, -1)] = v;
      i++;
    } else if (x === "Calificación energética") {
      kv["Calificación energética"] = zona[i + 1];
      i++;
    } else extras.push(x);
  }
  const iD = t.indexOf("Descripción", iCar + 1);
  const iL = t.indexOf("Localización", iD);
  const description = iD > -1 ? t.slice(iD + 1, iL > -1 ? iL : iD + 20).filter((x) => x !== "Favoritos") : [];
  const priceTxt = t.slice(0, 40).find((x) => /€$/.test(x));
  const desde = t.slice(0, 40).some((x) => x === "Desde");
  const imgs = [...new Set([...html.matchAll(/(\/img\/[^"'\s]+_xxl\.(?:jpe?g|png|webp))/gi)].map((m) => m[1]))];
  const geo = html.match(/showMapProperty\('gmap',\s*\[\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*\]/);
  const videos = [...new Set([...html.matchAll(/youtube\.com\/embed\/([\w-]{6,})/g)].map((m) => m[1]))];
  return {
    id, href, url, ref, title: h1t.join(" "), labels,
    price: num(priceTxt), price_from: desde,
    features: kv, extras, description,
    imgs, videos,
    lat: geo ? Number(geo[1]) : null, lng: geo ? Number(geo[2]) : null,
  };
}

// ───────────────────────── 4. fotos ─────────────────────────
async function bajar(src) {
  const nombre = src.split("/").pop().replace(/[^\w.\-]/g, "_");
  const destino = path.join(IMG, nombre);
  try { await access(destino); return nombre; } catch {}
  const r = await fetch(BASE + src, { headers: UA });
  if (!r.ok) throw new Error(`foto ${r.status} ${src}`);
  await writeFile(destino, Buffer.from(await r.arrayBuffer()));
  return nombre;
}

async function enParalelo(items, n, fn) {
  const out = []; let i = 0;
  await Promise.all(Array.from({ length: n }, async () => {
    while (i < items.length) { const k = i++; out[k] = await fn(items[k], k); }
  }));
  return out;
}

await mkdir(IMG, { recursive: true });
const { units, promos } = await inventario();
console.log(`Inventario: ${units.size} viviendas, ${promos.length} promociones`);

const P = await enParalelo(promos, 3, promo);
// viviendas que solo aparecen dentro de una promoción
for (const p of P) for (const id of p.unitIds) if (!units.has(id)) units.set(id, `/propiedad/${id}/x/`);
console.log(`Tras cruzar con promociones: ${units.size} viviendas`);

const U = await enParalelo([...units.entries()], 4, ([id, href]) => unit(id, href));
for (const u of U) u.promoId = P.find((p) => p.unitIds.includes(u.id))?.id ?? null;

await writeFile(path.join(RAW, "promos.json"), JSON.stringify(P, null, 1));
await writeFile(path.join(RAW, "units.json"), JSON.stringify(U, null, 1));
console.log(`Guardado: ${P.length} promociones, ${U.length} viviendas`);
console.log(`Sin promoción: ${U.filter((u) => !u.promoId).map((u) => u.ref || u.id).join(", ") || "ninguna"}`);

if (!noImg) {
  const todas = [...new Set([...P.flatMap((p) => p.imgs), ...U.flatMap((u) => u.imgs)])];
  let hechas = 0;
  await enParalelo(todas, 6, async (src) => {
    await bajar(src);
    if (++hechas % 50 === 0) console.log(`  fotos ${hechas}/${todas.length}`);
  });
  console.log(`Fotos: ${todas.length} descargadas en raw/img`);
}
