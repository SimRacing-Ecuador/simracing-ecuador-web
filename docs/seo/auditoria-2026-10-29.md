# Sim Racing Ecuador — auditoría, implementación y registro

Fecha: 29 de octubre de 2026. Mercado: Ecuador, español; ciudad comercial verificada: Quito. Objetivo del sitio: consultas de equipamiento por WhatsApp y teléfono. El catálogo no tiene carrito, cobro, formularios ni confirmación de ventas.

Este registro diferencia trabajo local, publicación y cambios guardados en Google. El estado se actualiza tras cada verificación; un script local no demuestra recepción en Analytics ni indexación.

## Identidad y referencia anterior

- Dominio preferido: https://simracingec.com/. Alojamiento: Cloudflare Pages, proyecto `simracing-ecuador-web`, integrado con GitHub.
- Repositorio: https://github.com/SimRacing-Ecuador/simracing-ecuador-web. Rama de trabajo: `br/seo-medicion-sitename`.
- Referencia anterior: commit `e28396b0f60d4e131a542d5e20b8efec80bc4ac8`. La copia de partida local se actualizó desde ese commit antes de editar; no había cambios locales del usuario.
- Copia de reversión adicional en esta sesión: `/tmp/simracing-before-seo-e28396b.tar`. La referencia duradera es Git; `/tmp` puede limpiarse.
- Nombre del sitio solicitado: **Sim Racing Ecuador**. Variante real de nombre: **SimRacing Ecuador**, contrastada en Maps con el mismo teléfono de la web.
- Dirección comercial pública: Av. Eloy Alfaro 40-348, 170513 Quito, Ecuador. Teléfono: +593 98 901 9836. Ver `local-business-verified.json`.
- El enlace anterior de Maps llevaba a Racing Hobbies. Se sustituyó por la ficha propia de SimRacing Ecuador. No se reutilizan sus identificadores, reseñas, horarios ni datos de medición.
- Google Business Profile muestra categoría pública «Comercio» y no muestra web. La administración privada se consultó con autorización: la cuenta actual muestra cero negocios administrados. No se ha reclamado ni creado una ficha duplicada.

## Matriz de trabajo

Todos los cambios locales de esta tabla están fechados el 29-10-2026.

| Tarea | Estado | Valor anterior → nuevo | Evidencia | Pendiente |
|---|---|---|---|---|
| HTTPS | Ya existente y comprobado públicamente | HTTP → HTTPS con 301 | `http-before-2026-10-29.json` | Mantener |
| Host preferido | Pendiente de administración | `www` devolvía 200 y duplicaba el sitio → objetivo 301 hacia raíz conservando ruta y consulta | Línea base HTTP | Sesión autorizada sin permiso sobre la cuenta del proyecto; las reglas de dominio no se soportan en `_redirects` de Pages |
| Nombre del sitio | Implementado sin publicar | Solo Organization y `og:site_name` en portada → WebSite con nombre de marca, variante real, URL raíz y editor Store | `tools/generate_seo.py`, `index.html` | Publicar, validar y esperar la elección de Google; no se garantiza el nombre mostrado |
| Metadatos | Implementado sin publicar | Portada completa y fichas incompletas → títulos/descripciones únicos, canónicas, Open Graph, tarjetas e idioma | `seo-pages.json`, `tests/verify_seo.py` | Publicación |
| URLs canónicas | Implementado sin publicar | Solo portada → raíz y nueve rutas sin extensión | Cloudflare ya responde 308 de `.html` a ruta limpia; sitemap y datos estructurados coherentes | Publicación |
| Navegación y rastreo | Implementado sin publicar | Enlaces de catálogo HTML existentes → migas visibles y BreadcrumbList; corregido ancla inexistente del catálogo | Prueba de enlaces y fragmentos | Publicación |
| Sitemap y robots | Implementado sin publicar | Ambos devolvían HTML de portada con 200 → XML de diez URLs canónicas y robots de texto | `sitemap.xml`, `robots.txt`, generador idempotente | Publicar y enviar en Search Console |
| Errores 404 | Implementado sin publicar | Cualquier ruta desconocida devolvía portada con 200 → 404.html propio y noindex | Línea base HTTP, página 404 con recursos absolutos | Comprobar respuesta 404 pública tras despliegue |
| Datos estructurados | Implementado sin publicar | Organization solo en portada → WebSite, Store, WebPage/CollectionPage, BreadcrumbList y siete Product | JSON analizado, inventario local | Validador externo y prueba pública |
| Product/Offer | Implementado sin publicar / parcialmente no aplicable | Sin marcado → Product con nombre, imagen, descripción y marca conocida | Siete fichas y catálogo existente | No se añaden Offer, stock, SKU, GTIN ni reseñas sin evidencia. Sin promesa de resultados enriquecidos |
| Información local | Implementado sin publicar | Enlace a otra empresa → ficha propia y dirección pública contrastada | `local-business-verified.json`; footer de todas las páginas; cuenta de Google Business con cero empresas administradas | Reconciliar horarios de Maps con atención con cita; propiedad de la ficha |
| Contenidos comerciales | Implementado sin publicar | Introducción genérica → catálogo y portada explícitos sobre equipos y mercado, guía breve para plataforma/espacio/conjunto | Contenido visible, precios originales conservados | El negocio debe confirmar disponibilidad, entrega, garantías y devoluciones |
| Consentimiento | Implementado y probado localmente | Inexistente → aceptar/rechazar/cambiar preferencias, seis meses, rechazo por defecto y retirada | `analytics.js`, `tests/verify_analytics.js`, vista local | Verificar en producción con ID real |
| GA4 | Configurado y guardado en Google; implementación local | Ningún ID encontrado en el código → propiedad propia, flujo web e ID G-Q6H1XX68P2 | `measurement-config.js`; propiedad 561497036, flujo 16231880754, ID real G-Q6H1XX68P2 | Publicación, ajustes restantes y recepción real |
| Search Console | Preparado en Google; sin verificar | No figuraba Sim Racing en selector actual → propiedad de prefijo iniciada y token propio obtenido | Meta de verificación de portada emitida para https://simracingec.com/ | Publicar etiqueta, verificar, enviar sitemap, inspecciones e informes |
| Vínculo GA4 / Search Console | Pendiente | Sin vínculo comprobado → objetivo mismo sitio y flujo | Plan de configuración | Requiere ambas propiedades y permisos; no se tocaron vínculos ajenos |
| Imágenes | Implementado y probado localmente | Siete originales de cockpit sumaban 16.995.804 bytes → copias de 640 suman 225.490 bytes; selección responsive | `responsive-images.json`; originales nativos retenidos | Publicar y medir transferencia real por pantalla; no equivale a mejora medida de LCP |
| Rendimiento | Parcialmente comprobado | Poster principal con prioridad, fuentes locales y dimensiones ya existentes → prioridad explícita de poster, copias adaptables y caché de fuentes/secuencia | Código y pruebas locales | API PageSpeed devolvió 429 en móvil y escritorio; faltan métricas de laboratorio y datos de campo de esta propiedad |
| Seguridad | Implementado y probado localmente | CSP solo local → tres orígenes exactos de GA permitidos en script/connect/img según necesidad | Meta y `_headers` idénticos; auditoría de seguridad | Comprobar cabeceras efectivas en producción; sin `unsafe-inline`, eval ni comodines de origen |
| YouTube | Implementado y probado localmente | Iframes automáticos → carga al pulsar un botón que identifica el servicio externo, sin referente | Fichas de trípode y G29 | Comprobar reproducción pública; no se afirma medición de reproducción |
| Merchant Center | Pendiente de datos / no listo para alta | Catálogo de consulta; sin stock fiable, entrega ni devoluciones publicadas | Revisión del sitio | Validar requisitos comerciales antes de feed o fichas gratuitas; no anuncios |
| Bing / IndexNow | Pendiente / opcional | Sin acceso de Bing contrastado | No se han inventado claves ni enviado URLs | Importación de Search Console tras verificar, si hay cuenta. IndexNow solo para cambios reales y motores compatibles |

## Plan de medición adaptado a esta empresa

Integración prevista: gtag.js directo, una sola propiedad y un flujo de esta empresa. No GTM ni medición entre empresas. El código excluye localhost, puertos de prueba, dominios de preview, www y rutas desconocidas de la propiedad comercial. El ID se copia del flujo web; nunca se construye a partir de su número.

| Evento | Disparador y parámetros | Significado | Evento clave |
|---|---|---|---|
| `page_view` | Carga real o restauración desde caché de navegación; página canónica y título de inventario | Vista, una por navegación; aceptar tarde mide la página actual | No |
| `view_item_list` | Producto del catálogo entra en pantalla después de aceptar; lista de categoría e items sin repetir por vista | Exposición al equipo | No |
| `select_item` | Enlace de ficha en catálogo; categoría e item | Selección desde lista | No |
| `view_item` | Ficha actual, también al aceptar tarde; item, USD y precio publicado | Consulta de producto | No |
| `whatsapp_click` | Enlace WhatsApp, método fijo y `cta_location`; nunca URL/mensaje/teléfono del enlace | Intención de contacto, sin confirmar mensaje ni lead | Propuesto como microconversión; pendiente de guardar en GA4 |
| `phone_call_click` | Enlace de llamada, método fijo y `cta_location` | Intención de llamada, sin confirmar conversación | Propuesto como microconversión; pendiente de guardar en GA4 |
| `scroll` | Primera llegada al 90 % tras aceptar | Lectura aproximada de una página; una vez por vista | No |

No aplicables al funcionamiento actual: search, carrito, checkout, contact_form_submit, generate_lead, purchase y refund. No hay un sistema que confirme leads cualificados, pedidos, cobros o devoluciones. Si se añade, la medición exige confirmación fiable y deduplicación por identificador de transacción.

Solo se propone una dimensión propia: **Ubicación de CTA**, ámbito evento, parámetro `cta_location`. Los eventos ya separan métodos de contacto y los parámetros estándar no requieren duplicarse. No se crea User-ID ni se recogen datos aportados por usuarios.

Valores deseados en GA4, **todavía no guardados**:

- Propiedad `Sim Racing Ecuador`, URL https://simracingec.com/, Ecuador, America/Guayaquil y USD. Sector seleccionado: Juegos. Tamaño de 1 a 10 confirmado por el propietario.
- `send_page_view:false`, vistas explícitas; Google Signals y personalización desactivados. Publicidad denegada siempre.
- Medición mejorada: desactivar historial, clics salientes, búsquedas y formularios automáticos para evitar duplicidad y captura de texto. Scroll explícito en código: desactivar scroll automático. No hay descargas de archivos publicadas. Los iframes actuales no usan la API de YouTube; no se afirma medición automática de vídeo.
- Conservación: revisar necesidad de 14 meses y coherencia con privacidad antes de guardar; documentar valor realmente elegido. Sin eliminación de históricos.
- Revisar ocultación de emails/consultas, etiquetas conectadas, permisos, exclusiones de referencias, sesión, atribución y ventanas. Sin multidominio, Ads, BigQuery o Signals por defecto.
- Tráfico interno: no inventar IPs. Definir y probar un filtro antes de activarlo. Depuración: temporal, controlada y documentada; no medición comercial de localhost.

## Privacidad, atribución y límites comprobados

Consentimiento básico antes de cargar Google: `analytics_storage`, `ad_storage`, `ad_user_data` y `ad_personalization` denegados inicialmente. Solo analítica pasa a granted al aceptar. No se reproducen clics anteriores. La elección se guarda en localStorage con fallback de sesión; si ambos fallan se conserva en memoria mientras el documento siga abierto. Retirar bloquea la etiqueta, vacía la cola, elimina cookies accesibles y recarga cuando es posible persistir el rechazo. La retirada no borra datos históricos de Google.

Las URLs enviadas provienen del inventario. Se descartan fragmentos, texto libre y parámetros arbitrarios. Solo sobreviven los cinco UTM estándar cuando su valor figura en `campaignValues` de `measurement-config.js`. Esta lista controlada evita depender de una expresión regular para detectar datos personales. Para una campaña nueva, aprobar y añadir sus valores no personales antes de lanzarla. Los valores admitidos se conservan en sesión entre páginas y no se añaden UTM a enlaces internos. Referentes internos se reducen a páginas conocidas y los externos a orígenes aprobados sin rutas.

La prueba automática utiliza `G-TESTONLY` exclusivamente en un contexto simulado sin red; ese valor no se escribe en la configuración pública ni se envía a Google. Prueba rechazo, aceptación tardía, una vista, retirada, BFCache, hosts de prueba, cookies de raíz/subdominios, datos sensibles y precios reales. Esto no sustituye una comprobación de recepción en Tiempo real/DebugView.

## Intenciones y contenidos

Se contrastaron resultados públicos del sector: volantes MOZA, bases Direct Drive, Logitech y cockpits para Ecuador. No hay datos de Search Console propios todavía y no se atribuyen volúmenes ni posiciones a estas hipótesis.

| Página | Intención prioritaria |
|---|---|
| `/` | Marca y equipamiento de simracing en Ecuador |
| `/productos` | Comparar volantes, pedales, bases, kits y cockpits |
| `/cockpit-con-silla` | Cockpit plegable con silla, características y consulta |
| `/simulador-tripode` | Soporte plegable sin silla y dimensiones |
| `/moza-r3` | MOZA R3 para PC/Xbox |
| `/moza-r5` | Base MOZA R5 para PC |
| `/moza-r9-kit`, `/moza-r12-kit` | Kit completo con base, CS V2P y CRP2 |
| `/logitech-g29` | Logitech G29 para PlayStation/PC |

No se crearon páginas de ciudades repetidas, reseñas, garantías, relaciones entre empresas ni ofertas ficticias. Se conservan las URLs útiles; los filtros y la búsqueda interna no existen en esta versión. El contenido principal ya llega en HTML inicial.

## Mantenimiento y reversión

1. Actualizar contenido comprobado y `seo-pages.json` conjuntamente. Ejecutar `python3 tools/generate_seo.py`; revisar HTML, canónicas, catálogo de medición y sitemap.
2. Validar `python3 tests/verify_page.py`, `python3 tests/security_audit.py`, `python3 tools/generate_seo.py --check`, `python3 tests/verify_seo.py`, `node tests/verify_analytics.js` y `node tests/verify_advice_navigation.js`.
3. Publicar mediante PR y la integración existente de Cloudflare Pages. Comprobar que la versión publicada corresponde al commit y que las diez URLs, XML, robots y un error 404 devuelven lo esperado. Los previews deben llevar noindex y nunca figurar en el sitemap de producción.
4. Mantener el token de titularidad mientras esa propiedad siga en uso. No rotar ni copiar IDs de otras empresas. Si se cambian precios, stock o imágenes, repetir verificación semántica.
5. Para revertir, usar `git revert` de los commits de este trabajo mediante una PR nueva, o el despliegue anterior desde el historial de Cloudflare. No hacer reset forzado de la rama compartida. Los ajustes de Google se revierten por separado según los valores anteriores registrados; nunca borrar propiedades o históricos como reversión.

## Seguimiento, sin automatizaciones creadas

- 7 días desde publicación: rastreo, sitemap leído, canónicas seleccionadas por Google, errores de cobertura y recepción de eventos.
- 28 días: comparar 28 días completos de marca/sin marca, países, dispositivos, páginas, clics, impresiones, CTR, posición contextualizada y acciones de contacto consentidas.
- 90 días: comparar periodos equivalentes de 90 días, estacionalidad y contenido comercial. Separar microconversiones de contactos confirmados y ventas.

La línea base de 28/90 días de esta empresa no está disponible aún en las propiedades preparadas. No se sustituyen sus datos por los de Racing Hobbies. La colección de Search Console en GA4 requiere un vínculo válido y publicación de los informes; los datos pueden tardar en procesarse y no se espera igualdad exacta entre clics y sesiones.

## Referencias oficiales consultadas

- [Nombre del sitio y WebSite](https://developers.google.com/search/docs/appearance/site-names).
- [SEO y expectativas](https://developers.google.com/search/docs/fundamentals/do-i-need-seo?hl=es).
- [Medición mejorada](https://support.google.com/analytics/answer/9216061?hl=es).
- [Eventos de GA4](https://developers.google.com/analytics/devguides/collection/ga4/reference/events).
- [Consentimiento básico](https://developers.google.com/tag-platform/security/guides/consent).
- [CSP y etiquetas](https://developers.google.com/tag-platform/security/guides/csp).
- [Vinculación Search Console / GA4](https://support.google.com/analytics/answer/10737381?hl=es-do).
- [Sitemaps](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- [Inspección de URLs](https://support.google.com/webmasters/answer/9012289/).
- [Datos estructurados](https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data?hl=es).
- [Tipos admitidos por Indexing API](https://developers.google.com/search/apis/indexing-api/v3/using-api): no se utiliza para estas páginas comerciales.
- [IndexNow](https://www.indexnow.org/documentation).
- [Rutas y 404 de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).
- [Redirecciones de Pages y sus límites](https://developers.cloudflare.com/pages/configuration/redirects/).
