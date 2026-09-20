# Despliegue en el VPS de PACAME

Desde el 2026-09-16 la web vive en el VPS de PACAME (`195.200.15.103`), en Docker
detrás de Caddy. Netlify (`properties4you.netlify.app`) queda como copia antigua.

## Piezas

| Pieza | Dónde |
|---|---|
| Fuentes desplegadas | `/opt/properties4you/src` (git archive del commit, sin `.env`) |
| Variables | `/opt/properties4you/.env` (`chmod 600`, fuera del repo) |
| Compose | `/opt/properties4you/compose.yml` (copia de `deploy/compose.yml`) |
| Contenedor | `properties4you` → `127.0.0.1:3200` (Next standalone, 768 MB tope) |
| TLS + proxy | Caddy: `properties4you.es` → `127.0.0.1:3200`; `www` redirige al apex |
| Commit desplegado | `/opt/properties4you/DEPLOYED_SHA` |

## Desplegar

```bash
bash deploy/vps-deploy.sh          # HEAD
bash deploy/vps-deploy.sh v1.2.0   # un ref concreto
```

El script hace `git archive`, así que **solo se despliega lo commiteado**.

## Bloque de Caddy (`/etc/caddy/Caddyfile`)

```
# Properties4You (cliente Capa 2, Next.js en Docker, puerto 3200)
properties4you.es {
	reverse_proxy 127.0.0.1:3200
}
www.properties4you.es {
	redir https://properties4you.es{uri} permanent
}
```

Después: `caddy validate --config /etc/caddy/Caddyfile && systemctl reload caddy`.
El certificado lo emite Caddy solo cuando el DNS apunta al VPS.

## Variables (`/opt/properties4you/.env`)

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
ANTHROPIC_API_KEY=
ANTHROPIC_MODEL=
# Formularios por correo (lib/mail.ts): buzón Hostinger del cliente
SMTP_HOST=smtp.hostinger.com
SMTP_PORT=465
SMTP_USER=info@properties4you.es
SMTP_PASS_B64=            # contraseña en base64 (lleva caracteres que un .env no maneja bien)
CONTACT_TO=info@properties4you.es
```

Las dos `NEXT_PUBLIC_*` se hornean en el build (compose las pasa como `build.args`
leyéndolas del mismo `.env`); si cambian, hay que reconstruir.

## Comprobar que sigue vivo

```bash
ssh root@195.200.15.103 'docker ps --filter name=properties4you --format "{{.Status}}"; curl -s -o /dev/null -w "%{http_code}\n" http://127.0.0.1:3200/es'
curl -s -o /dev/null -w "%{http_code}\n" https://properties4you.es/es
```
