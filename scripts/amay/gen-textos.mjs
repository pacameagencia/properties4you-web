/**
 * Redacta descripción + características en es/en/de/nl/fr y extrae los POIs
 * de cada ficha a partir de lote/hechos.json. Solo texto: los números de la
 * ficha (precio, m², dormitorios…) los pone arma-casas.mjs desde los datos.
 *
 *   node --env-file=<.env con CLAUDE_API_KEY> gen-textos.mjs [--solo slug]
 *
 * Guarda cada resultado en lote/textos/<slug>.json (si existe, no lo repite).
 */
import { readFile, writeFile, mkdir, access } from "node:fs/promises";
import path from "node:path";

const DIR = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/, "$1"));
// PROVEEDOR=openai cuando la cuenta de Anthropic no tiene saldo (pasó el 2026-09-24).
const PROVEEDOR = process.env.PROVEEDOR || "anthropic";
// PROVEEDOR=gemini: OpenAI también sin saldo ese día. Se prueban los modelos en orden si uno satura (503).
const KEY = PROVEEDOR === "openai" ? process.env.OPENAI_API_KEY
  : PROVEEDOR === "gemini" ? process.env.GEMINI_API_KEY
  : (process.env.ANTHROPIC_API_KEY || process.env.CLAUDE_API_KEY);
const GEMINIS = (process.env.MODELO || "gemini-pro-latest,gemini-3.1-pro-preview,gemini-3.8-flash").split(",");
const MODEL = process.env.MODELO || (PROVEEDOR === "openai" ? "gpt-6-astra" : PROVEEDOR === "gemini" ? GEMINIS[0] : "claude-opus-5-5");
if (!KEY) throw new Error(`Falta la clave de ${PROVEEDOR}`);
const solo = process.argv.includes("--solo") ? process.argv[process.argv.indexOf("--solo") + 1] : null;

const hechos = JSON.parse(await readFile(path.join(DIR, "lote", "hechos.json"), "utf8"));
await mkdir(path.join(DIR, "lote", "textos"), { recursive: true });

const SISTEMA = `Redactas fichas de una inmobiliaria de obra nueva en la Costa Blanca (Properties4You) para compradores europeos.

REGLAS DURAS
- Usa SOLO los datos del JSON de hechos. No inventes distancias, calidades, fechas de entrega, metros, vistas ni servicios que no estén ahí. Si un dato no está, no lo menciones.
- Los textos "descripcion_amay" del promotor son solo fuente de datos: NO copies frases, reescribe con tus palabras.
- No nombres a ningún agente, teléfono, email ni web del promotor. No escribas "contáctanos"/"llámanos". Puedes nombrar la promoción y al promotor Amay como constructor.
- Español de España, tuteo, frases cortas, tono claro y concreto. Prohibido: exclamaciones, superlativos vacíos ("increíble", "espectacular", "de ensueño", "único"), palabras de relleno ("joya", "oasis", "paraíso", "descubre", "sumérgete", "embárcate", "desbloquea", "sin duda", "no es solo X, es Y").
- Precios en formato español (275.000 €). Superficies en m².
- Si la ficha agrupa varias viviendas, la descripción resume el rango (dormitorios, m², precios, plantas) y la lista de características termina con UNA línea por vivienda disponible con este formato exacto: "Ref <ref_amay> · <planta o tipo> · <n> dorm. · <m²> m² · <precio> €" (omite lo que falte; añade "· parcela <m²> m²" si hay parcela).
- Si "sin_unidades" es true: no hay precios ni superficies publicados; dilo con naturalidad ("precio y disponibilidad a consultar") sin inventar cifras.
- Si "ready" es true o alguna vivienda está "Key Ready": está terminada y lista para entrar a vivir; dilo.

FORMATO DE SALIDA: solo un objeto JSON válido, sin texto alrededor:
{
 "es": {"description": "3-4 párrafos separados por \\n\\n, 140-260 palabras", "features": ["6-10 calidades/equipamiento concretos", "...líneas por vivienda si aplica"]},
 "en": {...misma estructura, traducción fiel...}, "de": {...}, "nl": {...}, "fr": {...},
 "pois": [{"type": "beach|airport|golf|hospital|supermarket|school|services|marina|restaurant|playground|pharmacy", "distance": "600 m | 40 min | 10 km"}]
}
Los POIs salen SOLO de distancias explícitas en los hechos (dist_playa, dist_aeropuerto, dist_golf, dist_ocio→"services", o cifras dentro de las descripciones del promotor). Sin repetir tipo. Si no hay ninguna, devuelve [].
En las traducciones, las líneas "Ref …" se traducen (dorm. → bed./Schlafz./slpk./ch.) manteniendo cifras y refs.`;

function recorta(h) {
  // quita ruido que no aporta al redactor
  return {
    ...h,
    unidades: h.unidades.map(({ lat, lng, videos, titulo_amay, ...u }) => ({ ...u, titulo: titulo_amay })),
  };
}

async function llamarGemini(h) {
  const entrada = "HECHOS:\n" + JSON.stringify(recorta(h), null, 1);
  let ultimo;
  for (let intento = 0; intento < 9; intento++) {
    const modelo = GEMINIS[intento % GEMINIS.length];
    const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelo}:generateContent?key=${KEY}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SISTEMA }] },
        contents: [{ role: "user", parts: [{ text: entrada }] }],
        generationConfig: { responseMimeType: "application/json", temperature: 0.4, maxOutputTokens: 32000 },
      }),
    });
    const j = await r.json();
    if (!r.ok) {
      ultimo = `${modelo} ${r.status} ${JSON.stringify(j).slice(0, 200)}`;
      if (r.status === 429 || r.status >= 500) { await new Promise((s) => setTimeout(s, 4000 * (intento + 1))); continue; }
      throw new Error(`${h.slug}: ${ultimo}`);
    }
    const txt = (j.candidates?.[0]?.content?.parts ?? []).filter((p) => !p.thought).map((p) => p.text ?? "").join("");
    try {
      const json = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1));
      for (const l of ["es", "en", "de", "nl", "fr"]) {
        if (!json[l]?.description?.trim() || !json[l]?.features?.length) throw new Error(`falta ${l}`);
      }
      return { ...json, _modelo: modelo, _uso: j.usageMetadata };
    } catch (e) {
      ultimo = `${modelo} respuesta no válida: ${e.message}`;
    }
  }
  throw new Error(`${h.slug}: ${ultimo}`);
}

async function llamar(h) {
  if (PROVEEDOR === "gemini") return llamarGemini(h);
  for (let intento = 1; intento <= 4; intento++) {
    const entrada = "HECHOS:\n" + JSON.stringify(recorta(h), null, 1);
    const r = PROVEEDOR === "openai"
      ? await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: { authorization: `Bearer ${KEY}`, "content-type": "application/json" },
          body: JSON.stringify({ model: MODEL, response_format: { type: "json_object" },
            messages: [{ role: "system", content: SISTEMA }, { role: "user", content: entrada }] }),
        })
      : await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "x-api-key": KEY, "anthropic-version": "2023-06-01", "content-type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 16000,
        system: SISTEMA,
        messages: [{ role: "user", content: "HECHOS:\n" + JSON.stringify(recorta(h), null, 1) }],
      }),
    });
    const j = await r.json();
    if (!r.ok) {
      if (intento < 4 && (r.status === 429 || r.status >= 500)) { await new Promise((s) => setTimeout(s, 5000 * intento)); continue; }
      throw new Error(`${h.slug}: ${r.status} ${JSON.stringify(j).slice(0, 300)}`);
    }
    const txt = PROVEEDOR === "openai" ? j.choices[0].message.content : j.content.filter((c) => c.type === "text").map((c) => c.text).join("");
    const json = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1));
    for (const l of ["es", "en", "de", "nl", "fr"]) {
      if (!json[l]?.description?.trim() || !json[l]?.features?.length) throw new Error(`${h.slug}: falta ${l}`);
    }
    return { ...json, _modelo: MODEL, _uso: j.usage };
  }
}

const lote = solo ? hechos.filter((h) => h.slug === solo) : hechos;
let i = 0, hechas = 0, fallos = [];
await Promise.all(Array.from({ length: 3 }, async () => {
  while (i < lote.length) {
    const h = lote[i++];
    const destino = path.join(DIR, "lote", "textos", `${h.slug}.json`);
    try { if (!solo) { await access(destino); continue; } } catch {}
    try {
      const t = await llamar(h);
      await writeFile(destino, JSON.stringify(t, null, 1));
      console.log(`✓ ${h.slug} · ${t.pois.length} POIs · ${t.es.features.length} caract.`);
      hechas++;
    } catch (e) {
      console.log(`✗ ${e.message}`);
      fallos.push(h.slug);
    }
  }
}));
console.log(`\n${hechas} redactadas · ${fallos.length} fallos ${fallos.join(", ")}`);
if (fallos.length) process.exit(1);
