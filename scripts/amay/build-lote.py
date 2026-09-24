"""
Agrupa las 100 viviendas + 12 promociones de Amay en fichas de Properties4You.

Salida:
  lote/hechos.json          -> hechos verificables de cada ficha (entrada del redactor)
  lote/<slug>/NN.jpg        -> galería sin duplicados ni planos, portada en 01
  lote/<slug>/plano.jpg     -> un plano de distribución, si lo hay

Uso: python build-lote.py
"""
import json, os, re, shutil, hashlib
from PIL import Image, ImageChops

BASE = os.path.dirname(os.path.abspath(__file__))
RAW = os.path.join(BASE, "raw")
OUT = os.path.join(BASE, "lote")
MAX_FOTOS = 150

P = {p["id"]: p for p in json.load(open(os.path.join(RAW, "promos.json"), encoding="utf8"))}
U = {u["ref"]: u for u in json.load(open(os.path.join(RAW, "units.json"), encoding="utf8"))}

# ─── agrupación ─────────────────────────────────────────────────────────────
# slug, nombre, tipo, zona, provincia, promo_id, [refs], extra
F = [
  # Amay Deluxe · Dehesa de Campoamor (Orihuela Costa): una ficha por modelo
  ("amay-deluxe-villa-silvia", "Amay Deluxe · Villa Silvia", "villa", "Dehesa de Campoamor", "Alicante", "107", ["AMDL-SIL32"], {}),
  ("amay-deluxe-villa-silvia-llave-en-mano", "Amay Deluxe · Villa Silvia llave en mano", "villa", "Dehesa de Campoamor", "Alicante", "107", ["KRAMDL-S131"], {"ready": True}),
  ("amay-deluxe-villa-sophie", "Amay Deluxe · Villa Sophie", "villa", "Dehesa de Campoamor", "Alicante", "107", ["AMDL-SP33"], {}),
  ("amay-deluxe-villa-penelope", "Amay Deluxe · Villa Penélope", "villa", "Dehesa de Campoamor", "Alicante", "107", ["AMDL-P34"], {}),
  ("amay-deluxe-villa-marta", "Amay Deluxe · Villa Marta", "villa", "Dehesa de Campoamor", "Alicante", "107", ["AMDL-M32"], {}),
  ("amay-deluxe-villa-greta", "Amay Deluxe · Villa Greta", "villa", "Dehesa de Campoamor", "Alicante", "107", ["AMDL-GR"], {}),
  ("amay-deluxe-villa-akira", "Amay Deluxe · Villa Akira", "villa", "Dehesa de Campoamor", "Alicante", "107", ["AMDL-AK"], {}),
  # Amay Bellavista · San Miguel de Salinas
  ("amay-bellavista-bungalows", "Amay Bellavista · Bungalows", "bungalow", "San Miguel de Salinas", "Alicante", "108", ["BELL-29B", "BELL-35A", "BELL-35B"], {"ready": True}),
  ("amay-bellavista-villa-gemma-plus", "Amay Bellavista · Villa Gemma Plus", "villa", "San Miguel de Salinas", "Alicante", "108", ["BELL-GP", "BELL-G20"], {}),
  ("amay-bellavista-villa-lea", "Amay Bellavista · Villa Lea", "villa", "San Miguel de Salinas", "Alicante", "108", ["BELL-L", "BELL-L21"], {}),
  ("amay-bellavista-villa-lea-mediterraneo", "Amay Bellavista · Villa Lea Mediterráneo", "villa", "San Miguel de Salinas", "Alicante", "108", ["BELL-LM45"], {}),
  ("amay-bellavista-villa-marta", "Amay Bellavista · Villa Marta", "villa", "San Miguel de Salinas", "Alicante", "108", ["BELL-M"], {}),
  ("amay-bellavista-villa-penelope", "Amay Bellavista · Villa Penélope", "villa", "San Miguel de Salinas", "Alicante", "108", ["BELL-P21"], {}),
  # Monte Carmelo Resort · Vera (Almería)
  ("monte-carmelo-resort-villas", "Monte Carmelo Resort · Villas", "villa", "Vera", "Almería", "131", ["MC-71", "MC-73", "MC-063"], {}),
  ("monte-carmelo-resort-villa-laguna-azul", "Monte Carmelo Resort · Villa Laguna Azul", "villa", "Vera", "Almería", "131", ["MC-16", "MC-17", "MC-014", "MC-015"], {}),
  # Residencial Laguna Azul · Los Montesinos
  ("residencial-laguna-azul-villa-3-dormitorios", "Residencial Laguna Azul · Villa de 3 dormitorios", "villa", "Los Montesinos", "Alicante", "197", ["RLGAZUL-2"], {"ready": True}),
  ("residencial-laguna-azul-villa-5-dormitorios", "Residencial Laguna Azul · Villa de 5 dormitorios", "villa", "Los Montesinos", "Alicante", "197", ["RLGAZUL-1"], {"ready": True}),
  # Villas del Mar II · La Manga del Mar Menor (Murcia)
  ("villas-del-mar-ii-la-manga", "Villas del Mar II", "villa", "La Manga del Mar Menor", "Murcia", "265", ["VDMR-34A", "VDMR-33", "VDMR-35"], {}),
  # Bloques de apartamentos: una ficha por residencial
  ("residencial-moma-ii", "Residencial MoMA II", "apartamento", "Benijófar", "Alicante", "297",
   ["RMO2-0B", "RMO2-1B", "RMO2-0C", "RMO2-1C", "RMO2-0D", "RMO2-0F", "RMO2-0J", "RMO2-1G", "RMO2-1D", "RMO2-0A", "RMO2-2C", "KRRMO2-1i"], {}),
  ("residencial-moma-i", "Residencial MoMA I", "apartamento", "Benijófar", "Alicante", None, ["RMOI-1A"], {}),
  ("residencial-waldorf-astoria", "Residencial Waldorf Astoria", "apartamento", "Benijófar", "Alicante", "292",
   [r for r in U if r.startswith("WAR-")], {}),
  ("residencial-kasia-v", "Residencial Kasia V", "apartamento", "Torrevieja", "Alicante", "276",
   [r for r in U if r.startswith("KASV-")], {}),
  ("marquesado-de-molins", "Marquesado de Molins", "apartamento", "Torre de la Horadada", "Alicante", "329",
   [r for r in U if r.startswith("MDM-")], {}),
  # Llave en mano: viviendas terminadas, una ficha cada una
  ("apartamento-playa-del-cura-torrevieja", "Apartamento en Playa del Cura", "apartamento", "Torrevieja", "Alicante", "124", ["POLIII-1A"], {"ready": True}),
  ("atico-la-mata-torrevieja", "Ático en La Mata", "atico", "Torrevieja", "Alicante", "124", ["CAR-4A"], {"ready": True}),
  ("atico-primera-linea-la-mata", "Ático en primera línea de La Mata", "atico", "Torrevieja", "Alicante", "124", ["MAR-5A"], {"ready": True}),
  ("residencial-perseo-torrevieja", "Residencial Perseo · Plantas bajas", "apartamento", "Torrevieja", "Alicante", "124", ["PERSEO-1", "PERSEO-2"], {"ready": True}),
  ("aticos-playa-de-los-locos", "Áticos en Playa de los Locos", "atico", "Torrevieja", "Alicante", "124", ["KRDLMAR-5A", "KRDLMAR-5B"], {"ready": True}),
  ("villas-las-lagunas-rojales", "Villas Las Lagunas", "villa", "Rojales", "Alicante", "124", ["KRLAG-49"], {"ready": True}),
  # Promociones sin unidades publicadas en Amay: precio a consultar
  ("balcones-de-vivi", "Balcones de Vivi", "apartamento", "Torrevieja", "Alicante", "194", [], {"sin_unidades": True}),
  ("villas-pinoso-el-valle-de-hondon", "Villas Pinoso · El Valle de Hondón", "villa", "Pinoso", "Alicante", "308", [], {"sin_unidades": True}),
]

# comprobación: cada vivienda de Amay en exactamente una ficha
usadas = [r for f in F for r in f[6]]
dups = {r for r in usadas if usadas.count(r) > 1}
duplicados_amay = {"KRBELL-29B": "BELL-29B", "KRBELL-35A": "BELL-35A", "KRRLGAZUL-1": "RLGAZUL-1"}
faltan = [r for r in U if r not in usadas and r not in duplicados_amay]
assert not dups, f"refs repetidas: {dups}"
assert not faltan, f"viviendas sin ficha: {faltan}"

# ─── imágenes ───────────────────────────────────────────────────────────────
def local(src):
    return os.path.join(RAW, "img", src.split("/")[-1].replace(" ", "_"))

def md5(p):
    return hashlib.md5(open(p, "rb").read()).hexdigest()

def ahash(p):
    im = Image.open(p).convert("L").resize((16, 16))
    px = list(im.getdata()); m = sum(px) / len(px)
    return tuple(1 if v > m else 0 for v in px)

def es_plano(p):
    """Plano/dibujo técnico. Antes se recortan los bordes blancos: muchas fotos
    verticales vienen con franjas blancas de relleno y contaban como papel."""
    im = Image.open(p).convert("RGB"); im.thumbnail((400, 400))
    diff = ImageChops.difference(im, Image.new("RGB", im.size, (255, 255, 255))).convert("L").point(lambda v: 255 if v > 12 else 0)
    bb = diff.getbbox()
    if bb:
        im = im.crop(bb)
    im.thumbnail((200, 200))
    px = list(im.getdata()); n = len(px)
    blanco = sum(1 for r, g, b in px if r >= 245 and g >= 245 and b >= 245) / n
    sat = sum(max(c) - min(c) for c in px) / n
    return blanco > 0.5 and sat < 30

def valida(p):
    try:
        im = Image.open(p); im.verify()
        return min(Image.open(p).size) >= 300
    except Exception:
        return False

# Portadas: las MISMAS que usa Amay (petición de Pablo, 2026-09-24).
#  - ficha que es una promoción entera -> la imagen de su tarjeta en /promociones/
#  - ficha de un modelo o vivienda     -> la primera foto de esa vivienda en Amay
#    (es la que Amay usa como miniatura: thumbnails/<id>_lg.jpg = primera foto)
PORTADA_PROMO = {
    # sacado de <a href="/promociones/ID/..."><img src=...> (la imagen va DENTRO del enlace)
    "329": "/media/images/news/o_1iglvavi1s2b1um8o14iq1jfl13.png",
    "308": "/media/images/news/o_1ikch2sv51iih10b11mfo1l1rq0915.jpg",
    "297": "/media/images/news/o_1hn0rmud21rdc1tnk1aqd1uln9g3c.png",
    "292": "/media/images/news/o_1hm6tftqs1ul81es21uf613dpo95c.png",
    "276": "/media/images/news/o_1hfts78ki1ulul1s140c8hf487n.png",
    "265": "/media/images/news/o_1h3f65fo4jf81kl2h92sqq1te8i.jpg",
    "194": "/media/images/news/o_1gbapggm044e7vrgc4phpa7se.jpg",
}
FICHA_PROMO = {"residencial-moma-ii", "residencial-waldorf-astoria", "residencial-kasia-v", "marquesado-de-molins",
               "villas-del-mar-ii-la-manga", "balcones-de-vivi", "villas-pinoso-el-valle-de-hondon"}

def asegura(src):
    """Descarga la imagen de Amay si aún no está en raw/img."""
    p = local(src)
    if not os.path.exists(p):
        import urllib.request
        req = urllib.request.Request("https://amayproperties.com" + src, headers={"User-Agent": "Mozilla/5.0"})
        open(p, "wb").write(urllib.request.urlopen(req, timeout=60).read())
    return p

hechos = []
os.makedirs(OUT, exist_ok=True)
for slug, name, typ, zone, prov, pid, refs, extra in F:
    promo = P.get(pid) if pid else None
    units = [U[r] for r in refs]
    # fuentes de foto: primero las de la vivienda (modelo concreto), después las de la promoción
    fuentes = [s for u in units for s in u["imgs"]]
    # La "promoción" 124 (Llave en mano) es un cajón de viviendas de edificios
    # distintos: sus fotos genéricas son de otros residenciales y no deben entrar.
    if pid == "124":
        promo_fotos = False
    elif promo and (extra.get("sin_unidades") or typ == "apartamento"):
        promo_fotos = True
    else:
        promo_fotos = False
    if promo_fotos:
        fuentes = promo["imgs"] + fuentes
    elif promo and not fuentes and pid != "124":
        fuentes = promo["imgs"]
    vistos_md5, vistos_ah, fotos, planos = set(), [], [], []
    for s in fuentes:
        p = local(s)
        if not os.path.exists(p) or not valida(p):
            continue
        h = md5(p)
        if h in vistos_md5:
            continue
        vistos_md5.add(h)
        a = ahash(p)
        if any(sum(i != j for i, j in zip(a, b)) <= 6 for b in vistos_ah):
            continue  # la misma foto a otro tamaño o recomprimida
        vistos_ah.append(a)
        (planos if es_plano(p) else fotos).append(p)
    # portada de Amay en primera posición (y fuera su duplicado del resto)
    if slug in FICHA_PROMO:
        portada = asegura(PORTADA_PROMO[pid])
    elif units and units[0]["imgs"]:
        portada = asegura(units[0]["imgs"][0])
    else:
        portada = None
    if portada:
        pa = ahash(portada)
        fotos = [portada] + [f for f in fotos if f != portada and sum(i != j for i, j in zip(ahash(f), pa)) > 6]
        planos = [f for f in planos if f != portada]
    d = os.path.join(OUT, slug)
    if os.path.isdir(d):
        shutil.rmtree(d)
    os.makedirs(d)
    for i, p in enumerate(fotos[:MAX_FOTOS]):
        Image.open(p).convert("RGB").save(os.path.join(d, f"{i+1:02d}.jpg"), quality=92)
    if planos:
        Image.open(planos[0]).convert("RGB").save(os.path.join(d, "plano.jpg"), quality=92)

    def fnum(v):
        m = re.search(r"[\d.,]+", v or "")
        return float(m.group().replace(".", "").replace(",", ".")) if m else None

    uds = []
    for u in sorted(units, key=lambda x: x["price"] or 0):
        f = u["features"]
        uds.append({
            "ref_amay": u["ref"], "titulo_amay": u["title"], "precio": u["price"], "precio_desde": u["price_from"],
            "dormitorios": fnum(f.get("Habitaciones")), "banos": fnum(f.get("Baños")), "aseos": fnum(f.get("Aseos")),
            "m2_construidos": fnum(f.get("Construidos")), "m2_parcela": fnum(f.get("Parcela")),
            "planta": f.get("Piso"), "estado": f.get("Estado"), "orientacion": f.get("Orientación"),
            "piscina": f.get("Piscina"), "garaje": f.get("Garaje"), "plazas_garaje": f.get("Plazas de garaje"),
            "cocina": f.get("Cocinas"), "balcon": f.get("Balcón"), "anio": f.get("Año de construcción"),
            "dist_playa": f.get("Distancia a la playa"), "dist_aeropuerto": f.get("Distancia al aereopuerto"),
            "dist_golf": f.get("Distancia al campo de golf"), "dist_ocio": f.get("Distancia a ocio"),
            "energia": f.get("Calificación energética"), "extras": u["extras"], "etiquetas": u["labels"],
            "descripcion_amay": u["description"], "lat": u["lat"], "lng": u["lng"], "videos": u["videos"],
        })
    precios = [x["precio"] for x in uds if x["precio"]]
    geo = next(((x["lat"], x["lng"]) for x in uds if x["lat"]), (promo or {}).get("lat") and (promo["lat"], promo["lng"]) or (None, None))
    videos = [v for x in uds for v in x["videos"]] + ((promo or {}).get("videos") or [])
    hechos.append({
        "slug": slug, "name": name, "type": typ, "zone": zone, "province": prov,
        "ready": bool(extra.get("ready")), "sin_unidades": bool(extra.get("sin_unidades")),
        "promocion_amay": promo and {"nombre": promo["name"], "descripcion": promo["description"], "piloto": promo["piloto"]},
        "unidades": uds,
        "precio_min": min(precios) if precios else None, "precio_max": max(precios) if precios else None,
        "lat": geo[0], "lng": geo[1], "video": videos[0] if videos else None,
        "fotos": len(fotos[:MAX_FOTOS]), "fotos_descartadas_por_limite": max(0, len(fotos) - MAX_FOTOS),
        "planos_detectados": len(planos),
    })
    print(f"{slug:48} uds {len(uds):2}  fotos {len(fotos[:MAX_FOTOS]):2}  planos {len(planos)}  {hechos[-1]['precio_min']}-{hechos[-1]['precio_max']}")

json.dump(hechos, open(os.path.join(OUT, "hechos.json"), "w", encoding="utf8"), ensure_ascii=False, indent=1)
print(f"\n{len(hechos)} fichas · {sum(len(h['unidades']) for h in hechos)} viviendas · {sum(h['fotos'] for h in hechos)} fotos")
