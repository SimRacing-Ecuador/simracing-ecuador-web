# AGENTS.md — AI Agent Operating Standards & Design Guardrails

> **Target Audience:** All AI agents (Cursor, Claude Code, Antigravity, GitHub Copilot, Codex, Windsurf, etc.) working on the `Sim Racing Ecuador` codebase.
> **Core Mandate:** Preserve the exact visual identity, technical architecture, performance contracts, and strict security rules of the "Night Telemetry" design system. Under no circumstances should an agent introduce unvetted styling shifts, break Content Security Policy (CSP), invent commercial product specs, or degrade accessibility.

---

## 1. Project Overview & Architecture

**Sim Racing Ecuador** (`simracingec.com`) is a high-performance, dark-themed, scrollytelling web experience presenting racing simulation hardware, cockpits, and local guidance in Ecuador.

### Key Architectural Pillars:
- **Zero-Build Static Architecture:** Plain HTML5, CSS3, vanilla JavaScript. The site runs directly in any modern browser without npm, Webpack, Vite, or server-side rendering.
- **Self-Hosted Assets:** All fonts (`fonts/`), third-party libraries (`vendor/`), images (`optimized/`), sequence frames (`sequence/`), and icons are self-hosted in the repository. **Never add external CDNs** (e.g., cdnjs, unpkg, Google Fonts).
- **Hard Security & CSP:** Protected by strict Content Security Policy (`_headers` and `<meta http-equiv="Content-Security-Policy">`).
- **Scrollytelling & Motion Engine:** Powered by self-hosted GSAP, ScrollTrigger, Lenis smooth scroll, and a 121-frame canvas image sequence.

---

## 2. Strict Design System & Aesthetic Standards ("Night Telemetry")

Every change must harmonize with the existing "Night Telemetry" aesthetic: a dark telemetry foundation, Ecuadorian tricolor accents, condensed race-poster typography, and crisp technical data readouts.

### 2.1 Color Tokens (`:root` in `styles.css`)

Never hardcode arbitrary hex or rgb values in CSS. Use the design tokens:

| Token | Value | Semantic Usage |
| :--- | :--- | :--- |
| `--ink` | `#05080D` | Primary deep foundation, page background, dark cards |
| `--ink-2` | `#0A1019` | Secondary dark surface, subtle elevation |
| `--ink-3` | `#111A27` | Borders, elevated interactive panels |
| `--ink-4` | `#1B2636` | Scrollbars, dark borders |
| `--paper` | `#F2F4F7` | Primary high-contrast text, light section surface |
| `--paper-2` | `#E5E9EF` | Secondary light surface, table borders |
| `--cyan` | `#00B8F2` | Electric blue: primary CTA, glows, telemetry traces |
| `--yellow` | `#FFD400` | Ecuador yellow: identity badges, accents, highlights |
| `--blue` | `#075A9E` | Deep racing blue: secondary cards, feature blocks |
| `--blue-deep`| `#04223F` | Deep blue gradients, glows |
| `--red` | `#ED1C24` | Racing red: rev-limit warning, top-tier badges |
| `--flag` | `linear-gradient(90deg, var(--yellow) 0 50%, var(--blue) 50% 75%, var(--red) 75%)` | Ecuadorian tricolor accent bar (eyebrows & progress) |
| `--line` | `rgba(242, 244, 247, .12)` | Subtle dark-surface dividers |
| `--line-strong` | `rgba(242, 244, 247, .24)` | High-contrast technical borders |
| `--line-ink` | `rgba(5, 8, 13, .14)` | Dividers on light surfaces |

### 2.2 Typography System

Self-hosted in `fonts/` with `font-display: swap`:
1. **Headings & Display (`--sans`):**
   - Font family: `"Archivo", "Helvetica Neue", Arial, sans-serif`
   - Weight: 900 (Black)
   - Font-stretch: `72%` (condensed uppercase for impactful race titles)
   - Accent words: `<em>` styled with italic slant (`font-style: italic`, color `--cyan` or `--yellow`)
   - Letter-spacing: `-0.04em` to `-0.06em`
   - Line-height: `0.78` to `0.88`
2. **Body Copy (`--sans`):**
   - Normal width (`font-stretch: 100%`), line-height `1.55`
   - Primary text: `var(--paper)` on dark, `var(--ink)` on light
   - Secondary text: `var(--text-dim)` (`rgba(242, 244, 247, .68)`)
3. **Telemetry & Technical Readouts (`--mono`):**
   - Font family: `"JetBrains Mono", ui-monospace, monospace`
   - Used for: Product codes, metric labels, specifications, price numbers, table keys, telemetry chips

### 2.3 Layout & Structural Rhythm

- **Gutter & Shell:**
  - `--gutter`: `clamp(16px, 4vw, 56px)`
  - `--shell`: `min(1320px, calc(100% - 2 * var(--gutter)))`
- **Alternating Section Palette:**
  The site maintains an intentional editorial rhythm:
  1. Hero: Dark foundation (`--ink`) with Canvas scrollytelling HUD
  2. Setup Navigator: Yellow or deep dark interactive rail
  3. Feature Story / About: Light paper (`--paper`) high-contrast editorial section
  4. Technology & Cockpits: Alternating dark ink and deep blue (`--blue`) panels
  5. Close & Footer: Deep dark ink foundation
- **Visual Details:**
  - Angled skew badges: `transform: skew(-24deg)` for Ecuadorian tricolor bars
  - Technical grid overlays: subtle `72px 72px` cyan/yellow grid lines
  - Sharp technical borders: `1px solid var(--line)`
  - Border radii: `--radius: 20px`, `--radius-sm: 12px`

---

## 3. Motion & Scrollytelling Standards

The motion experience is orchestrated in `script.js` with assistance from `boot.js`:

1. **Boot Lifecycle (`boot.js`):**
   - Adds `.js` and `.motion-pending` before first paint to prevent Flash of Unstyled Content (FOUC).
   - Adds `.intro-pending` on the home page if the start-lights intro has not been seen in the current `sessionStorage`.
   - Failsafe timeout removes pending classes after 4.5s if GSAP fails to initialize.
2. **Scrollytelling Components:**
   - **Start Lights:** 5-light sequence (`.start-lights`) triggering "¡Luces fuera!".
   - **Hero Canvas:** 121 WebP frames (`sequence/f001.webp` – `sequence/f121.webp`) pinned and scrubbed with Lenis/ScrollTrigger.
   - **Horizontal Setup Rail:** `.setups-track` pinned with `containerAnimation` on desktop (stacked on screens < 961px).
   - **Text Reveals:** `.split-line` and word-by-word reveal triggers (`data-words`).
3. **Accessibility Mandate (`prefers-reduced-motion`):**
   - **MUST NEVER BREAK:** If `(prefers-reduced-motion: reduce)` matches, GSAP pinning, Lenis smooth scrolling, canvas scrubbing, and transform animations are completely bypassed.
   - The entire website must render in full, readable, static form.

---

## 4. Hard Security & CSP Rules (Zero Exceptions)

The CI test `python3 tests/security_audit.py` enforces these rules on every commit:

1. **Strict Content Security Policy:**
   Every HTML file MUST include the exact CSP `<meta>` tag:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; media-src 'self'; frame-src https://www.youtube.com; connect-src 'self'; manifest-src 'self'; worker-src 'none'; upgrade-insecure-requests" />
   ```
2. **NO Inline Style Attributes:**
   - **Forbidden:** `<div style="...">` — **NEVER use `style=""` in HTML**. The test rejects any page with ` style="`.
   - Dynamic styles must be set via CSS classes or JS style properties (`element.style.setProperty`).
3. **NO Inline Executable Scripts:**
   - Only `<script src="...">` or `<script type="application/ld+json">` are allowed.
4. **NO Dangerous JavaScript Patterns:**
   - **Forbidden:** `innerHTML`, `outerHTML`, `insertAdjacentHTML`, `document.write`, `eval()`, `new Function()`, `javascript:` URLs, and inline handlers (`onclick=`, `onload=`, `onerror=`).
   - Use `textContent`, `createElement`, `setAttribute`, and `addEventListener`.
5. **External Links (`target="_blank"`):**
   - MUST include `rel="noreferrer"` (or `rel="noopener noreferrer"`).
6. **YouTube Embeds / Iframes:**
   - MUST point strictly to `https://www.youtube.com/embed/...` with `sandbox` attribute.
7. **No Insecure HTTP:**
   - All external URLs must use `https://`.

---

## 5. Media & Asset Rules

1. **Optimized Formats:**
   - All content images in HTML MUST use `.webp` located in `optimized/` (or `sequence/`).
   - Do NOT reference `.png` in content `<img>` tags (except `favicon.png` or `site.webmanifest`).
2. **Image Attributes:**
   - Every `<img>` tag MUST have an informative `alt` attribute (in Spanish).
   - Every `<img>` tag MUST have `decoding="async"`.
   - Non-critical images below the fold MUST have `loading="lazy"`.
   - Provide `width` and `height` to prevent Cumulative Layout Shift (CLS).

---

## 6. Content & Commercial Data Integrity

The automated test `python3 tests/verify_page.py` verifies product specs and contact details. **Never invent or alter these values without explicit authorization:**

| Item | Canonical Values |
| :--- | :--- |
| **Cockpit con silla** | `$350`, Plegable, Soporte palanca cambios, Placa volante inclinable, Acero/plástico, UNE EN 12520. CTA: WhatsApp |
| **Simulador tipo trípode** | `$185`, Plegable, 522x831x815mm, 20kg (44lbs), YouTube embed: `Qryc6QBhAPc` |
| **MOZA R3 Bundle** | `$580`, 3,9 Nm Direct Drive, 15 bits, PC y Xbox, Pedales SR-P Lite, 1000 Hz, Abrazadera mesa |
| **MOZA R5** | `$675`, 5,5 Nm, 1000 Hz, Rotación infinita |
| **MOZA R9 Kit** | `$1.640`, 9 Nm, Volante CS V2P, Pedales CRP2, "Solo disponible en kit" |
| **MOZA R12 Kit** | `$1.820`, 12 Nm, NexGen 4.0, Volante CS V2P, Pedales CRP2, "Solo disponible en kit" |
| **Logitech G29** | Mentioned as entry point |
| **Phone Number** | `098 901 9836` |
| **WhatsApp Link** | `https://wa.me/593989019836` |
| **Instagram** | `https://www.instagram.com/SimRacingEcuador/` (`@SimRacingEcuador`) |
| **TikTok** | `https://www.tiktok.com/@simracingec` (`@simracingec`) |

---

## 7. Responsive Breakpoints

Always verify behavior at these core breakpoints:
- **Mobile Small (< 380px):** Ultra-compact phones. Specs stack cleanly, padding clamped to 16px.
- **Mobile (< 680px):** Single-column layout, full-screen mobile menu drawer, horizontal tables become stacked cards.
- **Tablet / Mid (< 960px):** Grid adjustments, setups track switches from horizontal scroll to vertical cards.
- **Desktop (≥ 960px):** Full scrollytelling, pinned horizontal tracks, canvas telemetry HUD.
- **Wide Screens (≥ 1320px):** Bounded by `--shell: min(1320px, ...)`.

---

## 8. Verification Commands & Pre-Commit Checklist

Before opening a pull request or committing changes, an agent **MUST execute**:

```bash
# 1. Run the static page contract test (checks 8 pages for content, structure, styles, links)
python3 tests/verify_page.py

# 2. Run the security audit (checks CSP, XSS, inline styles, unsafe iframe/links)
python3 tests/security_audit.py
```

Both commands must exit with code `0`.

### Agent Pre-Commit Checklist:
- [ ] No `style="..."` attribute introduced anywhere in HTML.
- [ ] No external CDNs or remote font/script references added.
- [ ] All images have `alt`, `decoding="async"`, and are `.webp`.
- [ ] No product specs, prices, or contact numbers modified without request.
- [ ] `prefers-reduced-motion` functions cleanly with zero visual breakage.
- [ ] `python3 tests/verify_page.py` passes.
- [ ] `python3 tests/security_audit.py` passes.
- [ ] Git commit message follows Conventional Commits (e.g. `feat:`, `fix:`, `docs:`, `perf:`).
