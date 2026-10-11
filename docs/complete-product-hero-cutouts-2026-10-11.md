# Complete product hero cutouts — 2026-10-11

Scope: replace only the hero image sources on the Logitech G29, MOZA R9 Kit and MOZA R12 Kit detail pages. The G29 image has its studio backdrop removed. Each MOZA kit hero now illustrates its own wheelbase, the CS V2P wheel and the CRP2 accelerator-and-brake set together. Existing layout, CSS, JavaScript, prices, visible copy and lower component photographs are preserved. The R3 already shows its complete bundle; the R5 sheet describes a wheelbase, so its existing hero is preserved.

## Official identity references

- Logitech G29: https://www.logitechg.com/en-us/shop/p/driving-force-racing-wheel
- R9 wheelbase: https://eu.mozaracing.com/es/products/r9-wheelbase
- R12 wheelbase: https://eu.mozaracing.com/es/products/r12-wheelbase
- CS V2P wheel: https://eu.mozaracing.com/es/products/cs-v2p-wheel
- CRP2 pedals: https://eu.mozaracing.com/es/products/crp2-pedals

References were checked on 2026-10-11. R9 and R12 images follow the current official family galleries, as in the preceding product media work; no hardware revision or optional clutch is added to the product copy.

## Saved assets and generation

Built-in ImageGen was used with `transparent_background: true`, one call per asset. The Logitech edit uses the preceding original generated image as its target. The two kit images use the official base, wheel and pedal photographs as identity references in new compositions. No official photographs are served by the new heroes. Generated illustrations are not labelled as manufacturer photographs or guaranteed copyright-free.

All three outputs retain their native 1254 × 1254 resolution and alpha channel, encoded to WebP at quality 94 without resizing or background editing. Original PNGs remain in Codex generated image storage.

| Page | Saved asset | Original generated PNG |
| --- | --- | --- |
| Logitech G29 | `optimized/logitech-g29-hero-cutout-ai.webp` | `exec-ab9f7d2e-aecc-4361-b02b-658e7d829f4e.png` |
| MOZA R9 Kit | `optimized/moza-r9-kit-hero-cutout-ai.webp` | `exec-1bd9d263-4d70-4635-8dd1-3d0454ae3ea7.png` |
| MOZA R12 Kit | `optimized/moza-r12-kit-hero-cutout-ai.webp` | `exec-81209762-5bf1-4327-b2b3-4b3485ceb15a.png` |

## Final prompts

### g29

```text
Use case: background-extraction. Asset type: transparent cutout for the existing Logitech G29 hero on the Sim Racing Ecuador website. Input image 1 is the edit target, an original generated product illustration already in the website. Remove the entire navy background, floor, floor reflections and floor shadow. Preserve the actual Logitech G29 wheel WITH ITS INTEGRATED BLACK BASE and the complete three-pedal unit exactly as shown, including the blue top stripe, stitched leather, brushed metal spokes, PlayStation face controls, red selector dial, silver shifter paddles and every original product edge. Preserve lighting, materials, angle and component identity. The transparent area must extend inside all wheel openings and the spaces around the pedals. Do not redraw, replace, invent, recolor or simplify the hardware. Reposition the whole cutout uniformly to the center of a square canvas, leaving 9% safe transparent margin on every side so no edge is clipped. Hardware should fill roughly 82% of the canvas width. Output highest available native resolution, razor-sharp clean edges and genuinely transparent RGBA alpha, no floor, no background color, no fake checkerboard, no glow, no typography or watermark. This will be displayed over the website's existing dark navy and cyan product stage.
```

### r9

```text
Use case: product-mockup / compositing. Asset type: a NEW original ultra-detailed transparent product illustration of the complete MOZA R9 Kit for Sim Racing Ecuador. Input image 1: official MOZA R9 wheelbase, identity reference. Input image 2: official MOZA CS V2P steering wheel, identity reference. Input image 3: official MOZA CRP2 accelerator-and-brake set, identity reference. Show ALL THREE exact components together in ONE cohesive square hero illustration with a genuinely transparent RGBA background. Layout: CS V2P wheel upright and mostly front-facing at upper left, R9 base detached at upper right in a three-quarter angle with its original protruding quick release, CRP2 two-pedal unit below in a slightly elevated front three-quarter view. Arrange compactly with consistent perspective and realistic relative scale, all three components large and clearly identifiable without overlapping their important details. Each component fully visible, no cropping, 8% outer safety margin. Exact R9 angular black metal casing, horizontal cooling fins, MOZA side lettering and original front geometry. Exact CS V2P round black leather rim, white top stripe, three black metal spokes, original six round push buttons, two rotary controls, two mini controls, MOZA center and RGB LED strip; no screen and no ES wheel substitutions. Exact CRP2 set: TWO black honeycomb carbon-fiber pedal plates, shorter wider brake on left, taller accelerator on right, original black aluminum bracket construction and mounting tray, pale gold cylinders behind and original pale gold stripe/checker details. No clutch, no third pedal, no SR-P plates, no cockpit or extra accessories. Premium original studio render with broad soft neutral key lighting, restrained electric-cyan edge light and a small warm yellow edge reflection matching the Night Telemetry site. Preserve black metal, leather and carbon fiber with readable physical detail. Transparent empty space inside the wheel and between all parts; no floor, backdrop, rectangle, haze, smoke or painted checkerboard. Highest available native resolution. No text overlays, numbers, decorative labels or watermark. Product identity must remain faithful to official references, while camera, layout and lighting form a new composition.
```

### r12

```text
Use case: product-mockup / compositing. Asset type: a NEW original ultra-detailed transparent product illustration of the complete MOZA R12 Kit for Sim Racing Ecuador. Input image 1: official MOZA R12 wheelbase, identity reference. Input image 2: official MOZA CS V2P steering wheel, identity reference. Input image 3: official MOZA CRP2 accelerator-and-brake set, identity reference. Show ALL THREE exact components together in ONE cohesive square hero illustration with a genuinely transparent RGBA background. Layout: CS V2P wheel upright and mostly front-facing at upper left, R12 base detached at upper right in a three-quarter angle with its original protruding quick release, CRP2 two-pedal unit below in a slightly elevated front three-quarter view. Arrange compactly with consistent perspective and realistic relative scale, all three components large and clearly identifiable without overlapping their important details. Each component fully visible, no cropping, 8% outer safety margin. Exact R12 angular black metal casing with its longer body, horizontal cooling fins, MOZA side lettering and original front geometry; use the R12 reference, never substitute the smaller R9 body. Exact CS V2P round black leather rim, white top stripe, three black metal spokes, original six round push buttons, two rotary controls, two mini controls, MOZA center and RGB LED strip; no screen and no ES wheel substitutions. Exact CRP2 set: TWO black honeycomb carbon-fiber pedal plates, shorter wider brake on left, taller accelerator on right, original black aluminum bracket construction and mounting tray, pale gold cylinders behind and original pale gold stripe/checker details. No clutch, no third pedal, no SR-P plates, no cockpit or extra accessories. Premium original studio render with broad soft neutral key lighting, restrained electric-cyan edge light and a small warm yellow edge reflection matching the Night Telemetry site. Preserve black metal, leather and carbon fiber with readable physical detail. Transparent empty space inside the wheel and between all parts; no floor, backdrop, rectangle, haze, smoke or painted checkerboard. Highest available native resolution. No text overlays, numbers, decorative labels or watermark. Product identity must remain faithful to official references, while camera, layout and lighting form a new composition.
```

