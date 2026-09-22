#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# Despliega Properties4You al VPS de PACAME (Docker + Caddy) en un comando.
# Ejecutar DESDE el PC (Git Bash), con la clave SSH del VPS:
#
#   bash deploy/vps-deploy.sh            # despliega HEAD
#   bash deploy/vps-deploy.sh <ref>      # despliega un commit/tag concreto
#
# Qué hace:
#   1. git archive del ref (solo lo commiteado: sin node_modules, .next ni .env)
#   2. lo sube a /opt/properties4you/src en el VPS
#   3. copia deploy/compose.yml a /opt/properties4you/compose.yml
#   4. docker compose up -d --build   (build EN el VPS, imagen standalone)
#   5. comprueba en local del VPS que /es responde 200
#
# Requisitos en el VPS (una sola vez): /opt/properties4you/.env con
#   NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY,
#   SUPABASE_SERVICE_ROLE_KEY, ANTHROPIC_API_KEY, ANTHROPIC_MODEL
# y el bloque de Caddy (ver deploy/README.md).
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

VPS_HOST="${VPS_HOST:-195.200.15.103}"
VPS_USER="${VPS_USER:-root}"
SSH_KEY="${SSH_KEY:-$HOME/.ssh/pacame_vps_srv1921063}"
REMOTE_DIR="/opt/properties4you"
REF="${1:-HEAD}"
APP_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SSH_OPTIONS=(-i "$SSH_KEY" -o "StrictHostKeyChecking=${SSH_STRICT_HOST_KEY_CHECKING:-accept-new}" -o BatchMode=yes -o ConnectTimeout=15 -o IdentitiesOnly=yes)
SSH=(ssh "${SSH_OPTIONS[@]}" "$VPS_USER@$VPS_HOST")

cd "$APP_DIR"
SHA="$(git rev-parse --verify "$REF^{commit}")"
# Verify the existing server configuration before replacing any source files.
"${SSH[@]}" "test -f $REMOTE_DIR/.env && command -v docker >/dev/null && docker compose version >/dev/null"
echo "▶ 1/5  Empaquetando $REF ($SHA)…"
TGZ="$(mktemp -t p4y-XXXX.tgz)"
trap 'rm -f "$TGZ"' EXIT
git archive --format=tar.gz -o "$TGZ" "$SHA"

echo "▶ 2/5  Subiendo fuentes a $REMOTE_DIR/src…"
"${SSH[@]}" "mkdir -p $REMOTE_DIR/src && find $REMOTE_DIR/src -mindepth 1 -delete && tar xzf - -C $REMOTE_DIR/src" < "$TGZ"
rm -f "$TGZ"

echo "▶ 3/5  compose.yml…"
# Take compose.yml from the same commit as the archived application.
git show "$SHA:deploy/compose.yml" | "${SSH[@]}" "cat > $REMOTE_DIR/compose.yml"

echo "▶ 4/5  Build + arranque en el VPS (tarda unos minutos)…"
"${SSH[@]}" "test -f $REMOTE_DIR/.env || { echo '✗ falta $REMOTE_DIR/.env en el VPS'; exit 1; }
  cd $REMOTE_DIR && docker compose up -d --build --remove-orphans"

echo "▶ 5/5  Comprobación local en el VPS…"
"${SSH[@]}" "for i in 1 2 3 4 5 6; do
  code=\$(curl -s -o /dev/null -w '%{http_code}' -m 10 http://127.0.0.1:3200/es || true)
  [ \"\$code\" = 200 ] && { echo $SHA > $REMOTE_DIR/DEPLOYED_SHA; echo \"✓ 127.0.0.1:3200/es → 200 (sha $SHA)\"; exit 0; }
  sleep 5; done; echo \"✗ el contenedor no responde 200 (último: \$code)\"; docker compose -f $REMOTE_DIR/compose.yml logs --tail=40 web; exit 1"

echo "✅ Desplegado. Comprueba desde fuera: https://properties4you.es/es"
