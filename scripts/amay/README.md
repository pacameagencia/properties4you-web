# Catálogo Amay Properties → Properties4You

Importa todas las viviendas de https://amayproperties.com a la web. Primera
carga: 2026-09-24 (100 viviendas publicadas por Amay → 97 distintas → 31 fichas).

## Criterio de agrupación (decidido con Pablo)

- **Villas:** una ficha por modelo (cada modelo trae sus propias fotos).
- **Residenciales de pisos:** una ficha por residencial; cada unidad va como línea
  `Ref … · planta · dorm. · m² · precio` en las características, generada por
  código desde los datos de Amay (nunca por el redactor).
- **Llave en mano sueltas:** una ficha cada una.
- **Portada:** la MISMA que usa Amay (tarjeta de la promoción o primera foto de la
  vivienda). No se recrea.

## Pasos (carpeta de trabajo fuera del repo, p. ej. `Downloads/p4y-amay`)

```bash
node scrape-amay.mjs                 # raw/promos.json, raw/units.json, raw/img/ (~320 MB)
python build-lote.py                 # lote/hechos.json + lote/<slug>/NN.jpg (+ plano.jpg)
PROVEEDOR=gemini node --env-file=<.env con GEMINI_API_KEY> gen-textos.mjs   # lote/textos/
node revisa-textos.mjs               # vetadas, contacto del promotor, cifras
node arma-casas.mjs                  # lote/casas.json
node scripts/ingest-casas.mjs <carpeta>/lote --dry-run
node scripts/ingest-casas.mjs <carpeta>/lote --solo=<slug>   # de una en una: el lote entero pasa de 10 min
```

`gen-textos.mjs` admite `PROVEEDOR=anthropic|openai|gemini`. El 2026-09-24 las
cuentas de Anthropic y OpenAI de la agencia estaban sin saldo; se usó Gemini Flash.

## Trampas vistas

- La paginación de `/propiedades/` va por sesión: sin la cookie siempre devuelve la página 1.
- La "promoción" 124 *Llave en Mano* es un cajón de viviendas de edificios distintos:
  sus fotos genéricas no valen para ninguna ficha.
- Muchas fotos verticales vienen con franjas blancas de relleno: el detector de
  planos recorta el borde blanco antes de medir.
- En `/promociones/` la imagen de cada tarjeta va DENTRO de su `<a>`; leer la
  siguiente imagen tras el enlace da la de la tarjeta de al lado.
- Datos de Amay a vigilar: MC-17 (Monte Carmelo) publica 227 m² construidos, sus
  gemelas tienen 122 m² + 227 m² de parcela.
- Tras subir, si el catálogo no muestra todas: `docker compose build --no-cache`
  en el VPS (la caché de Docker reutiliza el SSG de la compilación anterior).
