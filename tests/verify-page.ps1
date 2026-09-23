$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
$required = @('index.html', 'productos.html', 'simulador-tripode.html', 'moza-r3.html', 'moza-r5.html', 'moza-r9-kit.html', 'moza-r12-kit.html', 'styles.css', 'script.js', 'favicon.svg', 'cover.png', 'sim racing.png', 'infografia soporte.png', 'simulador vuelo.png', '5dae82990e6d41dab0c886ad8da88529.mp4', 'tripode-pies.png', 'tripode-cockpit.png', 'tripode-volante.png', 'tripode-plegado.png', 'tripode-ajuste.png', 'r3-bundle.png', 'r3-base.png', 'r3-wheel.png', 'r3-pedals.png', 'r3-compatibility.png')
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

foreach ($token in @('#00B8F2', '#FFD400', '#075A9E', '#ED1C24')) {
  if ($css -notmatch [regex]::Escape($token)) { throw "Missing brand token $token" }
}
foreach ($asset in @('cover.png', 'infografia soporte.png', 'simulador vuelo.png', '5dae82990e6d41dab0c886ad8da88529.mp4')) {
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
foreach ($detail in @('youtube.com/embed/Qryc6QBhAPc', 'Placa para Volante Ajustable', 'Diseño Plegable', '522x831x815mm', '20kg (44lbs)', 'Marco Plegable', 'tripode-pies.png', 'tripode-cockpit.png', 'tripode-volante.png', 'tripode-plegado.png', 'tripode-ajuste.png')) {
  if ($tripod -notmatch [regex]::Escape($detail)) { throw "Missing tripod product detail: $detail" }
}
foreach ($link in @('moza-r3.html', 'moza-r5.html', 'moza-r9-kit.html', 'moza-r12-kit.html')) {
  if ($products -notmatch [regex]::Escape($link)) { throw "Missing MOZA catalog link: $link" }
}
foreach ($detail in @('MOZA R3', '$580', '3,9 Nm', 'Codificador de 15 bits', 'Direct Drive')) {
  if ($r3 -notmatch [regex]::Escape($detail)) { throw "Missing R3 technical detail: $detail" }
}
foreach ($detail in @('Compatible con PC y Xbox', 'Pedales SR-P Lite', '22 botones', '10 LED RGB de alto brillo', '1000 Hz', 'Abrazadera de mesa', 'r3-bundle.png', 'r3-base.png', 'r3-wheel.png', 'r3-pedals.png', 'r3-compatibility.png')) {
  if ($r3 -notmatch [regex]::Escape($detail)) { throw "Missing expanded R3 product detail: $detail" }
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
