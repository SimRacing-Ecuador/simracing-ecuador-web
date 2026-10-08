# Sim Racing Ecuador Web

> Sitio web oficial de **Sim Racing Ecuador** ([simracingec.com](https://simracingec.com/)). Experiencia interactiva de simulación de carreras y catálogo de equipamiento local bajo el sistema de diseño **Night Telemetry**.

---

## Características principales

- **Arquitectura estática pura (Zero-Build):** HTML5 semántico, CSS3 moderno y JavaScript vanilla. Sin compiladores, sin Node.js en tiempo de ejecución, sin dependencias externas.
- **Recursos 100 % auto-alojados:** Fuentes variables (`fonts/`), librerías (`vendor/`), imágenes WebP (`optimized/`) y secuencias (`sequence/`) residen íntegramente en el repositorio.
- **Scrollytelling cinematográfico:** Canvas con secuencia de 121 fotogramas, semáforo de salida interactivo, pistas de telemetría y HUD dinámico con GSAP, ScrollTrigger y Lenis.
- **Seguridad estricta (Content Security Policy):** Headers CSP y meta tags sin estilos en línea, sin scripts inseguros y con orígenes restringidos.
- **Accesibilidad y rendimiento:** Soporte nativo de `prefers-reduced-motion`, etiquetas semánticas, navegación accesible por teclado y decodificación asíncrona de imágenes.

---

## Estructura del repositorio

```text
├── index.html                   # Página principal (Home scrollytelling)
├── productos.html               # Catálogo general de equipamiento
├── cockpit-con-silla.html       # Ficha técnica: Cockpit Pro con silla ($350)
├── simulador-tripode.html       # Ficha técnica: Simulador tipo trípode ($185)
├── moza-r3.html                 # Ficha técnica: Bundle MOZA R3 ($580)
├── moza-r5.html                 # Ficha técnica: Base MOZA R5 ($675)
├── moza-r9-kit.html             # Ficha técnica: Kit MOZA R9 ($1.640)
├── moza-r12-kit.html            # Ficha técnica: Kit MOZA R12 ($1.820)
├── styles.css                   # Sistema de diseño "Night Telemetry" y estilos globales
├── script.js                    # Motor interactivo y animaciones GSAP / Lenis
├── boot.js                      # Inicialización previa al render (detección de movimiento y FOUC)
├── fonts/                       # Fuentes auto-alojadas (Archivo y JetBrains Mono)
├── vendor/                      # Librerías auto-alojadas (GSAP, ScrollTrigger, Lenis)
├── sequence/                    # Secuencia de 121 cuadros WebP para el hero
├── optimized/                   # Recursos visuales optimizados (.webp)
├── tests/                       # Suite de pruebas automatizadas
│   ├── verify_page.py           # Contrato estático de contenido, productos y estructura
│   └── security_audit.py        # Auditoría de seguridad estricta y CSP
├── docs/                        # Especificaciones de diseño y planes de ejecución
├── AGENTS.md                    # Estándares obligatorios para agentes de IA
├── CLAUDE.md                    # Guía de referencia rápida para Claude Code
└── CONTRIBUTING.md              # Guía de contribución y control de calidad
```

---

## Ejecución local

Al no requerir compilación, cualquier servidor HTTP estático sirve el proyecto:

```bash
# Con Python 3:
python3 -m http.server 8000

# Luego abre en tu navegador:
# http://localhost:8000
```

---

## Verificación y pruebas

El repositorio cuenta con dos suites de verificación automatizadas (ejecutadas también en GitHub Actions CI):

```bash
# 1. Verificar el contrato estático de páginas (productos, precios, enlaces y hooks)
python3 tests/verify_page.py

# 2. Ejecutar la auditoría estricta de seguridad (CSP, DOM seguro, target=_blank)
python3 tests/security_audit.py
```

Ambas pruebas deben finalizar con código de salida `0` para que cualquier cambio sea admitido.

---

## Estándares de desarrollo para agentes y colaboradores

- Consulta [AGENTS.md](AGENTS.md) para conocer las reglas de diseño, tokens CSS, restricciones de CSP y directrices arquitectónicas para modelos de IA.
- Consulta [CONTRIBUTING.md](CONTRIBUTING.md) para el flujo de trabajo de ramas, convenciones de commit y checklist de revisión.
- Consulta [SECURITY.md](SECURITY.md) para la política de divulgación de vulnerabilidades.
