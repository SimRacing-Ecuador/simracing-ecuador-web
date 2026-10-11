# Product hero cutouts and Logitech row hover — 2026-10-11

The R5, R9 and R12 hero images are new generated cutouts, distinct from the studio images retained below each hero. Generated with the built-in ImageGen tool from the inspected official product references recorded in [the original media notes](product-media-2026-10-11.md). They preserve the referenced physical revisions without adding revision claims to the catalogue.

## Delivered assets

- `optimized/moza-r5-hero-cutout-ai.webp`
- `optimized/moza-r9-hero-cutout-ai.webp`
- `optimized/moza-r12-hero-cutout-ai.webp`

All three keep native 1254 × 1254 resolution. PNG outputs were encoded as WebP at quality 92 without resizing, and each generated alpha channel was retained byte-for-byte. The original lower-page assets are unchanged.

The Logitech G29 row uses the existing catalogue hover class. Keyboard focus inside the row activates the same highlight. Both detail and availability actions stay legible on the highlighted background; the two destinations remain separate native links. The catalogue stylesheet URL is versioned so cached visitors receive the hover rules.

## Final prompts (built-in tool, transparent background enabled)

Validation: both repository suites pass, native size and original alpha are verified, and 28 responsive/motion browser checks pass across the four affected pages. Independent review identified a low-contrast keyboard focus outline on the new cyan G29 highlight; it was corrected to the existing ink token and checked for each separate link.

### r5_cutout

```text
Use case: product-mockup. Create a NEW original ultra-detailed photorealistic isolated product cutout for the Sim Racing Ecuador Night Telemetry website. The attached OFFICIAL manufacturer reference is solely for exact product identity and construction. Produce a DIFFERENT near-frontal composition: shaft pointing more toward the viewer, camera about 10 degrees above and 15 degrees to the side, predominantly showing the front with only a narrow side face. This must be a distinct fresh render, not the reference or an existing dark-floor photo with the backdrop removed. Preserve the exact housing geometry, proportions, fins, screws, mounting notches, quick-release shaft, model badge and genuine logos; no invented product features. Broad soft white studio lighting, crisp readable machined black aluminum and metal, restrained cyan edge highlights with a tiny warm-gold edge reflection matching the site's premium aesthetic. Single entire product centered, comfortably filling 75-80% of a square canvas, at least 10% safety on every edge. Highest available native resolution, razor-sharp clean edges. TRUE TRANSPARENT RGBA background, alpha zero everywhere outside the product silhouette. No background color, gradient, floor, platform, floor reflection, atmospheric haze, external shadow, checkerboard painted into image, outline, text overlay or watermark. No wheel, pedals, clamp, cables or accessories.
Subject: ONLY the MOZA R5 5.5Nm compact direct-drive wheelbase, same squat original shape in official reference, MOZA front logo and MOZA RACING on the side, gold checker emblem on the quick release. Do not add an R9/R12 badge.
```

### r9_cutout

```text
Use case: product-mockup. Create a NEW original ultra-detailed photorealistic isolated product cutout for the Sim Racing Ecuador Night Telemetry website. The attached OFFICIAL manufacturer reference is solely for exact product identity and construction. Produce a DIFFERENT near-frontal composition: shaft pointing more toward the viewer, camera about 10 degrees above and 15 degrees to the side, predominantly showing the front with only a narrow side face. This must be a distinct fresh render, not the reference or an existing dark-floor photo with the backdrop removed. Preserve the exact housing geometry, proportions, fins, screws, mounting notches, quick-release shaft, model badge and genuine logos; no invented product features. Broad soft white studio lighting, crisp readable machined black aluminum and metal, restrained cyan edge highlights with a tiny warm-gold edge reflection matching the site's premium aesthetic. Single entire product centered, comfortably filling 75-80% of a square canvas, at least 10% safety on every edge. Highest available native resolution, razor-sharp clean edges. TRUE TRANSPARENT RGBA background, alpha zero everywhere outside the product silhouette. No background color, gradient, floor, platform, floor reflection, atmospheric haze, external shadow, checkerboard painted into image, outline, text overlay or watermark. No wheel, pedals, clamp, cables or accessories.
Subject: ONLY exact MOZA R9 direct-drive wheelbase in the official reference (R9 V3 physical revision), original R9 V3 model badge, MOZA wordmark through the side cooling ribs and gold checkered quick-release emblem. Never substitute R5, R12 or R16.
```

### r12_cutout

```text
Use case: product-mockup. Create a NEW original ultra-detailed photorealistic isolated product cutout for the Sim Racing Ecuador Night Telemetry website. The attached OFFICIAL manufacturer reference is solely for exact product identity and construction. Produce a DIFFERENT near-frontal composition: shaft pointing more toward the viewer, camera about 10 degrees above and 15 degrees to the side, predominantly showing the front with only a narrow side face. This must be a distinct fresh render, not the reference or an existing dark-floor photo with the backdrop removed. Preserve the exact housing geometry, proportions, fins, screws, mounting notches, quick-release shaft, model badge and genuine logos; no invented product features. Broad soft white studio lighting, crisp readable machined black aluminum and metal, restrained cyan edge highlights with a tiny warm-gold edge reflection matching the site's premium aesthetic. Single entire product centered, comfortably filling 75-80% of a square canvas, at least 10% safety on every edge. Highest available native resolution, razor-sharp clean edges. TRUE TRANSPARENT RGBA background, alpha zero everywhere outside the product silhouette. No background color, gradient, floor, platform, floor reflection, atmospheric haze, external shadow, checkerboard painted into image, outline, text overlay or watermark. No wheel, pedals, clamp, cables or accessories.
Subject: ONLY exact MOZA R12 direct-drive wheelbase in the official reference (R12 V2 physical revision), original R12 V2 model badge, MOZA wordmark through the side cooling ribs and gold checkered quick-release emblem. Never substitute R5, R9 or R16.
```

