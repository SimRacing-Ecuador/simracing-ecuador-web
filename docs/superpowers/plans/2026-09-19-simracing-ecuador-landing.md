# SimRacing Ecuador Landing Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a responsive Sim Racing Ecuador landing page that uses the supplied logo, video, and product imagery to guide visitors from brand discovery to setup exploration.

**Architecture:** Use a small static site with one semantic HTML entry point, one stylesheet for tokens/layout/components, one JavaScript file for the mobile menu and reduced-motion behavior, and one SVG favicon. Existing media stays in the project root and is referenced with relative paths.

**Tech Stack:** HTML5, CSS3, vanilla JavaScript, supplied PNG and MP4 assets.

**Spec:** `docs/superpowers/specs/2026-09-19-simracing-ecuador-design.md`

## Global Constraints

- Use the supplied Sim Racing Ecuador logo as the primary identity anchor.
- Use `#05080D`, `#F7F9FC`, `#00B8F2`, `#FFD400`, `#075A9E`, and `#ED1C24` as the site palette.
- Keep the site static and dependency-free; do not add external fonts, frameworks, remote images, analytics, checkout, accounts, inventory, or real contact endpoints.
- Preserve and reference `cover.png`, `sim racing.png`, `infografia soporte.png`, `simulador vuelo.png`, and `5dae82990e6d41dab0c886ad8da88529.mp4` from the existing folder.
- Support keyboard navigation, touch interaction, meaningful image alt text, visible focus states, a favicon, and reduced motion.

## Review Focus

- Narrow viewport: the navigation and split product sections should stack without clipped content.
- Video unavailable or reduced motion: the hero should remain legible and useful with a static gradient fallback.
- Asset paths with spaces: every supplied image and the MP4 should load from the local folder.
- Keyboard interaction: the menu toggle and anchor links should be reachable and visibly focused.
- Brand consistency: action colors and accents should use the logo-derived palette instead of unrelated defaults.

### Task 1: Create the semantic page structure

**Files:**
- Create: `index.html`

**Interfaces:**
- Consumes: local media files and the class/id hooks defined in this plan.
- Produces: semantic sections and accessible controls for `styles.css` and `script.js`.

- [ ] **Step 1: Add the document shell and metadata**

Create a language-tagged HTML document with the title `Sim Racing Ecuador | Tu mejor experiencia`, a Spanish description, viewport metadata, the SVG favicon link, and stylesheet/script references.

- [ ] **Step 2: Add the accessible header**

Create a sticky header with the logo image, a button with `aria-expanded` and `aria-controls` for the mobile menu, anchor navigation, and the primary “Arma tu setup” link.

- [ ] **Step 3: Add the hero and setup path sections**

Use a muted looping `<video>` with the supplied MP4, `poster="cover.png"`, and a text fallback. Add the main headline, supporting copy, two anchor links, and three setup path cards with descriptive labels.

- [ ] **Step 4: Add the product, cockpit, technology, community, flight, and footer sections**

Use `cover.png`, `infografia soporte.png`, and `simulador vuelo.png` with descriptive alt text. Keep commercial facts limited to what appears in the supplied artwork; use neutral “Consulta disponibilidad” language for actions. Add meaningful section IDs that match the header anchors.

### Task 2: Implement brand styling and responsive layout

**Files:**
- Create: `styles.css`

**Interfaces:**
- Consumes: semantic class hooks from `index.html`.
- Produces: palette tokens, desktop layout, responsive layout, focus states, motion preferences, and image/video treatments.

- [ ] **Step 1: Define global tokens and base rules**

Add the logo-derived color variables, system font stacks, box sizing, body background, readable default line height, container width, and visible `:focus-visible` outline.

- [ ] **Step 2: Style the header and hero**

Create the sticky header, angled accent rules, dark hero overlay, readable text measure, CTA treatments, and small metadata labels. Make the gradient fallback visible behind the video at all times.

- [ ] **Step 3: Style content sections**

Implement the setup cards, product split panel, cockpit feature panel, technology strip, community CTA, flight card, and footer. Use borders, gradients, and restrained glow effects from the palette.

- [ ] **Step 4: Add the mobile breakpoint and reduced-motion rules**

Below `760px`, stack columns, turn the menu into an overlay panel, keep section padding inside the container gutter, and disable decorative motion when `prefers-reduced-motion: reduce` is active.

### Task 3: Add behavior and favicon

**Files:**
- Create: `script.js`
- Create: `favicon.svg`

**Interfaces:**
- Consumes: `#menu-toggle`, `#site-nav`, `.nav-link`, and the hero video from `index.html`.
- Produces: menu state changes, close-on-navigation behavior, escape-key handling, and reduced-motion video handling.

- [ ] **Step 1: Implement menu state**

Toggle the `is-open` class and `aria-expanded` attribute on click, close the menu when a navigation link is selected, and close it on `Escape`.

- [ ] **Step 2: Implement reduced-motion media handling**

Detect `prefers-reduced-motion` and pause the hero video when it is enabled; resume only when the preference changes back and the video is available.

- [ ] **Step 3: Create the favicon**

Create a small inline-friendly SVG with a black field, blue steering-wheel-inspired ring, and Ecuador tricolor accent bars, then reference it from the page head.

### Task 4: Validate the finished page

**Files:**
- Validate: `index.html`, `styles.css`, `script.js`, `favicon.svg`, and all supplied media files.

**Interfaces:**
- Consumes: the complete static site.
- Produces: a locally reviewable, responsive page with no broken local asset references.

- [ ] **Step 1: Run static reference checks**

Confirm each required asset exists and each path used in `index.html` matches a file in the project folder.

- [ ] **Step 2: Run a local static server**

Serve the folder locally with an available static server and load the page at desktop and mobile widths. Confirm there are no console errors, the video fallback remains legible, and all anchor links land on the intended sections.

- [ ] **Step 3: Check keyboard and mobile behavior**

Tab through the header and CTAs, verify visible focus, open and close the mobile menu, use Escape to close it, and confirm the page remains readable at a narrow viewport.

- [ ] **Step 4: Check the final visual system**

Confirm that the logo-derived cyan, yellow, deep blue, and red accents are used consistently, no placeholder copy implies unsupported business facts, and the supplied media is integrated without stretching or clipping.

