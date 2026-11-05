# Search and Measurement Completion Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Complete image discovery, preserve measurable AI referrals, and verify the existing production integration.
**Architecture:** Extend the existing dependency-free generator and consent-gated client; retain the existing Google properties and Cloudflare Pages hosting.
**Tech Stack:** Static HTML, vanilla JS, Python standard library, Node built-in assertions.
**Spec:** ../specs/2026-11-05-search-measurement-completion.md

## Global Constraints

- Keep GA4 G-Q6H1XX68P2 and existing verification; do not fabricate account state.
- No tracking before consent; no free text, full external URLs or personal query data.
- Only inventory images already present in the visible page enter the sitemap.
- Preserve the original checkout, visual identity and commercial data.

## Review Focus

- AI source URLs can contain private conversation IDs: send origin only.
- A lookalike hostname must never pass the allowlist.
- Unapproved campaign values must remain excluded after adding legitimate AI sources.
- Sitemap image tags must not be mistaken for page loc entries.
- Public HTTP checks cannot demonstrate property ownership or receipt of events.

### Task 1: Preserve approved AI attribution

Files: analytics.js, measurement-config.js, tests/verify_analytics.js.
- [x] Extend the VM boundary fixture with configurable referrer and production config; add assertions for approved AI origins, spoofed hosts, missing referrer with approved UTM and unknown/personal queries.
- [x] Run node tests/verify_analytics.js; observe the missing attribution failure.
- [x] Add six exact assistant/search referrer origins and five matching campaign sources; preserve existing Google/social sources and consent behavior.
- [x] Run the analytics suite and all existing checks.

### Task 2: Discover actual catalogue images

Files: tools/generate_seo.py, sitemap.xml, tests/verify_seo.py.
- [x] Add independent assertions that product/home sitemap images match real inventory assets visible in HTML; only sitemap-namespace loc nodes count as pages.
- [x] Run python3 tests/verify_seo.py; observe missing image discovery.
- [x] Generate one image entry for each indexable inventory image shown on its page; keep privacy out of image discovery and omit fabricated lastmod.
- [x] Regenerate and run the full suite; prove generator idempotence.

### Task 3: Verify production and document console completion

Files: docs/seo/auditoria-2026-11-05.md, docs/seo/production-verification-2026-11-05.json, README.md.
- [x] Fetch production pages, scripts, sitemap, robots, redirects, representative images and real 404s without executing analytics.
- [x] Record current results, limits and exact remaining account settings with property IDs and official sources; include GA4 custom dimensions, channel grouping, reports and Search Console linking steps.
- [x] Review changes independently, run required checks, push a reviewable PR using the existing repository and hosting workflow.
- [ ] Verify publication if integrated; keep external console tasks explicitly pending until observed.

Deployment ruling: Cloudflare served stale unversioned measurement scripts after the first successful deploy. Add content-derived script URL versions, verify the same-run catalogue hash and recheck the exact URLs present in production HTML. Console access remains pending due to native-control timeouts.
