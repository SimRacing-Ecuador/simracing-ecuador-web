# Sim Racing Ecuador: indexación y medición, 5 de noviembre de 2026

## Estado y alcance de la evidencia

La web pública es https://simracingec.com/. El código actual procede de GitHub `main` en `73c30b31c4c63272371dd3b0fb644c8ceaa92606`; la copia original de Desktop estaba en `81c3326` y se conserva intacta. Los cambios de esta revisión se preparan en `codex/search-measurement-completion`.

**Hay tres estados distintos:** código preparado, archivos publicados y ajustes guardados en Google. Una etiqueta HTML no demuestra titularidad vigente, un ID no demuestra recepción y un sitemap accesible no demuestra indexación. La evidencia histórica del 29 de octubre está en `auditoria-2026-10-29.md`; no se presenta como observación nueva.

| Integración | Identificador o URL real | Evidencia disponible |
|---|---|---|
| GA4 | Propiedad `561497036`, flujo `16231880754`, ID `G-Q6H1XX68P2` | ID publicado y código con consentimiento; recepción controlada documentada el 29 de octubre |
| Cuenta administrativa de Analytics | `406621799` | Registro anterior; no implica mezclar datos con otras propiedades |
| Search Console | `https://simracingec.com/` | Token HTML propio publicado; verificación, portada indexada y sitemap de diez URLs documentados el 29 de octubre |
| Sitemap | `https://simracingec.com/sitemap.xml` | XML accesible, diez canónicas; se amplía con nueve relaciones página/imagen |
| Robots | `https://simracingec.com/robots.txt` | Permite rastreo general y señala el sitemap |
| Hosting | Cloudflare Pages conectado al repositorio existente | HTTP público y documentación del despliegue anterior |
| Vínculo GA4 / Search Console | Mismas propiedades de esta tabla | Pendiente de observar/guardar en la consola actual |

## Comprobación pública de hoy

Los resultados HTTP de la línea base, antes de publicar los cambios de hoy, están en `http-before-2026-11-05.json`. Los tres archivos modificados todavía no coincidían con la copia local en esa captura; eso no es una prueba de despliegue fallido. Se hicieron peticiones HTTP sin ejecutar JavaScript: no se generaron visitas de prueba en Analytics.

- Diez páginas canónicas responden 200, con contenido HTML, una canónica exacta y permiso de indexación. Incluyen portada, catálogo, siete fichas y privacidad.
- Las diez cargan las tres piezas locales de medición: configuración, catálogo y cliente de consentimiento. No se añade una segunda etiqueta.
- Nueve recursos de imagen comprobados responden 200. Los archivos de medición, robots y sitemap también responden 200.
- Dos rutas desconocidas, en raíz y anidada, responden 404: no son portadas con un falso estado 200.
- HTTP redirige con 301 a HTTPS. `/index.html` redirige con 308 a `/`; `.html` redirige con 308 a la URL limpia.
- La política CSP enviada por el servidor coincide con la del documento. No se detecta `X-Robots-Tag: noindex` en las canónicas de producción.
- **Pendiente real:** `https://www.simracingec.com/moza-r3?utm_source=google` sigue respondiendo 200 sin redirigir al host raíz. Declara la canónica correcta, pero conviene resolver el duplicado en Cloudflare. El cliente GA4 excluye `www`, así que una visita que permanezca ahí tampoco se mide.

Esta auditoría no obtiene posiciones, clics orgánicos, estado de propiedad, Core Web Vitals de campo ni informes privados. No se sustituyen esos datos por los de Racing Hobbies.

## Cambios de esta revisión

### Descubrimiento de imágenes

El generador añade el namespace oficial de imágenes al sitemap existente y una imagen real para portada, catálogo y cada ficha: nueve relaciones, diez páginas y ocho imágenes distintas en esas relaciones. No incluye el logo de privacidad, los 121 fotogramas como páginas, etiquetas de imagen obsoletas ni fechas ficticias.

El generador exige que cada imagen exista y aparezca en un `img` de su página. Las pruebas separan `loc` de páginas y `image:loc`, comprueban la relación con el inventario y mantienen las diez canónicas. El sitemap facilita el descubrimiento; no garantiza indexación o posición en Google Imágenes.

Referencia: [sitemaps de imágenes de Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps).

### Atribución desde asistentes de IA

La medición conserva únicamente el origen HTTPS de seis referentes aprobados: `chatgpt.com`, `www.perplexity.ai`, `perplexity.ai`, `claude.ai`, `gemini.google.com` y `copilot.microsoft.com`. Descarta la ruta de conversación, consulta y fragmento. Rechaza dominios parecidos, protocolos distintos y puertos no aprobados.

También se admiten como valores de campaña los cinco dominios de los servicios sin `www`. Cuando un enlace llegue con `utm_source=chatgpt.com&utm_medium=referral`, esos dos valores pueden conservarse sin admitir otros parámetros personales. Se mantiene la lista controlada existente para campañas de Google y redes sociales. No se añaden UTM a enlaces internos.

La atribución requiere consentimiento y que el origen proporcione referente o UTM aprobado. Una visita desde una app que no envíe ninguno puede seguir apareciendo como directa. Este cambio mide referencias observables; no demuestra que un sistema haya recomendado la web, ni fuerza recomendaciones futuras.

## Completar la vinculación en las cuentas existentes

1. Entrar con una cuenta que sea **propietaria verificada de Search Console** y tenga **Editor o Administrador en GA4**. Seleccionar explícitamente la propiedad `561497036` de Sim Racing Ecuador.
2. En Administrar → Vinculaciones con otros productos → Vinculaciones con Search Console, comprobar si ya existe un vínculo antes de crear otro.
3. Si no existe: Vincular → elegir `https://simracingec.com/` → confirmar → elegir el flujo web `16231880754` → revisar → enviar. No seleccionar una propiedad de Racing Hobbies u otra empresa.
4. Volver a la tabla y comprobar el sitio y flujo guardados. Registrar la fecha de observación; no basta con abrir el formulario.
5. En Informes → Biblioteca, publicar la colección de Search Console si no está publicada. Revisar consultas y páginas de destino de búsqueda orgánica cuando los datos estén disponibles.
6. Conservar Search Console como referencia de impresiones, clics y consultas. GA4 mide visitas y acciones consentidas; las cifras no tienen por qué coincidir.

Referencia: [conectar Search Console a Analytics](https://support.google.com/analytics/answer/10737381?hl=es).

## Ajustes de GA4 que se deben observar y registrar

El sitio no tiene carrito, cobro, formulario o confirmación de ventas. Añadir eventos indiscriminadamente produciría datos engañosos.

| Evento existente | Para qué sirve | Interpretación correcta |
|---|---|---|
| `page_view` | Entrada y navegación real | Vista de página consentida |
| `view_item_list` | Equipo visible en catálogo | Exposición al producto |
| `select_item` | Apertura de ficha desde catálogo | Interés por el equipo |
| `view_item` | Visita de una ficha | Consulta de producto; `value` es el precio publicado, no ingreso |
| `whatsapp_click` | Clic para abrir WhatsApp | Intención de contacto; no prueba mensaje, lead o venta |
| `phone_call_click` | Clic en teléfono | Intención de llamada; no prueba conversación |
| `scroll` | Primera llegada al 90 % | Lectura aproximada; una vez por vista |

### Propiedad y datos

- Mantener zona `America/Guayaquil`, moneda USD y flujo de `https://simracingec.com`. El huso del propietario del ordenador no sustituye el del negocio.
- Comprobar las funciones de medición mejorada: evitar duplicar `page_view`, scroll, clics salientes, búsquedas y formularios que el código controla o que no existen. No afirmar reproducción de vídeo medida solo porque haya un iframe.
- Mantener publicidad, personalización y Google Signals desactivados salvo decisión específica del propietario. No son necesarios para SEO o la vinculación con Search Console.
- El registro previo indica conservación de eventos de 14 meses y reinicio por actividad desactivado. Verificar antes de cambiar y conservar el registro anterior.
- Comprobar ocultación de emails/parámetros sensibles y ausencia de etiquetas conectadas ajenas. Los parámetros de URL emitidos por el cliente ya se limitan por inventario/lista aprobada.
- Tráfico interno: definir únicamente IPs reales del equipo y probar el filtro en modo de prueba antes de activarlo. No activar filtros con datos inventados o eliminar históricos.
- Depuración: usarla temporalmente, distinguir la visita de prueba y desactivarla al acabar. No convertir localhost ni previews en tráfico comercial.
- Revisar atribución y referencias no deseadas; no excluir Google, redes o IA para ocultar su origen. No hay multidominio ni pasarela de pago que justifique configurarlos.

### Dimensiones y eventos clave

Registrar una sola dimensión personalizada de evento para `cta_location`, con nombre «Ubicación del CTA», si aún no existe. El código emite valores acotados de cabecera, pie o sección. Revisar los valores reales antes de ampliar. No registrar de nuevo dimensiones estándar como título, moneda, nombre del producto o fuente.

El registro narrativo anterior documenta `whatsapp_click` y `phone_call_click` como microconversiones; el JSON de ajustes todavía los enumera como pendientes. Resolver la discrepancia mirando la consola. Si están configurados, conservarlos; si falta alguno, marcarlo como evento clave sin importe monetario predeterminado. No crear `purchase` o `generate_lead` a partir de un simple clic.

Referencia: [dimensiones y métricas personalizadas](https://support.google.com/analytics/answer/14240153?hl=es). Google indica que la disponibilidad en informes puede tardar 24–48 horas; registrar una dimensión no prueba que ya se reciban sus valores.

### Informes útiles para este catálogo

| Informe o exploración | Dimensiones | Métricas / lectura |
|---|---|---|
| Adquisición | Fuente/medio de sesión, página de destino | Sesiones, interacción, acciones de contacto |
| Catálogo | Nombre e ID del artículo, categoría | Vistas de lista, selecciones, vistas de ficha |
| Consultas de contacto | Evento, página, Ubicación del CTA | Recuentos de WhatsApp y teléfono separados |
| Mercado | País, categoría de dispositivo, destino | Ecuador y móvil frente al resto, sin datos de personas |
| Búsqueda orgánica vinculada | Consulta y página | Clics, impresiones, CTR, posición contextualizada |
| Referencias de IA | Fuente/medio de sesión | Visitas y contactos con referente o UTM observable |

Para agrupar IA, crear un **grupo de canales personalizado separado** del predeterminado, si resulta útil. Canal «Asistentes IA», antes de Referral: fuente de sesión coincide con `^(www\.)?(chatgpt\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|copilot\.microsoft\.com)$`. Revisar filas reales antes de aplicar. La agrupación no crea tráfico ni reconstruye referencias ausentes.

Comparar ventanas completas de 28 y 90 días, país y dispositivo, separando marca/sin marca. No inventar una línea base cuando falte historial. `view_item.value` no debe sumarse como ventas.

## Search Console: comprobaciones de cierre

- Confirmar propiedad de prefijo exacta y titularidad en Ajustes → Verificación de la propiedad. Conservar el token actual mientras siga siendo necesario.
- Verificar que el sitemap existente sigue en «Correcto» y consultar última lectura. Como la URL no cambia, no borrarlo ni reenviarlo repetidamente para intentar acelerar posiciones.
- Inspeccionar portada, catálogo y una ficha representativa; comparar canónica declarada/seleccionada, disponibilidad para Google y rastreo móvil. Solicitar indexación una vez para cambios relevantes; la solicitud no garantiza inclusión.
- Revisar Páginas para distinguir noindex, duplicados, alternativa canónica, redirecciones, descubierta/no indexada y rastreada/no indexada. Las redirecciones `.html` y la exclusión de 404 son esperadas.
- Revisar Acciones manuales, Problemas de seguridad, HTTPS y Core Web Vitals. «Sin datos» no equivale a aprobado ni a suspendido.
- Mantener informes por país Ecuador, dispositivo y página. La posición media depende de consulta, lugar y periodo; no es una clasificación universal.
- Una propiedad de Dominio `simracingec.com` cubriría protocolos/subdominios, pero requiere verificación DNS y permisos del dominio. Mantener el prefijo ya existente; no inventar un TXT ni duplicar propiedades sin comprobar.

Referencia: [verificar la titularidad](https://support.google.com/webmasters/answer/9008080?hl=es).

## Cloudflare y presencia local pendientes

**Host preferido:** en la zona correcta de Cloudflare, configurar una redirección permanente del host exacto `www.simracingec.com` a `https://simracingec.com`, conservando ruta y consulta. Verificar certificado de `www`, raíz, una ficha y parámetros. No redirigir otros negocios, no crear bucles ni intentar una regla por dominio en `_redirects`, que no la soporta.

**Perfil de Empresa:** el registro anterior encontró la ficha pública propia y cero negocios administrados en esa sesión. Para añadir la web en Maps y mantener dirección/horario hace falta gestionar esa ficha legítima. No reclamar otra empresa ni crear duplicados. Confirmar antes stock, envíos, garantías, devoluciones y horarios.

**Merchant Center/Product:** siguen pendientes condiciones y disponibilidad comercial verificadas. Se conservan ItemPage y precios visibles, sin reseñas, estrellas, GTIN, SKU, stock, envío o políticas inventadas. Evaluar Product/Offer con los requisitos oficiales y la realidad comercial al contar con esos datos; no equivale a crear campañas de pago.

**Bing/otros buscadores:** robots permite rastreo general. Una alta en Bing Webmaster Tools necesita su cuenta y verificación; no enviar claves inventadas de IndexNow ni tratar Google Indexing API como una API general para estas fichas.

## Alcance real frente a Google y agentes de IA

La base técnica ya ofrece texto HTML, enlaces internos, identidad comercial, canónicas, sitemap, imágenes accesibles y contexto de producto. Es útil tanto para buscadores como para lectores automáticos. Los contenidos futuros deberían responder preguntas reales de clientes sobre plataforma, par Direct Drive, ergonomía, espacio, pedales y selección de equipos en Ecuador, con autor y evidencia cuando corresponda.

Google no exige un archivo de IA especial para aparecer en sus funciones generativas. No se añaden instrucciones ocultas para agentes, páginas duplicadas por ciudad ni enlaces artificiales. Ninguna configuración garantiza el primer puesto para carreras, autos, competición o cualquier otra consulta amplia.

Referencia: [funciones de IA y tu sitio de Google Search Central](https://developers.google.com/search/docs/appearance/ai-features).

## Verificación, publicación y reversión

Pruebas de esta revisión: `python3 tests/verify_page.py`, `python3 tests/security_audit.py`, `python3 tools/generate_seo.py --check`, `python3 tests/verify_seo.py`, `node tests/verify_analytics.js`, `node tests/verify_advice_navigation.js`. Se observaron primero los fallos de referente de IA perdido y ausencia de imagen en sitemap; las correcciones hicieron pasar la suite completa.

Las pruebas de analítica usan un contexto simulado sin red. No prueban recepción actual en Google. No se crean tareas recurrentes ni anuncios. La publicación se comprueba de nuevo después de integrar la PR y se entrega un informe separado con la evidencia del despliegue. Los cambios de consola se registran únicamente después de observarlos guardados.

En la sesión actual se pudo leer Search Console autenticado mostrando Racing Hobbies. Al intentar abrir el selector se perdió el control del ordenador: Chrome y Safari devuelven `timeoutReached`, también después de reiniciar la sesión de control. No se confirmó una ausencia de Sim Racing, ni se alteró la propiedad ajena. Se solicitó dejar el Mac desbloqueado para reanudar la comprobación directa.

Reversión de código: revertir el commit de esta revisión mediante PR o volver al despliegue anterior de Cloudflare. No borrar propiedades de Google, verificación, datos o historial como forma de reversión.


## Corrección de caché detectada al publicar

La PR [#20](https://github.com/SimRacing-Ecuador/simracing-ecuador-web/pull/20) se integró en `e00b21c66a85967f4996a7a33a54dee188d37528`, con CI y Cloudflare correctos. La comprobación HTTP posterior encontró el sitemap nuevo, pero dos scripts antiguos: respuestas `cf-cache-status: HIT`, `Age` de aproximadamente 1000 segundos y `Cache-Control: max-age=14400` en el dominio público. Las mismas rutas con una consulta de versión devolvieron exactamente los bytes nuevos. No se confundió el estado de despliegue con los bytes que recibía el visitante.

Para resolverlo, el generador incorpora un hash SHA-256 abreviado a las URLs de configuración, catálogo y cliente de medición en las diez páginas. Calcula el hash del catálogo que va a escribir, de modo que basta una generación. Conserva el orden y `defer`, sin cargar Google antes del consentimiento. Una prueba falló primero por falta de versión; la suite y una prueba aislada de cambios simultáneos de inventario/configuración pasan tras la corrección. La comprobación final debe verificar las URLs versionadas que aparecen en el HTML, además del sitemap y las páginas.
