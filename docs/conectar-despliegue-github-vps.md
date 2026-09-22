# Publicar desde el chat mediante GitHub Actions

Estado: preparado en la PR #4, todavía sin activar ni probar contra el VPS.
El chat gestiona el código y las integraciones en master mediante GitHub;
GitHub Actions ejecuta el despliegue por SSH al VPS de Hostinger.
El ordenador personal no necesita permanecer encendido después de configurar
la conexión. Esto permite publicar esta web, no administrar todo el VPS.

## Configuración inicial por el propietario

En https://github.com/pacameagencia/properties4you-web/settings/secrets/actions
crear estos **repository secrets** (nunca archivos del repositorio ni mensajes):

| Nombre | Contenido |
| --- | --- |
| `VPS_SSH_PRIVATE_KEY` | Clave privada SSH autorizada para root en el VPS, sin contraseña interactiva. Preferiblemente una clave dedicada a este despliegue. La clave local existente es `~/.ssh/pacame_vps_srv1921063`; no subir el archivo `.pub` como clave privada. |
| `VPS_SSH_KNOWN_HOSTS` | Identidad pública del servidor, obtenida a través de la conexión SSH ya verificada. |

Para obtener el segundo valor desde Git Bash en el PC que ya tiene conexión:

```bash
ssh -i ~/.ssh/pacame_vps_srv1921063 root@195.200.15.103 "awk '{print \"195.200.15.103 \" \$1 \" \" \$2}' /etc/ssh/ssh_host_ed25519_key.pub"
```

Copiar la línea resultante `195.200.15.103 ssh-ed25519 ...` en
`VPS_SSH_KNOWN_HOSTS`. Es la clave pública del servidor, no la credencial privada.
No sustituir esto por aceptar automáticamente una identidad nueva desde el runner.
Si el servidor cambia de identidad, comprobarlo antes de actualizar el secreto.

Después crear la **repository variable** `VPS_DEPLOY_ENABLED` con valor `true`
en Settings → Secrets and variables → Actions → Variables.
Mantenerla ausente o en `false` hasta que ambos secretos estén configurados.
El conector GitHub de este chat no permite gestionar secretos ni administración
del repositorio; esta configuración requiere al propietario.

## Funcionamiento

- Al integrar cambios en `master`, el workflow `Deploy to Hostinger VPS` ejecuta
  instalación, tests, lint y build. Solo después entrega la clave al job de despliegue.
- Las ramas de trabajo y las pull requests no despliegan en producción.
- Existe también ejecución manual desde Actions, únicamente para `master`.
- Se usa `/opt/properties4you/.env` en el servidor: las credenciales de Supabase,
  correo y traducción no se copian a GitHub.
- El despliegue comprueba `/es` dentro del VPS y la URL HTTPS pública.
- El flujo Netlify queda como ejecución manual de la copia antigua.
- Si se han configurado reglas de aprobación en el environment `production-vps`,
  GitHub las aplica antes de publicar.

## Primer despliegue y límites

Integrar la PR y verificar el resultado en Actions. Hasta que ese primer flujo
termine correctamente no está comprobada la conexión GitHub → VPS: el firewall,
los permisos SSH o la capacidad del servidor pueden impedirla aunque el PC conecte.
El conector puede consultar los resultados y los logs desde el chat.

La publicación reconstruye y sustituye el contenedor existente. Puede haber una
breve interrupción; no implementa rollback automático. Si falla, revisar el job
antes de repetir. Para volver a una versión anterior, revertir el cambio en master
y desplegar el commit de reversión. No modifica registros ni imágenes de Supabase.

La configuración inicial no completa por sí sola la revisión del cliente:
siguen pendientes la prueba autenticada del panel, la correspondencia real de
las fotografías y los datos legales/dirección que debe aportar el propietario.

Referencia: https://docs.github.com/en/actions/how-tos/write-workflows/choose-what-workflows-do/use-secrets
