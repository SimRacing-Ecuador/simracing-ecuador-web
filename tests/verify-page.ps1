$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$required = @('index.html', 'productos.html', 'simulador-tripode.html', 'moza-r3.html', 'moza-r5.html', 'moza-r9-kit.html', 'moza-r12-kit.html', 'styles.css', 'script.js', 'favicon.svg', 'cover.png', 'sim racing.png', 'infografia soporte.png', 'simulador vuelo.png', '5dae82990e6d41dab0c886ad8da88529.mp4', 'tripode-pies.png', 'tripode-cockpit.png', 'tripode-volante.png', 'tripode-plegado.png', 'tripode-ajuste.png', 'r3-bundle.png', 'r3-base.png', 'r3-wheel.png', 'r3-pedals.png')
$missing = @($required | Where-Object { -not (Test-Path (Join-Path $root $_)) })
if ($missing.Count -gt 0) { throw "Missing required files: $($missing -join ', ')" }

$html = Get-Content -Raw (Join-Path $root 'index.html')
$products = Get-Content -Raw (Join-Path $root 'productos.html')
$tripod = Get-Content -Raw (Join-Path $root 'simulador-tripode.html')
$r3 = Get-Content -Raw (Join-Path $root 'moza-r3.html')
$r5 = Get-Content -Raw (Join-Path $root 'moza-r5.html')
$r9 = Get-Content -Raw (Join-Path $root 'moza-r9-kit.html')
$r12 = Get-Content -Raw (Join-Path $root 'moza-r12-kit.html')
$css = Get-Content -Raw (Join-Path $root 'styles.css')
$js = Get-Content -Raw (Join-Path $root 'script.js')
$htmlPages = Get-ChildItem -Path $root -Filter '*.html' -File

foreach ($page in $htmlPages) {
  $pageMarkup = Get-Content -Raw $page.FullName
  if ($pageMarkup -notmatch 'viewport-fit=cover') { throw "Missing safe-area viewport on $($page.Name)" }
}

foreach ($token in @('#00B8F2', '#FFD400', '#075A9E', '#ED1C24')) {
  if ($css -notmatch [regex]::Escape($token)) { throw "Missing brand token $token" }
}
foreach ($asset in @('optimized/cover-ai.png', 'optimized/infografia-soporte-ai.png', 'optimized/simulador-vuelo-ai.png', '5dae82990e6d41dab0c886ad8da88529.mp4')) {
  if ($html -notmatch [regex]::Escape($asset)) { throw "Asset is not referenced: $asset" }
}
foreach ($section in @('inicio', 'setups', 'productos', 'soporte', 'comunidad')) {
  if ($html -notmatch ('id="' + $section + '"')) { throw "Missing section id $section" }
}
foreach ($category in @('Volantes y pedales', 'Cockpits', 'Accesorios')) {
  if ($html -notmatch [regex]::Escape($category)) { throw "Missing home product category: $category" }
}
foreach ($categoryLink in @('productos.html#volantes-pedales', 'productos.html#cockpits', 'productos.html#accesorios')) {
  if ($html -notmatch [regex]::Escape($categoryLink)) { throw "Missing home category link: $categoryLink" }
}
if ($html -match 'Bundle MOZA R3 con base direct drive') { throw 'Home page must not feature MOZA R3 as a direct product card' }
foreach ($hook in @('race-nav', 'event-band', 'about-section', 'choice-media')) {
  if ($html -notmatch ('class="[^"]*' + $hook)) { throw "Missing reference-inspired hook $hook" }
}
if ($html -notmatch 'aria-expanded') { throw 'Mobile menu must expose aria-expanded' }
if ($html -notmatch 'alt=') { throw 'Images must have alt text' }
if ($js -notmatch 'menu-toggle') { throw 'Menu script hook is missing' }
foreach ($motionHook in @('IntersectionObserver', 'dataset.motion', 'motion-ready', 'is-visible')) {
  if ($js -notmatch [regex]::Escape($motionHook)) { throw "Missing scroll motion hook in script: $motionHook" }
}
foreach ($cinematicHook in @('scrollDirection', 'requestAnimationFrame', 'scroll-parallax', 'hero')) {
  if ($js -notmatch [regex]::Escape($cinematicHook)) { throw "Missing cinematic motion hook in script: $cinematicHook" }
}
foreach ($coverageHook in @('main > section > .shell > *', 'main article', 'main figure', 'main li', 'toggleMotionVisibility', 'scroll-velocity', 'dataset.kinetic')) {
  if ($js -notmatch [regex]::Escape($coverageHook)) { throw "Missing motion coverage hook: $coverageHook" }
}
foreach ($imageMotionHook in @('imageMotionTargets', 'dataset.scrollImage', "querySelectorAll('img')", 'image-depth')) {
  if ($js -notmatch [regex]::Escape($imageMotionHook)) { throw "Missing image motion hook: $imageMotionHook" }
}
foreach ($motionStyle in @('motion-ready', 'prefers-reduced-motion', 'data-motion')) {
  if ($css -notmatch [regex]::Escape($motionStyle)) { throw "Missing scroll motion style: $motionStyle" }
}
foreach ($imageMotionStyle in @('img[data-scroll-image]', '--image-depth', 'will-change: transform')) {
  if ($css -notmatch [regex]::Escape($imageMotionStyle)) { throw "Missing image motion style: $imageMotionStyle" }
}
foreach ($responsiveStyle in @('overflow-x: clip', 'env(safe-area-inset-left', 'env(safe-area-inset-right', 'min-width: 0', 'pointer: coarse', 'visibility: hidden')) {
  if ($css -notmatch [regex]::Escape($responsiveStyle)) { throw "Missing responsive safeguard: $responsiveStyle" }
}
foreach ($responsiveHook in @('aria-hidden', 'matchMedia.*max-width: 680px', 'js-ready')) {
  if ($js -notmatch $responsiveHook) { throw "Missing responsive navigation hook: $responsiveHook" }
}
foreach ($page in $htmlPages) {
  $pageMarkup = Get-Content -Raw $page.FullName
  $imageTags = [regex]::Matches($pageMarkup, '<img\b[^>]*>')
  foreach ($imageTag in $imageTags) {
    if ($imageTag.Value -notmatch 'decoding="async"') { throw "Image is missing async decoding on $($page.Name): $($imageTag.Value)" }
    if ($imageTag.Value -notmatch 'loading="(?:eager|lazy)"') { throw "Image is missing an explicit loading mode on $($page.Name): $($imageTag.Value)" }
  }
}
$homeVideo = [regex]::Match($html, '<video\b[^>]*>[\s\S]*?</video>').Value
if ($homeVideo -notmatch 'preload="none"') { throw 'Hero video must start poster-first with preload="none"' }
if ($homeVideo -notmatch 'data-src="5dae82990e6d41dab0c886ad8da88529\.mp4"') { throw 'Hero video source must be deferred with data-src' }
foreach ($asyncHook in @('requestIdleCallback', 'loadHeroVideo', 'parallaxVisibilityObserver', 'visibleParallaxTargets')) {
  if ($js -notmatch [regex]::Escape($asyncHook)) { throw "Missing async performance hook: $asyncHook" }
}
if ($js -notmatch '\.load\(\)') { throw 'Hero video loader must call video.load() after assigning the deferred source' }
foreach ($cinematicStyle in @('clip-path', '--scroll-parallax', 'data-scroll-direction', 'data-motion="hero"')) {
  if ($css -notmatch [regex]::Escape($cinematicStyle)) { throw "Missing cinematic motion style: $cinematicStyle" }
}
foreach ($longMotionStyle in @('--motion-y: 72px', '--motion-x: 78px', 'transition-duration: 1120ms', 'hero-enter 1100ms', 'calc(var(--motion-velocity) * .26)')) {
  if ($css -notmatch [regex]::Escape($longMotionStyle)) { throw "Missing extended motion style: $longMotionStyle" }
}
foreach ($kineticStyle in @('data-kinetic', 'scroll-velocity', 'perspective', 'rotateZ')) {
  if ($css -notmatch [regex]::Escape($kineticStyle)) { throw "Missing kinetic motion style: $kineticStyle" }
}
if ($html -notmatch 'href="productos.html"') { throw 'Main navigation must link to the products page' }
foreach ($product in @('Simulador tipo trípode', 'Logitech G29', 'MOZA R3', 'MOZA R5', 'MOZA R9', 'MOZA R12')) {
  if ($products -notmatch [regex]::Escape($product)) { throw "Missing catalog product: $product" }
}
if ($products -match 'LRS13-BS01') { throw 'Removed cockpit LRS13-BS01 is still listed in the catalog' }
foreach ($catalogSection in @('id="cockpits"', 'id="volantes-pedales"', 'id="accesorios"')) {
  if ($products -notmatch [regex]::Escape($catalogSection)) { throw "Missing catalog category section: $catalogSection" }
}
foreach ($catalogPreview in @('Cockpit con silla', 'Simulador tipo trípode', 'Mods y pistas de madera', 'Logitech G29', 'MOZA R3', 'MOZA R5', 'MOZA R9 Kit', 'MOZA R12 Kit')) {
  if ($products -notmatch [regex]::Escape($catalogPreview)) { throw "Missing catalog preview: $catalogPreview" }
}
if ($products -notmatch 'href="simulador-tripode.html"') { throw 'Cockpit must link to its product page' }
if ($products -notmatch 'control-row-link" href="moza-r3.html"') { throw 'MOZA R3 must open its own detail page from the catalog row' }
foreach ($detail in @('youtube.com/embed/Qryc6QBhAPc', 'Placa para Volante Ajustable', 'Diseño Plegable', '522x831x815mm', '20kg (44lbs)', 'Marco Plegable', 'optimized/tripode-pies-ai.png', 'optimized/tripode-cockpit-ai.png', 'optimized/tripode-volante.jpg', 'optimized/tripode-plegado-ai.png', 'optimized/tripode-ajuste-ai.png')) {
  if ($tripod -notmatch [regex]::Escape($detail)) { throw "Missing tripod product detail: $detail" }
}
foreach ($link in @('moza-r3.html', 'moza-r5.html', 'moza-r9-kit.html', 'moza-r12-kit.html')) {
  if ($products -notmatch [regex]::Escape($link)) { throw "Missing MOZA catalog link: $link" }
}
foreach ($detail in @('MOZA R3', '$580', '3,9 Nm', 'Codificador de 15 bits', 'Direct Drive')) {
  if ($r3 -notmatch [regex]::Escape($detail)) { throw "Missing R3 technical detail: $detail" }
}
foreach ($detail in @('Compatible con PC y Xbox', 'Pedales SR-P Lite', '22 botones', '10 LED RGB de alto brillo', '1000 Hz', 'Abrazadera de mesa', 'optimized/r3-bundle-ai.png', 'optimized/r3-base-ai.png', 'optimized/r3-wheel-ai.png', 'optimized/r3-pedals-ai.png')) {
  if ($r3 -notmatch [regex]::Escape($detail)) { throw "Missing expanded R3 product detail: $detail" }
}
foreach ($game in @('Juegos compatibles', 'Assetto Corsa', 'iRacing', 'Project CARS 3', 'Forza Horizon 5', 'Euro Truck Simulator 2', 'BeamNG.drive', 'r3-game-list')) {
  if ($r3 -notmatch [regex]::Escape($game)) { throw "Missing R3 compatibility game: $game" }
}
foreach ($detail in @('MOZA R5', '$675', '5,5 Nm', '1000 Hz', 'Rotación infinita')) {
  if ($r5 -notmatch [regex]::Escape($detail)) { throw "Missing R5 technical detail: $detail" }
}
foreach ($detail in @('MOZA R9 Kit', '$1.640', '9 Nm', 'Volante CS V2P', 'Pedales CRP2', 'Solo disponible en kit')) {
  if ($r9 -notmatch [regex]::Escape($detail)) { throw "Missing R9 kit detail: $detail" }
}
foreach ($detail in @('MOZA R12 Kit', '$1.820', '12 Nm', 'NexGen 4.0', 'Volante CS V2P', 'Pedales CRP2', 'Solo disponible en kit')) {
  if ($r12 -notmatch [regex]::Escape($detail)) { throw "Missing R12 kit detail: $detail" }
}
foreach ($price in @('$580', '$675', '$1.640', '$1.820')) {
  if ($products -notmatch [regex]::Escape($price)) { throw "Missing catalog price: $price" }
}
foreach ($kitPart in @('CS V2P', 'CRP2', 'Solo disponible en kit')) {
  if ($products -notmatch [regex]::Escape($kitPart)) { throw "Missing kit detail: $kitPart" }
}
Write-Output 'PASS: static page contract'
