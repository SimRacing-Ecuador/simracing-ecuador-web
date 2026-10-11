# Product media and Logitech G29 sources — 2026-10-11

Scope: add generated product illustrations to the existing detail sheets and a G29 detail sheet linked from its unchanged catalogue row. Prices, existing copy, navigation, animations and design tokens remain intact. The catalogue names MOZA R12 Kit; “R2” in the request is interpreted as R12.

## Official references

- Logitech G29 specifications and reference gallery: https://www.logitechg.com/es-es/shop/p/driving-force-racing-wheel and https://www.logitechg.com/en-us/products/driving/driving-force-racing-wheel.html
- MOZA R5 base: official R5 bundle gallery, https://mozaracing.com/products/r5-racing-bundle (image `R5-Base-Update_0829_converted.png`). Only the base is illustrated because the existing local R5 sheet describes a base and does not specify a wheel or pedals.
- MOZA R9 base: https://eu.mozaracing.com/es/products/r9-wheelbase (official R9 V3 gallery).
- MOZA R12 base: https://eu.mozaracing.com/es/products/r12-wheelbase (official R12 V2 gallery).
- CS V2P steering wheel: https://eu.mozaracing.com/es/products/cs-v2p-wheel
- CRP2 pedals: https://eu.mozaracing.com/es/products/crp2-pedals (official brake-and-throttle set; optional clutch is not depicted).

The catalogue does not specify hardware revisions for R9 and R12. The images follow the current official family galleries; no revision, price, warranty or additional kit component is asserted in the site copy. Brand/product design rights remain with their respective manufacturers. Generated illustrations are not labelled as official manufacturer photographs or guaranteed copyright-free.

## Delivery

Generated with the built-in ImageGen tool from the official product references. Six selected images are saved in `optimized/`: `logitech-g29-ai.webp`, `moza-r5-base-ai.webp`, `moza-r9-base-ai.webp`, `moza-r12-base-ai.webp`, `moza-cs-v2p-wheel-ai.webp`, `moza-crp2-pedals-ai.webp`. Each keeps the native 1254 × 1254 resolution, encoded to WebP at quality 92 without upscaling. The original PNGs remain in Codex generated image storage. A first G29 variant was rejected because the pedal platform was cropped.

## Final prompt set

### cs-v2p

```text
Use case: product-mockup. Asset type: original high-resolution photorealistic product illustration for Sim Racing Ecuador, Night Telemetry website. Use the supplied official image ONLY as a product identity reference. Generate a NEW studio photograph-like render with its own composition, perspective, materials and lighting; do not reuse the official photo or add text overlays. Preserve exact physical shape, construction, controls and model identity. Backdrop: seamless extremely dark navy #05080D to #0A1019, dark matte floor, subtle soft electric-cyan rim light, restrained warm yellow highlight on one edge, broad soft white key light so every control and material remains clearly readable. Premium advertising quality, razor-sharp hardware detail, believable metal/leather, no glow obscuring the product, no dramatic smoke, no extra objects, no platform, no invented screens or accessories, no watermarks, no decorative graphics. Square composition, entire subject centered and fully visible with generous 12% safe margin, hardware occupies 70-75% image, high resolution 2048x2048 or better. Real manufacturer marks already on the product are permitted, no additional branding.
Subject: ONLY exact MOZA CS V2P detachable round steering wheel, mostly front facing with a very slight three-quarter angle to reveal its original carbon fiber rear paddles. Preserve full circular black leather rim, white top alignment stripe, three black metal spokes, round MOZA center, exact six mechanical round face buttons, two black thumb rotary dials and two black four-way mini-controls from the reference, ten RGB LEDs across top faceplate. Do not add extra buttons, switches, displays, base, ES controls, RS wheel features or pedals.
```

### crp2

```text
Use case: product-mockup. Asset type: original high-resolution photorealistic product illustration for Sim Racing Ecuador, Night Telemetry website. Use the supplied official image ONLY as a product identity reference. Generate a NEW studio photograph-like render with its own composition, perspective, materials and lighting; do not reuse the official photo or add text overlays. Preserve exact physical shape, construction, controls and model identity. Backdrop: seamless extremely dark navy #05080D to #0A1019, dark matte floor, subtle soft electric-cyan rim light, restrained warm yellow highlight on one edge, broad soft white key light so every control and material remains clearly readable. Premium advertising quality, razor-sharp hardware detail, believable metal/leather, no glow obscuring the product, no dramatic smoke, no extra objects, no platform, no invented screens or accessories, no watermarks, no decorative graphics. Square composition, entire subject centered and fully visible with generous 12% safe margin, hardware occupies 70-75% image, high resolution 2048x2048 or better. Real manufacturer marks already on the product are permitted, no additional branding.
Subject: ONLY exact MOZA CRP2 original two-pedal accelerator-and-brake set, mounted on its original black aluminum baseplate, in a new three-quarter studio view. Preserve exactly TWO pedals with honeycomb-textured black rectangular carbon-fiber faceplates (left shorter/wider brake and right taller throttle), CNC black arms and open brackets, pale gold horizontal cylinders behind pedals, original metal mounting platform and carbon-fiber heel-rest. Preserve the small pale gold racing stripe/checkers as in original. No clutch, no third pedal, no silver perforated SR-P plates, no invented mechanisms.
```

### r5

```text
Use case: product-mockup. Create a NEW original premium studio product illustration matching Night Telemetry, based on official input solely for exact product identity. Seamless dark navy #05080D backdrop, matte black floor, soft white key lighting, subtle cyan rim light and very restrained warm yellow edge highlight. Photorealistic high-detail aluminum, leather and metal, readable product construction; new composition and lighting, do not reuse reference photo. Square highest available native resolution. Entire product clearly inside frame with at least 15% safe space from ALL edges, centered, no cropping. Product occupies at most 70% width. No text overlay, watermark, smoke, extra accessory, screen, cables, stage or human. Preserve exact industrial design, proportion, screws, shaft, fins and real manufacturer logo.
Subject: ONLY MOZA R5 5.5Nm compact direct-drive wheelbase. Preserve original squat black housing, top and side cooling fins, MOZA front wordmark, MOZA RACING low on side and cylindrical quick release with gold checker emblem. Keep short original housing proportions. No wheel, pedals, clamp, R9/R12 model badge or added buttons.
```

### r9

```text
Use case: product-mockup. Create a NEW original premium studio product illustration matching Night Telemetry, based on official input solely for exact product identity. Seamless dark navy #05080D backdrop, matte black floor, soft white key lighting, subtle cyan rim light and very restrained warm yellow edge highlight. Photorealistic high-detail aluminum, leather and metal, readable product construction; new composition and lighting, do not reuse reference photo. Square highest available native resolution. Entire product clearly inside frame with at least 15% safe space from ALL edges, centered, no cropping. Product occupies at most 70% width. No text overlay, watermark, smoke, extra accessory, screen, cables, stage or human. Preserve exact industrial design, proportion, screws, shaft, fins and real manufacturer logo.
Subject: ONLY MOZA R9 direct-drive wheelbase. Preserve the exact black aluminum housing, top and horizontal side cooling ribs, MOZA wordmark through ribs, quick-release shaft with gold checkered emblem, original R9 model badge visible. New three-quarter perspective. Do not change it to R5, R12, R16 or include steering wheel/pedals.
```

### r12

```text
Use case: product-mockup. Create a NEW original premium studio product illustration matching Night Telemetry, based on official input solely for exact product identity. Seamless dark navy #05080D backdrop, matte black floor, soft white key lighting, subtle cyan rim light and very restrained warm yellow edge highlight. Photorealistic high-detail aluminum, leather and metal, readable product construction; new composition and lighting, do not reuse reference photo. Square highest available native resolution. Entire product clearly inside frame with at least 15% safe space from ALL edges, centered, no cropping. Product occupies at most 70% width. No text overlay, watermark, smoke, extra accessory, screen, cables, stage or human. Preserve exact industrial design, proportion, screws, shaft, fins and real manufacturer logo.
Subject: ONLY MOZA R12 direct-drive wheelbase. Preserve exact original black aluminum case proportions, top/side cooling fins, silver MOZA side wordmark, MOZA front branding, original R12 model badge and quick-release shaft with gold checkered emblem. New three-quarter perspective. Never R5/R9/R16. No wheel or pedals.
```

### g29-v2

```text
Use case: product-mockup. Create a NEW original premium studio product illustration matching Night Telemetry, based on official input solely for exact product identity. Seamless dark navy #05080D backdrop, matte black floor, soft white key lighting, subtle cyan rim light and very restrained warm yellow edge highlight. Photorealistic high-detail aluminum, leather and metal, readable product construction; new composition and lighting, do not reuse reference photo. Square highest available native resolution. Entire product clearly inside frame with at least 15% safe space from ALL edges, centered, no cropping. Product occupies at most 70% width. No text overlay, watermark, smoke, extra accessory, screen, cables, stage or human. Preserve exact industrial design, proportion, screws, shaft, fins and real manufacturer logo.
Subject: Exact Logitech G29 Driving Force PlayStation wheel with its own base and ORIGINAL THREE-PEDAL unit beside it. Wider shot than reference: BOTH entire objects must fit inside image, pedal platform fully visible and at least 12% empty space at left/right edges. Original round leather rim with blue top stripe, brushed-metal spokes, PS center emblem, D-pad, original PS symbol buttons, RGB LED rev row, metal paddle shifters, red selector wheel, plus/minus rocker. Preserve four blue keys and spell exactly: upper left 'L2', lower left 'L3', upper right 'R2', lower right 'R3'. Do not invent L9, controls or extras. Three original silver perforated pedals. No separate shifter. Product occupies maximum 75% of canvas width, fully visible.
```


## Validation

- Static page contract: passes for all 9 pages, including the new G29 sheet.
- Security audit: passes for 9 HTML pages and 2 JavaScript files.
- Browser verification: 29 successful checks across the five affected pages at 360, 390, 768, 960 and 1440 px, including both enabled and reduced motion. No image decode failures, horizontal overflow, duplicate IDs or JavaScript exceptions.
- Visible copy in all four modified existing HTML pages is identical to the baseline, including all commercial prices and specifications.
- Visual inspection: G29 desktop/mobile, R5 specification image, and R9/R12 component cards; hardware stays fully in-frame and text remains legible.
- Independent review completed; its minor G29 back-to-top finding was fixed and verified in the browser (target exists, scroll returns to the top, no broken local anchors).
