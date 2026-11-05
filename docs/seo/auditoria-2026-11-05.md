# Sim Racing Ecuador: indexación y medición, 5 de noviembre de 2026

## Estado y alcance de la evidencia

La web pública es https://simracingec.com/. Las mejoras de sitemap y atribución se publicaron en la PR #20; la corrección de caché, en la PR #21 (`ecdd6c4`). La PR #22 (`0f2f8ad`) añadió orientación al catálogo y conservó la evidencia HTTP anterior. La copia original de Desktop en `81c3326`, con imágenes modificadas por el propietario, se conserva intacta. Esta actualización documental parte de `0f2f8ad`.

**Hay tres estados distintos:** código preparado, archivos publicados y ajustes guardados en Google. Una etiqueta HTML no demuestra titularidad vigente, un ID no demuestra recepción y un sitemap accesible no demuestra indexación. La evidencia histórica del 29 de octubre está en `auditoria-2026-10-29.md`; no se presenta como observación nueva.

| Integración | Identificador o URL real | Evidencia disponible |
|---|---|---|
| GA4 | Propiedad `561497036`, flujo `16231880754`, ID `G-Q6H1XX68P2` | Flujo exacto observado en la cuenta; tráfico reciente y solicitud normal de recopilación con respuesta HTTP 204 comprobados hoy |
| Cuenta administrativa de Analytics | `406621799` | Registro anterior; no implica mezclar datos con otras propiedades |
| Search Console | `https://simracingec.com/` | «Propietario verificado» observado hoy; portada y catálogo indexados; sitemap «Correcto» con diez páginas descubiertas |
| Sitemap | `https://simracingec.com/sitemap.xml` | XML accesible, diez canónicas; se amplía con nueve relaciones página/imagen |
| Robots | `https://simracingec.com/robots.txt` | Permite rastreo general y señala el sitemap |
| Hosting | Cloudflare Pages conectado al repositorio existente | HTTP público y documentación del despliegue anterior |
| Vínculo GA4 / Search Console | Mismas propiedades de esta tabla | Creado el 5 de noviembre, con confirmación del propietario; éxito y asociación comprobados desde ambos productos |
| IA generativa en la Búsqueda | Misma propiedad de Search Console | «Incluir» guardado explícitamente hoy, sin heredar otro ajuste; no garantiza aparición |

## Comprobación pública de hoy

Los resultados HTTP de la línea base, antes de publicar los cambios de hoy, están en `http-before-2026-11-05.json`. Los tres archivos modificados todavía no coincidían con la copia local en esa captura; eso no es una prueba de despliegue fallido. Se hicieron peticiones HTTP sin ejecutar JavaScript: no se generaron visitas de prueba en Analytics.

La comprobación posterior a las consolas está en `http-after-console-2026-11-05.json`: las diez páginas, nueve recursos de imagen, scripts versionados, robots y sitemap responden correctamente y coinciden byte a byte con `0f2f8ad`. Las rutas desconocidas conservan 404 y las redirecciones de protocolo/extensión siguen operativas. El archivo público solo contiene HTTP público; las observaciones privadas de consola se guardan aparte.

- Diez páginas canónicas responden 200, con contenido HTML, una canónica exacta y permiso de indexación. Incluyen portada, catálogo, siete fichas y privacidad.
- Las diez cargan las tres piezas locales de medición: configuración, catálogo y cliente de consentimiento. No se añade una segunda etiqueta.
- Nueve recursos de imagen comprobados responden 200. Los archivos de medición, robots y sitemap también responden 200.
- Dos rutas desconocidas, en raíz y anidada, responden 404: no son portadas con un falso estado 200.
- HTTP redirige con 301 a HTTPS. `/index.html` redirige con 308 a `/`; `.html` redirige con 308 a la URL limpia.
- La política CSP enviada por el servidor coincide con la del documento. No se detecta `X-Robots-Tag: noindex` en las canónicas de producción.
- **Pendiente real:** `https://www.simracingec.com/moza-r3?utm_source=google` sigue respondiendo 200 sin redirigir al host raíz. Declara la canónica correcta, pero conviene resolver el duplicado en Cloudflare. El cliente GA4 excluye `www`, así que una visita que permanezca ahí tampoco se mide.

La comprobación de cuentas se realizó después de recuperar el control nativo de Chrome. Solo se utiliza la propiedad de Sim Racing Ecuador. Los resultados de otras empresas no se mezclan con esta auditoría. Las visitas controladas de validación no se interpretan como demanda comercial.

## Cambios de esta revisión

### Descubrimiento de imágenes

El generador añade el namespace oficial de imágenes al sitemap existente y una imagen real para portada, catálogo y cada ficha: nueve relaciones, diez páginas y ocho imágenes distintas en esas relaciones. No incluye el logo de privacidad, los 121 fotogramas como páginas, etiquetas de imagen obsoletas ni fechas ficticias.

El generador exige que cada imagen exista y aparezca en un `img` de su página. Las pruebas separan `loc` de páginas y `image:loc`, comprueban la relación con el inventario y mantienen las diez canónicas. El sitemap facilita el descubrimiento; no garantiza indexación o posición en Google Imágenes.

Referencia: [sitemaps de imágenes de Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps).

### Atribución desde asistentes de IA

La medición conserva únicamente el origen HTTPS de seis referentes aprobados: `chatgpt.com`, `www.perplexity.ai`, `perplexity.ai`, `claude.ai`, `gemini.google.com` y `copilot.microsoft.com`. Descarta la ruta de conversación, consulta y fragmento. Rechaza dominios parecidos, protocolos distintos y puertos no aprobados.

También se admiten como valores de campaña los cinco dominios de los servicios sin `www`. Cuando un enlace llegue con `utm_source=chatgpt.com&utm_medium=referral`, esos dos valores pueden conservarse sin admitir otros parámetros personales. Se mantiene la lista controlada existente para campañas de Google y redes sociales. No se añaden UTM a enlaces internos.

La atribución requiere consentimiento y que el origen proporcione referente o UTM aprobado. Una visita desde una app que no envíe ninguno puede seguir apareciendo como directa. Este cambio mide referencias observables; no demuestra que un sistema haya recomendado la web, ni fuerza recomendaciones futuras.

## Vinculación guardada y comprobada

La tabla de vinculaciones de GA4 inicialmente estaba vacía. Tras la confirmación expresa del propietario se envió el vínculo entre `https://simracingec.com/` y «Sim Racing Ecuador — Web» (`16231880754`) de la propiedad `561497036`. Google mostró **«Vinculación creada correctamente»**. Se comprobó la fila persistida y, de forma independiente, la asociación Google Analytics GA4 en Search Console. No quedaron solicitudes de asociación pendientes.

La colección de Search Console ya estaba **«Publicada para todos»** en la Biblioteca de GA4. Los informes de Consultas y Tráfico de búsqueda orgánica de Google están visibles; no se creó una colección duplicada. La disponibilidad del vínculo no prueba que los informes ya tengan datos nuevos. Search Console sigue siendo la referencia para impresiones, clics y consultas; GA4 mide visitas y acciones consentidas, por lo que sus cifras pueden diferir.

Referencia: [conectar Search Console a Analytics](https://support.google.com/analytics/answer/10737381?hl=es).

## Ajustes de GA4 observados hoy

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

Se volvieron a observar el flujo, el ID de medición y el indicador de tráfico en las últimas 48 horas. La configuración histórica de negocio es Ecuador, `America/Guayaquil`, USD; no se sustituyó por el huso del ordenador.

| Ajuste de la cuenta | Estado observado / acción |
|---|---|
| Conservación de eventos y usuarios | 14 meses; reinicio por actividad desactivado |
| Google Signals | Sin activar |
| Datos proporcionados por usuarios | Sin activar |
| Ubicación/dispositivo granular | Activado previamente; conservado |
| Personalización publicitaria de la propiedad | Permiso regional existente, sin cambios; el cliente deniega los tres consentimientos publicitarios |
| Filtro Internal Traffic | Excluir, en modo **Testing**; sin activar exclusiones nuevas ni inventar IPs |
| Ocultación de datos | Emails activa y 19 claves sensibles de consulta configuradas |
| Etiquetas de sitios conectados | Cero |
| Medición mejorada | Carga de página activa; historial, scroll, salientes, búsquedas y formularios desactivados; vídeo compatible y descargas activos |
| Sesión e interacción | 30 minutos de inactividad y umbral de 10 segundos; conservados |
| Referencias no deseadas / multidominio | Sin reglas configuradas; no se añadieron otros negocios ni pasarelas inexistentes |
| Recopilación Universal Analytics | Desactivada |

La opción de vídeo compatible no demuestra recepción de eventos de los iframes actuales. La lista de ajustes regionales publicitarios no equivale a consentimiento del visitante. La señal del cliente sigue denegando publicidad.

Para mantenimiento: conservar la zona y moneda del negocio; evitar duplicar eventos manuales con medición mejorada; probar cualquier filtro con IPs reales antes de activarlo. No excluir Google, redes o IA de referencias para ocultar su origen. La depuración es temporal; localhost y previews siguen excluidos de la propiedad comercial.

### Consentimiento y recepción real

En una navegación normal de producción se verificaron los estados mediante DevTools nativo, sin extraer cookies ni publicar identificadores de cliente:

1. Por defecto, `analytics_storage`, `ad_storage`, `ad_user_data` y `ad_personalization` están denegados. El cliente de Google solo se carga tras aceptar Analytics.
2. Tras aceptar, `analytics_storage` pasa a `granted`; las tres señales publicitarias permanecen `denied`. Se observó el cliente para `G-Q6H1XX68P2`, cookie analítica presente y eventos `page_view` y `view_item`.
3. Una solicitud normal a `region1.google-analytics.com/g/collect` del ID correcto respondió **204 No Content** en la pestaña Network. La señal `gcs=G101` y `npa=1` era coherente con analítica permitida y publicidad denegada. No se conserva la consulta completa ni los identificadores personales del tráfico.
4. Al retirar el consentimiento desde las preferencias, el sitio recargó: elección `rejected`, sin cliente de Google, sin cookie analítica y **cero solicitudes de Analytics** en esa carga. La prueba quedó con Analytics rechazado y sin depuración persistente.

**Limitación abierta:** la calidad de la etiqueta en Google todavía muestra **«Urgente»**, con diagnóstico de 0 % de consentimiento/señales denegadas. La prueba real anterior no se presenta como eliminación de esa alerta ni demuestra por sí sola cómo la calcula Google. Tag Assistant independiente no consiguió conectarse con las protecciones actuales; se detuvo la sesión sin relajar CSP/COOP ni conceder publicidad para ocultar el aviso. No se probaron contactos o compras ficticios.

Referencias: [diagnóstico de consentimiento](https://support.google.com/tagmanager/answer/14522438?hl=en), [verificación de Consent Mode](https://developers.google.com/tag-platform/security/guides/consent-debugging).

### Dimensiones y eventos clave

La definición **«Ubicación de CTA»**, ámbito Evento y parámetro `cta_location`, existe desde el 29 de octubre y se comprobó de nuevo. No se duplicó. Sus valores se limitan por el código a ubicaciones reales; las dimensiones estándar de artículo, título y moneda no se vuelven a registrar.

`whatsapp_click` y `phone_call_click` están marcados como eventos clave. WhatsApp ya carecía de valor predeterminado. Se encontró **1 USD asignado a cada clic de teléfono**: se cambió a **«No asignar ningún valor predeterminado»**, se guardó y se reabrió para verificar la persistencia. Los clics de contacto siguen significando intención, no conversaciones ni ventas. La consola todavía no mostraba datos de flujo de esos eventos en su ventana de 28 días; no se generaron clics de contacto para aparentar recepción. También existen claves predeterminadas sin uso (`purchase`, `qualify_lead`, `close_convert_lead`); el sitio no emite compras ficticias.

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

GA4 dispone desde mayo de 2026 del canal predeterminado **AI Assistant**. Para referentes reconocidos puede asignar medio `ai-assistant` y campaña `(ai-assistant)`. Se prefiere ese canal nativo; no se creó un grupo personalizado redundante. Revisar también fuente/medio porque las aplicaciones pueden omitir el referente. Google AI Overviews y AI Mode siguen dentro de Organic Search. Ninguna agrupación reconstruye referencias ausentes ni demuestra una recomendación.

Referencias: [grupo de canales predeterminado](https://support.google.com/analytics/answer/9756891), [novedades de Analytics](https://support.google.com/analytics/answer/9164320).

Comparar ventanas completas de 28 y 90 días, país y dispositivo, separando marca/sin marca. No inventar una línea base cuando falte historial. `view_item.value` no debe sumarse como ventas.

## Search Console: comprobaciones de cierre

En Ajustes se observó **«Propietario verificado»** y robots.txt **«Válidas»**. El sitemap figura **«Correcto»**, enviado el 29 de octubre, leído por última vez el 3 de noviembre, con diez páginas y cero vídeos descubiertos. Se mantuvo el envío existente. El informe agregado Páginas todavía indica que Google está procesando los datos; no se convierte ese estado en un total inventado de URLs indexadas.

Acciones manuales y Problemas de seguridad muestran **«No se ha detectado ningún problema»**. El informe HTTPS, actualizado el 5 de noviembre, muestra dos URLs HTTPS, cero no HTTPS y **«No hay problemas críticos»**. Ese informe parcial no sustituye las diez comprobaciones HTTP públicas ni se presenta como cobertura completa del sitio.

Core Web Vitals, actualizado el 3 de noviembre, no reúne suficientes datos de uso en los últimos 90 días para móvil ni ordenador. No se declara aprobado o fallido. Las mediciones de laboratorio históricas se conservan aparte y no reemplazan datos de campo.

Se inspeccionaron las diez canónicas individualmente:

| Página | Estado de Google observado | Solicitud de hoy |
|---|---|---|
| `/` | Indexada; rastreo e indexación permitidos, canónica seleccionada correcta | No repetida |
| `/productos` | Indexada; una ruta de exploración válida | No repetida |
| `/cockpit-con-silla` | Indexada | No repetida |
| `/moza-r3` | Descubierta, actualmente sin indexar | Aceptada |
| `/moza-r5` | Descubierta, actualmente sin indexar | Aceptada |
| `/moza-r9-kit` | Google no reconoce la URL | Aceptada |
| `/moza-r12-kit` | Google no reconoce la URL | Aceptada |
| `/simulador-tripode` | Descubierta, actualmente sin indexar | Aceptada |
| `/logitech-g29` | Descubierta, actualmente sin indexar | Aceptada |
| `/privacidad` | Google no reconoce la URL | **Cuota diaria superada**; no aceptada ni repetida |

Los seis resultados aceptados mostraron explícitamente **«Se ha solicitado la indexación»** después de la comprobación de la URL publicada. Una solicitud aceptada incorpora la URL a una cola de rastreo prioritaria: **no equivale a indexación**. Google advierte que repetirla no cambia su prioridad. La respuesta de cuota para privacidad se respeta; puede solicitarse en otro día si sigue siendo necesario, sin eludir el límite mediante otras propiedades o cuentas.

En Ajustes → IA generativa en la Búsqueda se guardó **«Incluir»** explícitamente para esta propiedad, desactivando la herencia. Se confirmó «Se han guardado los cambios», la selección final y el botón Guardar desactivado. Es un permiso de inclusión en las funciones de Google, no una garantía de selección o de recomendaciones de otros asistentes.

Referencia: [control de IA generativa de Search Console](https://support.google.com/webmasters/answer/16908024).

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

La comprobación actual del panel redirige al inicio de sesión. Hay un perfil guardado, pero continuar exige aceptar términos de Cloudflare; se solicitó confirmación antes de iniciar sesión. No se modificó DNS ni se presenta la redirección como aplicada. La configuración propuesta es una regla de redirección 301 para `http.host eq "www.simracingec.com"`, destino dinámico `concat("https://simracingec.com", http.request.uri.path)`, conservando la consulta. Debe revisarse frente a las reglas existentes y comprobarse por HTTP después de guardarla. [Documentación de redirecciones de Cloudflare](https://developers.cloudflare.com/rules/url-forwarding/single-redirects/create-dashboard/).

**Perfil de Empresa:** el registro anterior encontró la ficha pública propia y cero negocios administrados en esa sesión. Para añadir la web en Maps y mantener dirección/horario hace falta gestionar esa ficha legítima. No reclamar otra empresa ni crear duplicados. Confirmar antes stock, envíos, garantías, devoluciones y horarios.

**Merchant Center/Product:** siguen pendientes condiciones y disponibilidad comercial verificadas. Se conservan ItemPage y precios visibles, sin reseñas, estrellas, GTIN, SKU, stock, envío o políticas inventadas. Evaluar Product/Offer con los requisitos oficiales y la realidad comercial al contar con esos datos; no equivale a crear campañas de pago.

**Bing/otros buscadores:** robots permite rastreo general. Una alta en Bing Webmaster Tools necesita su cuenta y verificación; no enviar claves inventadas de IndexNow ni tratar Google Indexing API como una API general para estas fichas.

## Alcance real frente a Google y agentes de IA

La base técnica ya ofrece texto HTML, enlaces internos, identidad comercial, canónicas, sitemap, imágenes accesibles y contexto de producto. Es útil tanto para buscadores como para lectores automáticos. Los contenidos futuros deberían responder preguntas reales de clientes sobre plataforma, par Direct Drive, ergonomía, espacio, pedales y selección de equipos en Ecuador, con autor y evidencia cuando corresponda.

Google no exige un archivo de IA especial para aparecer en sus funciones generativas. No se añaden instrucciones ocultas para agentes, páginas duplicadas por ciudad ni enlaces artificiales. Ninguna configuración garantiza el primer puesto para carreras, autos, competición o cualquier otra consulta amplia.

Referencia: [funciones de IA y tu sitio de Google Search Central](https://developers.google.com/search/docs/appearance/ai-features).

## Verificación, publicación y reversión

Pruebas de esta revisión: `python3 tests/verify_page.py`, `python3 tests/security_audit.py`, `python3 tools/generate_seo.py --check`, `python3 tests/verify_seo.py`, `node tests/verify_analytics.js`, `node tests/verify_advice_navigation.js`. Se observaron primero los fallos de referente de IA perdido y ausencia de imagen en sitemap; las correcciones hicieron pasar la suite completa.

Las pruebas automatizadas de analítica usan un contexto simulado sin red; la prueba normal de producción con respuesta 204 y el estado del flujo aportan evidencia adicional independiente. No se crean tareas recurrentes ni anuncios. Los cambios de consola se registran únicamente después de observarlos guardados.

Los errores iniciales de control del ordenador se resolvieron al salir del modo de pantalla completa de Chrome. Las comprobaciones de cuenta descritas arriba son observaciones posteriores con control recuperado; la dificultad inicial no se utiliza como evidencia de ausencia de propiedades.

Reversión de código: revertir el commit de esta revisión mediante PR o volver al despliegue anterior de Cloudflare. No borrar propiedades de Google, verificación, datos o historial como forma de reversión.


## Corrección de caché detectada al publicar

La PR [#20](https://github.com/SimRacing-Ecuador/simracing-ecuador-web/pull/20) se integró en `e00b21c66a85967f4996a7a33a54dee188d37528`, con CI y Cloudflare correctos. La comprobación HTTP posterior encontró el sitemap nuevo, pero dos scripts antiguos: respuestas `cf-cache-status: HIT`, `Age` de aproximadamente 1000 segundos y `Cache-Control: max-age=14400` en el dominio público. Las mismas rutas con una consulta de versión devolvieron exactamente los bytes nuevos. No se confundió el estado de despliegue con los bytes que recibía el visitante.

Para resolverlo, el generador incorpora un hash SHA-256 abreviado a las URLs de configuración, catálogo y cliente de medición en las diez páginas. Calcula el hash del catálogo que va a escribir, de modo que basta una generación. Conserva el orden y `defer`, sin cargar Google antes del consentimiento. Una prueba falló primero por falta de versión; la suite y una prueba aislada de cambios simultáneos de inventario/configuración pasan tras la corrección. Después de la PR #21 se comprobó que las diez páginas, las tres URLs versionadas, el sitemap, robots y los recursos de imagen coincidían con los archivos publicados esperados. La evidencia HTTP histórica se conserva por separado; no sustituye el estado actual de la cuenta.
