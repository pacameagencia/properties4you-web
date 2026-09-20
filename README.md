# Properties4You · Costa Blanca

Web inmobiliaria de obra nueva en la Costa Blanca. Catálogo multiidioma (ES/DE/NL/EN)
con panel de administración para que el cliente suba y gestione sus propiedades.

## Stack

- **Next.js 16** (App Router, RSC, Server Actions) + **React 19** + **TypeScript strict**
- **TailwindCSS v4** — sistema de diseño oscuro/premium (Cormorant Garamond + Inter)
- **Supabase** — Postgres + RLS + Auth + Storage (proyecto `njlbbvkdkuavbayqcszp`)
- **Framer Motion / Lenis** — scroll suave y reveals
- **Anthropic (Opus)** — autotraducción ES → DE/NL/EN al guardar
- **Vercel** — despliegue

## Estructura

```
app/
  [lang]/                 → web pública (es | de | nl | en)
    page.tsx              → home (hero, destacadas, destino, CTA)
    propiedades/          → catálogo con filtros
    propiedad/[slug]/     → ficha completa + galería + mapa
    nosotros/             → sobre + contacto
  admin/
    login/                → acceso panel (Supabase Auth)
    (panel)/              → dashboard + alta/edición de propiedades
  actions.ts              → server actions (guardar, borrar, publicar, autotraducir)
lib/
  supabase/               → clientes browser / server / admin
  i18n/                   → config + diccionarios de UI (4 idiomas)
  queries.ts, types.ts, utils.ts, translate.ts
components/site · components/admin
middleware.ts             → refresco de sesión + enrutado de idioma + guard admin
```

## Modelo de datos

Tabla `properties` con campos estructurados (precio, dormitorios, baños, m², tipo,
certificado energético, ubicación) + `translations` JSONB (`{es,de,nl,en}` con
`description` y `features`) + `gallery` JSONB. RLS: lectura pública de publicadas,
escritura solo para `app_admins`. Bucket `properties` (público) para imágenes.

## Variables de entorno (`.env.local`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=      # solo scripts server-side
ANTHROPIC_API_KEY=              # autotraducción (sin key: copia el español)
ANTHROPIC_MODEL=claude-opus-4-8
```

## Desarrollo

```bash
npm install
npm run dev      # http://localhost:3000
npm run build
```

## Ingesta de promociones en lote

Para cargar varias promociones de golpe (fotos + ficha en 5 idiomas), en vez de
meterlas una a una por el panel:

```bash
export P4Y_SUPABASE_URL="https://<ref>.supabase.co"
export P4Y_SERVICE_KEY="<service_role>"        # nunca en el código: el repo es público
npm i -D sharp                                  # opcional, redimensiona las fotos

node scripts/ingest-casas.mjs <carpeta> --dry-run   # valida sin subir nada
node scripts/ingest-casas.mjs <carpeta>             # sube
node scripts/ingest-casas.mjs <carpeta> --solo=slug # una sola ficha
```

La carpeta lleva un `casas.json` (array de fichas — hay una de ejemplo comentada
al final del script) y una subcarpeta de fotos por cada `slug`.

Valida las fichas **antes** de subir un solo byte, con las mismas reglas que
`scripts/audit-data.mjs` comprueba después: o entra la tanda entera, o no entra
nada. Es idempotente, así que reingestar un slug reemplaza sus fotos y su ficha.

Las fichas salen vivas en producción sin desplegar (Supabase + ISR). Lo único
que pide deploy es una **zona nueva**: hay que añadirla a `lib/zones.ts`.

## Panel admin

`/admin` → login con email + contraseña (usuario en `app_admins`). Desde ahí se
crea/edita cada propiedad con todos los campos de la ficha, se suben imágenes
(portada + galería) y al guardar se traduce automáticamente a los 4 idiomas.

---

PACAME · [pacameagencia.com](https://pacameagencia.com)
