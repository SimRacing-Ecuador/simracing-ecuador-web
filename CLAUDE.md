# CLAUDE.md — Sim Racing Ecuador Guidelines

High-performance, dependency-free static website for **Sim Racing Ecuador** (`simracingec.com`).

## Commands to Run

```bash
# Verify static page contract (products, prices, specs, footer links, structural hooks)
python3 tests/verify_page.py

# Verify static security audit (CSP, inline style absence, unsafe DOM patterns)
python3 tests/security_audit.py

# Local development (any static file server, e.g. python)
python3 -m http.server 8000
```

Both test scripts must exit with code 0 before any commit or pull request.

## Critical Guardrails & Architecture

1. **Zero-Build Static Stack:** Plain HTML5, CSS3, vanilla JS. No npm, no node modules, no bundler needed.
2. **Self-Hosted Assets Only:** All fonts (`fonts/`), libraries (`vendor/gsap.min.js`, `vendor/ScrollTrigger.min.js`, `vendor/lenis.min.js`), and images (`optimized/`) are local. **Never add external CDNs**.
3. **STRICT CSP & Zero Inline Styles:**
   - **Never** add `style="..."` attributes in HTML (blocked by CSP and `security_audit.py`).
   - **Never** use inline scripts (only `<script src="...">` or JSON-LD).
   - **Never** use `innerHTML`, `outerHTML`, `document.write`, or `eval`.
4. **Image Formats:** All content images in HTML must be `.webp` from `optimized/` or `sequence/`. Every `<img>` must have `alt` and `decoding="async"`.
5. **Night Telemetry Aesthetic:**
   - Dark foundation: `--ink: #05080d`
   - Accents: Electric Blue `--cyan: #00b8f2`, Yellow `--yellow: #ffd400`, Deep Blue `--blue: #075a9e`, Red `--red: #ed1c24`
   - Headings: Archivo font, 72% condensed uppercase, italic highlights
   - Data & Telemetry: JetBrains Mono
6. **Data Integrity:** Never alter prices or specs ($350 chair cockpit, $185 tripod, $580 MOZA R3, $675 R5, $1.640 R9 kit, $1.820 R12 kit) or contact info (`098 901 9836`, WhatsApp, `@SimRacingEcuador`).
7. **Accessibility:** Preserve `prefers-reduced-motion` fallbacks and responsive breakpoints (380px, 680px, 960px).
