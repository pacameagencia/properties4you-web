// Auditoría de datos: valida que ninguna ficha tenga huecos (solo lectura, anon)
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  "https://njlbbvkdkuavbayqcszp.supabase.co",
  "sb_publishable_ZuAG90j9E1ox-M6t9KfPIA_hJhtxABE",
);

const LANGS = ["es", "en", "de", "nl", "fr"];
const ZONES_INFO = [
  "Los Montesinos", "San Miguel de Salinas", "Daya Nueva", "La Finca Golf",
  "VistaBella Golf", "Pilar de la Horadada", "Rojales", "Dolores",
  "San Fulgencio", "Torrevieja", "Ciudad Quesada",
];

const { data, error } = await supabase
  .from("properties")
  .select("*")
  .order("sort_order", { ascending: false });
if (error) throw error;

console.log(`TOTAL: ${data.length} propiedades\n`);
let issues = 0;
for (const p of data) {
  const probs = [];
  if (!p.published) probs.push("NO publicada");
  if (!p.name?.trim()) probs.push("sin nombre");
  if (!p.reference) probs.push("sin referencia");
  if (!p.zone) probs.push("sin zona");
  else if (!ZONES_INFO.includes(p.zone)) probs.push(`zona sin ZONE_INFO: ${p.zone}`);
  if (p.price == null && !p.price_from) probs.push("sin precio (mostrará 'consultar')");
  if (p.bedrooms == null) probs.push("sin dormitorios");
  if (p.bathrooms == null) probs.push("sin baños");
  if (p.area_m2 == null) probs.push("sin m2");
  if (!p.cover_image) probs.push("SIN PORTADA");
  if (!p.gallery || p.gallery.length < 5) probs.push(`galería corta: ${p.gallery?.length ?? 0}`);
  if (!p.pois || p.pois.length < 3) probs.push(`POIs: ${p.pois?.length ?? 0}`);
  if (!p.maps_url) probs.push("sin maps_url");
  if (!p.energy_rating) probs.push("sin cert. energético");
  for (const l of LANGS) {
    const t = p.translations?.[l];
    if (!t?.description?.trim()) probs.push(`sin descripción ${l.toUpperCase()}`);
    else if (l !== "es" && t.description === p.translations?.es?.description)
      probs.push(`descripción ${l.toUpperCase()} = copia del ES`);
    if (!t?.features?.filter((f) => f?.trim()).length) probs.push(`sin características ${l.toUpperCase()}`);
  }
  const galBad = (p.gallery ?? []).filter((g) => !g?.url).length;
  if (galBad) probs.push(`${galBad} imágenes sin url`);
  if (probs.length) {
    issues++;
    console.log(`✗ ${p.slug} (${p.status})`);
    probs.forEach((x) => console.log(`   · ${x}`));
  } else {
    console.log(`✓ ${p.slug} — ${p.price != null ? p.price + "€" : "a consultar"} · ${p.gallery.length} fotos · ${p.pois.length} POIs · 5 lenguas OK`);
  }
}
console.log(`\n${issues === 0 ? "TODO COMPLETO" : issues + " fichas con huecos"}`);
