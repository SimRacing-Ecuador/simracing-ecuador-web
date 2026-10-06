# Night Telemetry — rediseño + scrollytelling (2026-10-06)

## Dirección visual
- Base tinta `#05080D` con superficies claras (`#F2F4F7`) y amarillo para el ritmo de secciones.
- Acentos tricolor de Ecuador (`--flag`: amarillo 50 %, azul 25 %, rojo 25 %) en eyebrows y barra de progreso.
- Tipografía auto-alojada: Archivo variable (ancho 62–125 %) — titulares condensados al 72 % en mayúsculas con acentos en cursiva — y JetBrains Mono para etiquetas tipo telemetría.
- CSP estricta: todo (GSAP, Lenis, fuentes) vive en `vendor/` y `fonts/`; nada de estilos inline (se usan clases o CSSOM desde JS).

## Coreografía (script.js)
| Sección | Técnica |
| --- | --- |
| Intro | Semáforo de salida (5 luces → "¡Luces fuera!"), una vez por sesión; se omite si la URL trae ancla. |
| Hero | `pin` + `scrub`: secuencia de 121 fotogramas (`sequence/`) dibujada en canvas; HUD con velocidad, marcha y luces de revoluciones ligadas al progreso. |
| Marquee | Velocidad y sesgo reaccionan a la velocidad del scroll (Lenis / `getVelocity`). |
| Setups | Galería horizontal fijada con `containerAnimation` y parallax interno (solo ≥ 961 px; en móvil, tarjetas apiladas). |
| Manifiesto | Lectura palabra por palabra con `scrub`. |
| MOZA R3 | Ensamblaje: base, volante y pedales llegan por pasos y convergen en la foto real del paquete; el precio cuenta hasta $580. |
| Sensación | Traza de telemetría revelada con un `clipPath` SVG y un punto que recorre la curva. |
| Comunidad | Marco que se expande (`clip-path`) y luces de salida que se encienden con el scroll. |
| Footer | Wordmark letra a letra con `scrub`. |

Páginas internas: entrada del hero (máscara de líneas, recorte del escenario, conteo de precios/torque), revelados por lotes (`ScrollTrigger.batch`) y parallax de imágenes.

`prefers-reduced-motion` desactiva Lenis, pins y animaciones; sin JS la página es estática y completa.

## Regenerar recursos
- Fotogramas: `ffmpeg -i 5dae82990e6d41dab0c886ad8da88529.mp4 -vf fps=24 -c:v libwebp -quality 74 sequence/f%03d.webp` (121 cuadros; ajusta `total` en `script.js` si cambia).
- Recortes `optimized/r3-*-cut.webp`: generados desde los PNG de fondo blanco eliminando el fondo conectado al borde y los huecos blancos grandes.
- Imágenes: versiones `.webp` (máx. 1920 px, calidad 80) junto a los PNG originales.

## Verificación
- `python3 tests/security_audit.py` y `python3 tests/verify_page.py` (ambos en CI).
- Nota: el video original lleva la marca de agua de Pika; conviene reemplazarlo por una exportación limpia y regenerar `sequence/`.
