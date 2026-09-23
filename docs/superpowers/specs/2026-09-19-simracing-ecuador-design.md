# SimRacing Ecuador Landing Page Design

## Goal

Create a single-page, responsive experience that presents Sim Racing Ecuador as a local destination for discovering, choosing, and upgrading racing simulation equipment. Its composition should borrow the sports-event rhythm of the supplied Corredo reference: light masthead, colored navigation, dominant hero, dark update band, image-led cards, and an editorial information section.

## Audience and success criteria

The page is aimed at people in Ecuador who are curious about sim racing, are comparing equipment, or are ready to assemble a setup. A successful first version should make the brand immediately recognizable, communicate an energetic premium tone, show the supplied products clearly, and give the visitor an obvious path to explore setups or request information.

## Visual direction

Use the supplied Sim Racing Ecuador logo as the primary identity anchor. The palette is derived from the logo and used consistently:

- Ink: `#05080D` for the primary background.
- White: `#F7F9FC` for the logo, headings, and high-contrast copy.
- Electric blue: `#00B8F2` for actions, rules, glows, and active states.
- Ecuador yellow: `#FFD400` for local identity accents and highlights.
- Deep blue: `#075A9E` for secondary surfaces and depth.
- Racing red: `#ED1C24` for small urgency and energy accents.

The page uses a technical, high-contrast sans-serif system stack. Headings are compact and heavy; body copy stays readable and restrained. Product imagery carries most of the detail, so decoration is limited to grid lines, angled panels, gradients, and small telemetry-inspired labels.

## Content structure

1. Sticky header with the logo, anchor links for Inicio, Setups, Productos, Soporte, and a primary “Arma tu setup” action.
2. Hero with the supplied MP4 as a muted looping background, a dark readability overlay, a local headline, supporting text, and two anchor actions.
3. Three setup paths: empezar, mejorar, and competir. These are guidance cards, not claims about inventory or pricing.
4. Featured product split section using `cover.png`, with the MOZA R3 bundle as the visual focus and a short benefit list. Specific commercial details remain framed as product information from the supplied artwork rather than invented catalog data.
5. Cockpit support section using `infografia soporte.png`, explaining that the visitor can turn a room into a dedicated driving space.
6. Technology strip with direct drive, precision, pedal feel, and compatibility language. It is educational copy and avoids unverified specifications.
7. Community and next-step CTA that invites the visitor to share or request a setup recommendation.
8. Secondary “También volamos” section using `simulador vuelo.png` so the available flight-sim asset has a deliberate place without competing with the main racing message.
9. Footer with logo, navigation anchors, and neutral placeholder contact labels that can be connected to real channels later.

## Interactions

- Anchor links scroll smoothly to sections.
- The mobile menu opens and closes from the header and closes after a navigation choice.
- CTA buttons remain usable with keyboard focus and touch input.
- The background video is muted, loops, and does not prevent the content from being read if video playback is unavailable.

## Responsiveness and accessibility

Use a fluid container with a desktop two-column composition that collapses to one column below approximately 760px. Preserve side gutters on narrow screens. Provide meaningful alt text for supplied images, a text fallback for the video, visible focus states, semantic landmarks, sufficient color contrast, and respect `prefers-reduced-motion` by disabling smooth scrolling and pausing the background video.

## Technical scope

The first version is a static site in the existing folder. Create focused files for the page, styles, interaction script, and favicon. Keep the supplied media files in place and reference them with relative paths. Do not add external fonts, frameworks, remote images, or analytics. No checkout, account system, inventory database, or real contact endpoint is included in this pass.

## Validation

Verify the page locally at desktop and mobile widths, confirm that every supplied asset resolves, check keyboard navigation and the mobile menu, and inspect that no text overlays become unreadable on the video or product artwork. Validate that the HTML has a title, description, landmarks, image alt text, and a favicon.
