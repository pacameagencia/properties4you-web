# Revisión de Properties4You — 21 de septiembre de 2026

Estado: **no se puede dar por cerrado ni certificar que todo funciona en producción**. Esta rama prepara correcciones comprobables. No modifica las viviendas de la base de datos, no envía correos de prueba y no despliega el VPS del dominio principal.

Base revisada: `master` en `0a9df5f6120c0c7a5415247fbfbbd35eebc0f3cb`, incluida la PR #3. Fuentes: código, navegación de `https://properties4you.es`, consultas de lectura a Supabase y comprobación de medios públicos. Se encontraron 15 viviendas publicadas. La interfaz pública está en cinco idiomas.

## Peticiones del cliente

| Petición | Evidencia encontrada | Estado de esta revisión |
|---|---|---|
| Colabora con nosotros y comisión del 5 % | Página `/es/colabora`, navegación y CTA destacado en inicio; equivalentes en cinco idiomas | Presente. El texto comercial definitivo sigue pendiente del cliente |
| Fotografías correctas por vivienda | Seis grupos de imágenes idénticas compartidos por promociones diferentes; comprobación SHA-256 de 15 archivos | Problema confirmado. Requiere originales y asignación autorizada; no se han adivinado ni cambiado galerías |
| Consultas por correo de la agencia | Acciones de visita/contacto/colaboración ya usaban SMTP; acceso rápido aún abría WhatsApp | Se elimina ese acceso personal y se corrigen errores de validación, red y registro de leads. Recepción SMTP real pendiente |
| Cookies y privacidad | Banner y documentos existentes; mapa condicionado al consentimiento | Se añade reapertura/revocación desde el pie, bloqueo del vídeo externo y consentimiento explícito en la galería. Identificación legal pendiente |
| Eliminar testimonios ficticios | Sección retirada del inicio | Presente en el código revisado |
| Eliminar Alert me | CTA retirado | Presente en el código revisado |
| Dirección real | Solo localidad y código postal, también en los datos legales | Pendiente del titular. No se inventa una dirección ni una sociedad |
| Talk to us | Enlace a `/es/nosotros#contacto` comprobado navegando | Corregido previamente; formulario reforzado en esta rama |
| Key ready / In development | Tarjetas usan `ready_now`; lateral de la ficha aún mostraba En venta | Se iguala el lateral. El cliente debe confirmar la fase real de cada promoción; ninguna tenía `ready_now` en la consulta |
| Compartir en Facebook | Enlace real con URL canónica codificada | Estructura comprobada; publicación dentro de una cuenta de Facebook no probada. WhatsApp de compartir sigue disponible como compartir, sin destinatario personal |
| Fecha en móvil | Etiqueta persistente de fecha preferida de visita y altura mínima ya presentes | No es un campo de nacimiento. Validación de fecha real añadida; revisión física en iPhone pendiente |
| Alta manual de viviendas | Cuenta administradora confirmada, RLS en tablas y escritura de medios restringida a admin; acceso sin sesión redirige al login | Se corrigen fallos del panel. El recorrido autenticado completo aún necesita una sesión real |

## Correcciones del panel

- Los cambios de precio/fotos conservan traducciones existentes. Se valida la respuesta del traductor y se informa de los fallos; no se copian textos españoles fingiendo traducirlos.
- Se pueden escribir manualmente los cuatro idiomas adicionales. Las fichas nuevas empiezan en borrador; publicar requiere portada y descripciones en cinco idiomas.
- Se aceptan decimales para precios y superficies; dormitorios/baños deben ser enteros y los importes no negativos.
- Conflictos entre sesiones se detectan mediante `updated_at` antes de sobrescribir.
- Carga de imágenes con progreso, rechazo explicativo de tipo/tamaño, errores por archivo y conservación de subidas correctas. Guardado bloqueado mientras sube; portada, eliminación y orden accesibles sin hover.
- Los nuevos planos deben ser imágenes compatibles (JPG/PNG/WebP/AVIF). Los PDF existentes quedan enlazados; no se intenta dibujarlos como imagen.
- Confirmaciones de publicación/ocultación/borrado en diálogo; errores visibles. Cancelar y enlaces avisan de cambios sin guardar; recarga/cierre usan la protección del navegador. No hay recuperación automática al usar el historial atrás.
- Login con etiquetas vinculadas, autocompletado y errores de conexión. Cuenta autenticada sin rol recibe una pantalla de acceso restringido.
- Revalidación del catálogo, detalle, favoritos y sitemap. Cambiar datos de contacto invalida los layouts públicos. Se diferencia error de lectura y catálogo vacío.

## Formularios y privacidad técnica

El límite del registro de leads es de 2.000 caracteres; antes el formulario aceptaba 3.000 y no inspeccionaba el error devuelto por Supabase. La validación nueva incluye los datos de agencia en el límite. Si falla el registro, no se anuncia éxito ni se continúa enviando correo. Si falla SMTP tras registrar, el lead sigue en el panel y se muestra el correo alternativo. Un reintento tras fallo SMTP puede crear otro lead; no se ha añadido una cola ni idempotencia persistente.

El consentimiento de la galería antes se enviaba como `true` sin casilla. Ahora se solicita al visitante y el envío queda bloqueado hasta aceptarlo. Los iframes de mapas y vídeos no se montan sin permiso; «Configurar cookies» permite retirarlo y sincroniza cambios entre pestañas. Esto no borra cookies ya instaladas por terceros; la política también explica la eliminación desde el navegador.

La revisión toma como referencia técnica la [Guía sobre el uso de las cookies de la AEPD](https://www.aepd.es/guias/guia-cookies.pdf). No constituye una validación jurídica. `lib/legal.ts` mantiene nombre del titular, identificación fiscal y otros datos sin completar; ocultar marcadores pendientes no completa esos requisitos. Los datos exactos y la revisión jurídica deben facilitarlos los responsables.

## Evidencia de fotografías

[duplicate-media-evidence.json](duplicate-media-evidence.json) contiene SHA-256 y tamaño de cada archivo descargado. Los seis grupos fueron idénticos byte por byte:

| Grupo | Rutas dentro del bucket público `properties` |
|---|---|
| 1 | `alba-salinas-2/07.webp`, `apartamentos-saito/00.webp`, `esence-i/06.webp` |
| 2 | `apartamentos-saito/07.webp`, `esence-i/00.webp`, `esence-iii/06.webp` |
| 3 | `esence-i/07.webp`, `esence-iii/00.webp`, `villas-catalina/06.webp` |
| 4 | `alba-salinas-2/00.webp`, `apartamentos-saito/06.webp` |
| 5 | `alba-salinas-2/06.webp`, `thiar-village-v/00.webp` |
| 6 | `thiar-village-v/06.webp`, `villas-catalina/00.webp` |

La consulta de metadatos también detectó seis grupos compartidos entre Lo Marabú 3 y Lo Marabú Bungalows. Pueden pertenecer al mismo conjunto/promoción; compartirlos no demuestra por sí solo un error. La autenticidad, disponibilidad y asignación de todas las fotos no se puede demostrar con el repositorio. Hace falta el material original identificado por promoción.

## Verificación

- `npm test`: 10 pruebas correctas (validación de borrador/publicación, decimales, versión de edición, conservación/fallo de traducción, idiomas manuales, archivos, consentimiento, límites y fechas).
- `npm run lint`: correcto después de reparar también dos errores previos de efectos React.
- `npx tsc --noEmit`: correcto.
- `npm run build`: compilación de producción correcta, 143 páginas generadas. Aviso previo de migración `middleware` → `proxy`; no bloquea este build.
- Auditoría estática de UI en modo estricto: 0 hallazgos. Resultado en [ui-audit.json](ui-audit.json); no sustituye pruebas reales.
- Lint de DESIGN.md: 0 errores y 3 avisos de tokens documentados sin referencia en el frontmatter; el CSS sigue siendo canónico.
- Navegador sobre producción: colaboración, contacto, ficha, enlace de Facebook, banner/rechazo y redirección de admin sin sesión comprobados.
- Navegador sobre el servidor local: el entorno bloqueó esa URL. No se presenta como prueba visual de la versión modificada.

## Pendiente para aceptación y publicación

1. Identificar fotografías, fase y disponibilidad por promoción; aportar copia final del programa de agencias, dirección completa y datos del titular.
2. Iniciar sesión real en admin mediante un canal seguro; comprobar crear borrador, subir/ordenar/escoger portada, guardar, reabrir, editar, publicar/ocultar y limpiar la prueba. No se han creado credenciales ni modificado permisos para simular el acceso.
3. Autorizar un envío de prueba y confirmar su recepción en `info@properties4you.es`; SMTP no se acredita por compilar el código.
4. Desplegar la revisión aprobada al VPS que sirve el dominio principal y repetir el recorrido, incluida fecha en móvil. El acceso SSH de ese VPS no está disponible en esta sesión. Las integraciones del repositorio con Netlify/Vercel no acreditan un despliegue en el VPS.

## Conservación del diseño

Se ha documentado el sistema visual existente en `DESIGN.md` y el comportamiento en `UX-CONTRACT.md`. No se cambia la identidad aprobada por el cliente. Ajustes duraderos: acciones de imágenes visibles en móvil, errores y estados persistentes, diálogos de confirmación con foco y controles de consentimiento accesibles.


## Seguimiento — 22 de septiembre de 2026

El usuario ha solicitado completar la entrega. La PR #4 sigue siendo la revisión vigente; `master` conserva la versión anterior.

- Se añade una comprobación automática en GitHub para las pruebas, ESLint y el build con TypeScript, sin credenciales de administrador ni de correo.
- Se corrige la recuperación de un borrador solo en español: al guardar de nuevo se reintentan los idiomas ausentes aunque no haya cambiado el texto. Un fallo de ese reintento conserva las traducciones parciales existentes. Las pruebas pasan de 10 a 12.
- Se añade [la guía del panel](guia-panel.md), identificada como correspondiente a la versión pendiente de despliegue.
- El estado de despliegue de Vercel del commit inicial de esta PR es **failure**. La conexión disponible devuelve **403 Forbidden / Not authorized** para el proyecto del equipo `pacames-projects`; no ha sido posible leer la causa del build. El check «Vercel Preview Comments» sí aparece verde, pero solo comprueba comentarios, no el despliegue.
- No hay clave SSH del VPS en esta sesión ni un conector VPS operativo. El conector disponible de Hostinger AI Builder no administra ese servidor. No se han sustituido credenciales ni intentado eludir el acceso.

La entrega continúa bloqueada por acceso al servidor, diagnóstico del despliegue fallido, sesión administradora y los datos/fotos originales indicados arriba. No se ha fusionado ni desplegado una revisión presentando como correctas comprobaciones que no se pueden realizar.
