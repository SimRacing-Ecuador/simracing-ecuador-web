"""Static page contract for the Sim Racing Ecuador site (dependency-free).

Checks content that must never regress (products, prices, specs, links,
contact details) plus the structural hooks the GSAP scroll system relies on.
"""

from __future__ import annotations

import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
errors: list[str] = []


def read(name: str) -> str:
    return (ROOT / name).read_text(encoding="utf-8")


def require(condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)


def contains(text: str, token: str) -> bool:
    return token in text


PAGES = ["index.html", "productos.html", "simulador-tripode.html", "cockpit-con-silla.html",
         "moza-r3.html", "moza-r5.html", "moza-r9-kit.html", "moza-r12-kit.html"]
REQUIRED_FILES = PAGES + [
    "styles.css", "script.js", "boot.js", "favicon.png",
    "vendor/gsap.min.js", "vendor/ScrollTrigger.min.js", "vendor/lenis.min.js",
    "fonts/archivo-latin-wdth-normal.woff2", "fonts/archivo-latin-wdth-italic.woff2",
    "fonts/jetbrains-mono-latin-wght-normal.woff2", "optimized/logo.webp",
    "optimized/r3-base-cut.webp", "optimized/r3-wheel-cut.webp", "optimized/r3-pedals-cut.webp",
    "optimized/r3-bundle-cut.webp", "sequence/f001.webp", "sequence/f121.webp",
]
for name in REQUIRED_FILES:
    require((ROOT / name).exists(), f"Missing required file: {name}")
if errors:
    print("\n".join(f"- {e}" for e in errors))
    sys.exit(1)

html = read("index.html")
products = read("productos.html")
tripod = read("simulador-tripode.html")
chair = read("cockpit-con-silla.html")
r3 = read("moza-r3.html")
r5 = read("moza-r5.html")
r9 = read("moza-r9-kit.html")
r12 = read("moza-r12-kit.html")
css = read("styles.css")
js = read("script.js")
pages = {name: read(name) for name in PAGES}

# ---- Sitewide ---------------------------------------------------------------
for name, markup in pages.items():
    require("viewport-fit=cover" in markup, f"Missing safe-area viewport on {name}")
    require("Content-Security-Policy" in markup, f"Missing CSP on {name}")
    require(' style="' not in markup, f"Inline style attribute (blocked by CSP) on {name}")
    for script in ("boot.js", "vendor/gsap.min.js", "vendor/ScrollTrigger.min.js", "vendor/lenis.min.js", "script.js"):
        require(f'src="{script}"' in markup, f"Missing {script} on {name}")
    for token in ("footer-grid", "098 901 9836", "Todos los derechos reservados", 'id="contacto"'):
        require(token in markup, f"Missing sitewide footer detail on {name}: {token}")
    for link in ("https://www.instagram.com/SimRacingEcuador/", "https://www.tiktok.com/@simracingec", "https://wa.me/593989019836"):
        require(link in markup, f"Missing contact link on {name}: {link}")
    require('aria-controls="site-nav"' in markup and "aria-expanded" in markup, f"Mobile menu must expose aria state on {name}")
    require('href="productos.html"' in markup, f"Main navigation must link to products on {name}")
    for tag in re.findall(r"<img\b[^>]*>", markup):
        require("alt=" in tag, f"Image without alt on {name}: {tag}")
        require('decoding="async"' in tag, f"Image without async decoding on {name}: {tag}")
        require(".png" not in tag or "favicon" in tag, f"Unoptimised PNG still referenced on {name}: {tag}")

for token in ("#00b8f2", "#ffd400", "#075a9e", "#ed1c24"):
    require(token in css.lower(), f"Missing brand token {token}")
for rule in ("prefers-reduced-motion", "@view-transition", "overflow-x: clip", "env(safe-area-inset-left", "pointer: coarse",
             "hover: none", "text-size-adjust", "font-display: swap", "max-width: 380px", "max-width: 680px", "max-width: 960px"):
    require(rule in css, f"Missing style safeguard: {rule}")
require(not re.search(r"min-width: 5[0-9]{2}px;", css), "Spec tables must stack on phones instead of forcing horizontal scroll")

# ---- Motion system ----------------------------------------------------------
for hook in ("ScrollTrigger", "registerPlugin", "gsap.matchMedia", "containerAnimation", "scrub", "pin: true",
             "Lenis", "prefers-reduced-motion", "menu-toggle", "sessionStorage", "playIntro", "splitLines",
             "splitWords", "ScrollTrigger.batch", "sequence/f", "getVelocity"):
    require(hook in js, f"Missing motion hook in script.js: {hook}")
for hook in ("motion-ready", "motion-pending", "intro-pending", "split-line", "scroll-progress", "rev-lights"):
    require(hook in css, f"Missing motion style: {hook}")

# ---- Home -------------------------------------------------------------------
for section in ("inicio", "setups", "productos", "comunidad", "contacto"):
    require(f'id="{section}"' in html, f"Missing home section id {section}")
for hook in ('class="hero-canvas"', 'class="marquee-band"', 'class="setups-track"', "data-words",
             'class="assembly-stage"', 'class="telemetry-chart"', 'id="chart-reveal"', 'class="start-lights"', 'class="intro"'):
    require(hook in html, f"Missing scrollytelling markup: {hook}")
for category in ("Volantes", "Cockpits", "Accesorios"):
    require(category in html, f"Missing home product category: {category}")
for link in ("productos.html#volantes-pedales", "productos.html#cockpits", "productos.html#accesorios", "moza-r3.html"):
    require(link in html, f"Missing home link: {link}")
require('href="#setups"' in html and "Ver productos" in html, "Home product CTA must point to the setups section")
require("https://wa.me/593989019836?text=Hola%2C%20quiero%20cotizar%20un%20simulador" in html, "Home quote CTA must point to WhatsApp")
require("Cotiza tu simulador" in html, "Quote CTA label is missing")
require("$<b data-count-to=\"580\">580</b>" in html, "Home MOZA R3 price must be $580")

# ---- Catalogue --------------------------------------------------------------
for product in ("Simulador tipo trípode", "Logitech G29", "MOZA R3", "MOZA R5", "MOZA R9 Kit", "MOZA R12 Kit", "Cockpit con silla", "Mods y pistas de madera"):
    require(product in products, f"Missing catalog product: {product}")
require("LRS13-BS01" not in products, "Removed cockpit LRS13-BS01 is still listed in the catalog")
for section in ('id="cockpits"', 'id="volantes-pedales"', 'id="accesorios"'):
    require(section in products, f"Missing catalog category section: {section}")
require('src="optimized/cockpit-silla-hero.webp"' in products, "Catalog hero must feature the cockpit pro image")
require('alt="Cockpit Pro plegable con silla para simulación de carreras"' in products, "Catalog hero must describe the cockpit pro image")
require(re.search(r'href="#cockpits"[^>]*>Ver cockpits', products) is not None, "Catalog hero CTA must point to the cockpit section")
for link in ("simulador-tripode.html", "cockpit-con-silla.html", "moza-r3.html", "moza-r5.html", "moza-r9-kit.html", "moza-r12-kit.html"):
    require(f'href="{link}"' in products, f"Missing catalog link: {link}")
require('control-row-link" href="moza-r3.html"' in products, "MOZA R3 must open its own detail page from the catalog row")
require("https://wa.me/593989019836?text=Hola%2C%20quiero%20consultar%20la%20disponibilidad%20del%20cockpit%20con%20silla" in products,
        "Chair cockpit availability must link to WhatsApp")
require(re.search(r'(?s)<article class="cockpit-feature cockpit-feature-chair">.*?<h3>Cockpit con silla</h3>.*?\$350', products) is not None, "Chair cockpit must show $350")
require(re.search(r'(?s)<article class="cockpit-feature">.*?<h3>Simulador tipo trípode</h3>.*?\$185', products) is not None, "Tripod cockpit must show $185")
for price in ("$580", "$675", "$1.640", "$1.820"):
    require(price in products, f"Missing catalog price: {price}")
for part in ("CS V2P", "CRP2", "Solo disponible en kit"):
    require(part in products, f"Missing kit detail: {part}")

# ---- Product sheets ---------------------------------------------------------
for detail in ("youtube.com/embed/Qryc6QBhAPc", "Placa para Volante Ajustable", "Diseño Plegable", "522x831x815mm", "20kg (44lbs)",
               "optimized/tripode-pies-ai.webp", "optimized/tripode-cockpit-ai.webp", "optimized/tripode-volante.webp",
               "optimized/tripode-plegado-ai.webp", "optimized/tripode-ajuste-ai.webp", "$185"):
    require(detail in tripod, f"Missing tripod product detail: {detail}")
require('src="https://www.youtube.com/embed/Qryc6QBhAPc?rel=0&modestbranding=1"' in tripod, "Tripod video must use the canonical YouTube embed URL")
for asset in ("hero", "rear", "scene", "cover", "folded", "wheel-plate", "pedal-plate", "mounting", "dimensions"):
    require(f"optimized/cockpit-silla-{asset}.webp" in chair, f"Missing chair cockpit asset: {asset}")
for detail in ("Diseño plegable", "Soporte para palanca de cambios ajustable", "Puntos de montaje pretaladrados", "Placa de volante inclinable",
               "Soporte para pedal ajustable", "Funda de asiento transpirable removible", "Pies de silicona", "1350~1600x938x1042mm",
               "120kg (264lbs)", "Marco plegable", "Acero, plástico", "UNE EN 12520", "$350"):
    require(detail.lower() in chair.lower(), f"Missing chair cockpit detail: {detail}")
for detail in ("MOZA R3", "$580", "3,9 Nm", "Codificador de 15 bits", "Direct Drive", "Compatible con PC y Xbox", "Pedales SR-P Lite",
               "22 botones", "10 LED RGB de alto brillo", "1000 Hz", "Abrazadera de mesa", "optimized/r3-bundle-cut.webp",
               "optimized/r3-base-ai.webp", "optimized/r3-wheel-ai.webp", "optimized/r3-pedals-ai.webp"):
    require(detail in r3, f"Missing R3 detail: {detail}")
for game in ("Juegos compatibles", "Assetto Corsa", "iRacing", "Project CARS 3", "Forza Horizon 5", "Euro Truck Simulator 2", "BeamNG.drive", "r3-game-list"):
    require(game in r3, f"Missing R3 compatibility game: {game}")
for detail in ("MOZA R5", "$675", "5,5 Nm", "1000 Hz", "Rotación infinita"):
    require(detail in r5, f"Missing R5 detail: {detail}")
for detail in ("MOZA R9", "$1.640", "9 Nm", "Volante CS V2P", "Pedales CRP2", "Solo disponible en kit"):
    require(detail in r9, f"Missing R9 kit detail: {detail}")
for detail in ("MOZA R12", "$1.820", "12 Nm", "NexGen 4.0", "Volante CS V2P", "Pedales CRP2", "Solo disponible en kit"):
    require(detail in r12, f"Missing R12 kit detail: {detail}")

if errors:
    print("Static page contract failed:")
    print("\n".join(f"- {e}" for e in errors))
    sys.exit(1)
print(f"PASS: static page contract ({len(PAGES)} pages)")
