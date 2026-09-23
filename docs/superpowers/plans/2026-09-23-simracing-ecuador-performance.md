# SimRacing Ecuador Fluidez y Carga Asíncrona Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Mejorar la fluidez de todas las páginas estáticas reduciendo trabajo bloqueante y coste por frame, sin modificar la estética ni la coreografía de animaciones existente.

**Architecture:** Mantener el sitio sin dependencias y conservar HTML/CSS visual existente. Las imágenes no críticas usarán decodificación asíncrona y lazy loading, el video hero se activará en idle después del primer render y el parallax sólo calculará elementos visibles. La prueba estática verificará estos contratos para cada página y un navegador local comprobará que la página sigue renderizando.

**Tech Stack:** HTML5, CSS3, JavaScript vanilla, PowerShell, navegador integrado.

**Spec:** `docs/superpowers/specs/2026-09-19-simracing-ecuador-design.md` y petición del usuario: “mejora la fluidez de la página web con cargas asíncronas… no cambies nada estético ni de animaciones”.

## Global Constraints

- No cambiar colores, tipografías, tamaños, espaciados, keyframes, duraciones, easing, transformaciones visuales ni contenido comercial.
- No agregar frameworks, dependencias remotas, analytics ni endpoints.
- Mantener el video hero visible mediante su poster mientras la fuente MP4 se prepara de forma diferida.
- Mantener `prefers-reduced-motion`, navegación de teclado, menú móvil y todas las rutas/alt existentes.
- No sobrescribir cambios locales previos no relacionados con rendimiento.

## Review Focus

- Primer render sin video listo: el poster del hero debe permanecer visible y el video debe comenzar después sin bloquear la página.
- Imágenes above-the-fold: no deben aparecer tarde ni alterar el layout; deben conservar prioridad alta cuando corresponda.
- Imágenes below-the-fold: deben esperar hasta acercarse al viewport y decodificar fuera del hilo principal.
- Scroll con muchos elementos: el parallax debe conservar su salida visual, pero no medir todos los elementos fuera del viewport en cada frame.
- Movimiento reducido y navegadores sin `requestIdleCallback`/`IntersectionObserver`: deben conservar el fallback visible y no lanzar errores.

### Task 1: Pin the performance contract with static tests

**Files:**
- Modify: `tests/verify-page.ps1`

**Interfaces:**
- Consumes: all `*.html`, `script.js`, and `styles.css` in the repository root.
- Produces: assertions for async media loading, layout-stability attributes, and visible fallback behavior.

- [ ] **Step 1: Add failing assertions**

Add checks that every non-hero `<img>` has `decoding="async"`, every below-fold image has `loading="lazy"`, every page uses a high-priority logo only where it is above the fold, the home video uses `preload="none"` and a `data-src` source, and `script.js` contains idle loading plus visible-target parallax tracking.

- [ ] **Step 2: Run the static test and confirm RED**

Run `pwsh -NoProfile -File tests/verify-page.ps1`.

Expected: FAIL because the current markup has images without async decoding, the hero source loads eagerly, and the current parallax loop has no visible-target set.

### Task 2: Defer non-critical media without changing presentation

**Files:**
- Modify: `index.html`
- Modify: `productos.html`
- Modify: `simulador-tripode.html`
- Modify: `moza-r3.html`
- Modify: `moza-r5.html`
- Modify: `moza-r9-kit.html`
- Modify: `moza-r12-kit.html`

**Interfaces:**
- Consumes: existing local image/video paths and current CSS selectors.
- Produces: stable image dimensions, async decoding hints, lazy non-critical images, and a poster-first hero video source.

- [ ] **Step 1: Add media attributes only**

Add `decoding="async"` to local images, keep the visible logo and first product/hero image eager with `fetchpriority="high"`, mark below-fold images `loading="lazy"`, and add `width`/`height` attributes matching the existing asset dimensions where known so the browser can reserve space without changing CSS sizing.

- [ ] **Step 2: Make hero video poster-first**

Change only the home page video to `preload="none"` and change its MP4 source from `src` to `data-src`; keep autoplay, muted, loop, playsinline, poster, and all existing classes unchanged.

- [ ] **Step 3: Run the static test and confirm GREEN for markup**

Run `pwsh -NoProfile -File tests/verify-page.ps1` after Task 3's script assertions are present; expected result is PASS.

### Task 3: Reduce main-thread work during startup and scroll

**Files:**
- Modify: `script.js`

**Interfaces:**
- Consumes: `.hero-video`, current `parallaxTargets`, current `reduceMotionQuery`, and current motion observer behavior.
- Produces: `loadHeroVideo()`, an idle callback fallback, visible parallax target tracking, and unchanged menu/motion APIs.

- [ ] **Step 1: Write the failing behavior test in the static contract**

The assertions from Task 1 must require `requestIdleCallback` or a `setTimeout` fallback, `data-src`, `video.load()`, `IntersectionObserver` tracking for parallax visibility, and a `Set`/equivalent used by the frame update.

- [ ] **Step 2: Implement idle video loading**

Create a small `loadHeroVideo()` function that exits for missing video, reduced motion, or an already-loaded source; copies `data-src` to `src`, removes `data-src`, calls `load()`, then calls `play().catch(() => {})`. Schedule it with `requestIdleCallback` when available and a bounded `setTimeout` fallback otherwise. Do not schedule it when reduced motion is enabled.

- [ ] **Step 3: Track only visible parallax elements**

Create a `Set` initialized from the current parallax targets and an `IntersectionObserver` with a modest root margin. Add/remove targets on intersection changes. In `updateScrollEffects()`, iterate that set and keep the existing offset formula and CSS custom property values unchanged. Disconnect the observer when reduced motion is enabled and recreate it when motion is enabled again.

- [ ] **Step 4: Run static and syntax validation**

Run `pwsh -NoProfile -File tests/verify-page.ps1` and `node --check script.js`.

Expected: both commands exit 0 and the existing motion/menu contract remains present.

### Task 4: Verify the rendered site and integrate

**Files:**
- Validate: all modified HTML pages, `script.js`, `tests/verify-page.ps1`

**Interfaces:**
- Consumes: the completed static site.
- Produces: evidence of successful local rendering, no console/runtime failure, and a focused Git commit ready to merge/push.

- [ ] **Step 1: Run the full available checks**

Run `pwsh -NoProfile -File tests/verify-page.ps1`, `node --check script.js`, and inspect `git diff --check`.

- [ ] **Step 2: Serve and inspect locally**

Start a local static server, open `index.html` and a product detail page in the integrated browser, confirm the poster appears before the video is ready, scroll through the page, open/close the mobile menu, and inspect the browser console for uncaught errors.

- [ ] **Step 3: Review the diff for scope**

Confirm the diff changes loading hints, async scheduling, and measurement scope only; restore any accidental style/content/animation changes before committing.

- [ ] **Step 4: Commit and merge/push to GitHub**

Create a focused commit with message `perf: smooth async page loading`, push the current branch to `origin`, and merge it into the confirmed base branch `main`; rerun the static checks on the merged result.
