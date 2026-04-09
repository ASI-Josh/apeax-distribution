---
title: APEAX Australia — Brand Decisions (Locked)
version: 1.0
date: 2026-04-09
owner: Josh Hyde (Director)
decided-with: CVS (Claude Code)
status: LOCKED — do not re-litigate without explicit Director approval
---

# APEAX Australia — Brand Decisions

This file is the **single source of truth** for the APEAX Australia brand
system as it applies to apeax.com.au. It supersedes any provisional values
in `01-BRAND-SYSTEM.md` or inline defaults in `_shared.css`.

CIPHER and any future agent working on the site must read this file before
changing anything in `_shared.css`, `public/assets/brand/`, or any
visual token.

---

## 1. The brand is monochrome inverse-pair

The APEAX visual identity is a **monochrome system with two opposite
states**. There is no chromatic accent colour. The same solid logo is
rendered in dark-on-light (`#1E2531` on white) or light-on-dark (pure
white on `#0B0F18`) depending on the context. These are the same mark,
not two separate variants.

The energy comes from:

- Photography — product renders on Porsche, Irizar, Volvo, Marcopolo,
  skyscrapers, yachts. The photography does all the chromatic work.
- Weighty display type against generous negative space
- Pure light vs pure dark, no half-tones at brand-token level
- The solid geometric logo (triangle + wordmark) as a constant anchor

### Two states, opposing:

| State       | Background | Foreground | Use case                                    |
|-------------|------------|------------|---------------------------------------------|
| **Dark**    | `#0B0F18`  | `#FFFFFF`  | Landing gate, heroes, trade login panel     |
| **Light**   | `#FFFFFF`  | `#1E2531`  | Product pages, forms, footer, docs          |

Both states ship. A single page may switch states between sections (e.g.
landing gate hero is dark; category strip below is light).

### DO NOT introduce:

- Cyan, amber, teal, or any other provisional colour from the initial
  `_shared.css` placeholder
- A "signal colour" for CTAs, hovers, focus rings — those use the inverse
  state's foreground colour at 100% or 60% opacity
- Tailwind-style 11-step colour scales
- Gradients on brand elements (gradients on photography are fine)

---

## 2. Token specification

### Core tokens

```css
:root {
  /* Monochrome primaries */
  --apx-dark:       #1E2531;   /* Primary dark — matches the logo stroke colour exactly */
  --apx-dark-bg:    #0B0F18;   /* Hero background — deeper than logo, makes it "lift" */
  --apx-light:      #FFFFFF;   /* Primary light */
  --apx-light-bg:   #FAFBFC;   /* Off-white for gentle section tints, optional */

  /* Neutral grey scale — used for form borders, dividers, secondary text.
     Derived from --apx-dark at specific opacities. */
  --apx-grey-95:    rgba(30, 37, 49, 0.95);
  --apx-grey-70:    rgba(30, 37, 49, 0.70);  /* Body copy on light bg */
  --apx-grey-50:    rgba(30, 37, 49, 0.50);  /* Captions, metadata */
  --apx-grey-30:    rgba(30, 37, 49, 0.30);  /* Borders, dividers */
  --apx-grey-12:    rgba(30, 37, 49, 0.12);  /* Input backgrounds */

  /* Inverse greys — for dark-bg sections */
  --apx-light-70:   rgba(255, 255, 255, 0.70);
  --apx-light-50:   rgba(255, 255, 255, 0.50);
  --apx-light-30:   rgba(255, 255, 255, 0.30);
  --apx-light-12:   rgba(255, 255, 255, 0.12);

  /* Functional — only for form validation states, no brand intent */
  --apx-success:    #22C55E;   /* Form success only. Do not use in marketing. */
  --apx-error:      #EF4444;   /* Form error only. Do not use in marketing. */
}
```

### Rule of thumb

If a colour isn't in the token list above, **do not use it on the site**.
Every pixel should be either:
- The dark primary
- The light primary
- A derived opacity of one of those
- Photography (unbounded — that's where colour lives)
- The two functional form states (success/error)

---

## 3. Logo usage

Brand files live in `public/assets/brand/`. The APEAX identity is
**one solid logo mark with multiple colour variants and lockup options**.
File naming convention:

```
public/assets/brand/
├── apeax-lockup.svg                    # Dark #1E2531 on transparent — default for light backgrounds
├── apeax-lockup-white.svg              # Pure #FFFFFF on transparent — default for dark backgrounds
├── apeax-lockup-tagline.svg            # Dark, with "SURFACE PROTECTION" tagline line
├── apeax-lockup-tagline-white.svg      # White, with "SURFACE PROTECTION" tagline line
├── apeax-mark.svg                      # Triangle mark only, dark on transparent
└── apeax-mark-white.svg                # Triangle mark only, white on transparent
```

Both colour variants are the **same solid logo** — identical stroke
weight, identical proportions, just rendered in different colours.
Transparency means the logo drops onto any background without needing
a matching rectangle behind it. There is no "outline" or "thin-stroke"
variant — every use of the APEAX mark is solid.

### When to use what:

| Context                          | Logo file                         |
|----------------------------------|-----------------------------------|
| Nav bar (light page)             | `apeax-lockup.svg`                |
| Nav bar (dark hero page)         | `apeax-lockup-white.svg`          |
| Footer                           | Match the footer state            |
| Landing gate hero                | `apeax-lockup-tagline-white.svg`  |
| Email signature                  | `apeax-lockup-tagline.svg`        |
| Invoice header                   | `apeax-lockup-tagline.svg`        |
| Favicon                          | `apeax-mark.svg` at 32px          |
| OpenGraph share card             | `apeax-lockup-tagline-white.svg`  |
| Trade dashboard top-left         | `apeax-lockup-white.svg`          |

Use the mark alone (`apeax-mark-*.svg`) sparingly — only as a loading
spinner, favicon, or anchor point in a progress indicator. The wordmark
carries the brand; the mark on its own is too abstract for general use.

### Logo don'ts

- Never stretch, skew, or recolour
- Never drop shadows, outer glows, or bevels
- Never place on photography without a solid dark or light
  rectangle behind it
- Never render below 120px wide for the lockup, 24px for the mark
- Never tile or repeat

---

## 4. Typography

Keep the existing pairing from `_shared.css`. **Do not change.**

| Role               | Font            | Weights used          | Source       |
|--------------------|-----------------|-----------------------|--------------|
| Display / headline | **Archivo**     | 900, 600              | Google Fonts |
| Body / UI          | **Inter**       | 400, 500, 600, 700    | Google Fonts |
| Code / mono        | JetBrains Mono  | 500                   | Google Fonts |

### Type scale

Archivo 900 for hero headlines (clamp(40px, 8vw, 96px)).
Archivo 600 for section titles.
Inter 600 for subheads, buttons, nav items.
Inter 500 for body copy on marketing pages.
Inter 400 for long-form body (terms, privacy).

### Tracking

Headlines: `-0.02em` (tight, confident).
Body: `0` (default).
Uppercase labels / CTAs: `0.08em` (open, technical).

---

## 5. Photography direction

Not a brand token question, but it informs everything visual:

- Hero renders are cinematic, high-contrast, rarely desaturated
- The vehicles / surfaces being protected are the subject —
  the film itself is invisible
- Lighting is dramatic, directional, never studio-flat
- Environments: road, highway, city, marina, workshop, never studio
- Human presence is rare — these are product showcases, not lifestyle

When selecting renders from `apeax_full/` for a page, prefer the one
where the lighting leans into the page's emotional register (e.g. the
landing gate wants "arrival" energy — dawn/dusk, low sun; the trade
login wants "professional workshop" energy — cleaner overheads).

---

## 6. CSS token implementation

When CIPHER runs Phase 0, replace the existing tokens in `_shared.css`
with the ones above. The existing structure of `_shared.css` is correct —
only the token values change. No structural rewrite is needed.

### What to rip out from the current `_shared.css`:

```css
/* REMOVE — provisional cyberpunk placeholders */
--apx-void: #05060A;
--apx-carbon: #0E1218;
--apx-graphite: #1A2130;
--apx-bone: #F2F4F7;
--apx-mist: #9BA3B3;
--apx-xenon: #00E5C8;
--apx-flare: #FFB020;
--apx-verdigris: #2FD27E;
--apx-ember: #FF7A33;
--apx-crimson: #FF3D5E;
```

### What to replace with:

See section 2 above.

### What else Phase 0 touches:

- Swap the `<svg>` voidmark placeholder in all 10 HTML files in
  `public/` for a proper `<img>` or inline reference to the logos in
  `public/assets/brand/`
- Update `<meta name="theme-color">` tags to the new dark bg (`#0B0F18`)
- Update favicon references to point at `apeax-mark-dark.svg`
- Update the OpenGraph meta tags to reference the new brand imagery
  (once Phase 1 lands a proper share card)

---

## 7. Accessibility

The `#1E2531` foreground on `#FFFFFF` background contrast ratio is
**15.34:1** — passes WCAG AAA for all text sizes.

The `#FFFFFF` foreground on `#0B0F18` background contrast ratio is
**18.42:1** — passes WCAG AAA for all text sizes.

Both pairs are well above the required thresholds. No accessibility
compromise in going monochrome.

For form inputs on light bg, use `--apx-grey-30` for borders and
`--apx-grey-12` for filled input backgrounds. These keep forms
readable without fighting the monochrome system.

---

## 8. Phase 0 — authorised

CIPHER is authorised to proceed with Phase 0 (brand refresh of the
existing shell) using the tokens, logos, and typography defined above.

Phase 0 scope reminder:
1. Replace tokens in `_shared.css` with section 2 values
2. Install the six logo files into `public/assets/brand/` using section 3
   naming
3. Replace the voidmark placeholder in all 10 HTML files in `public/`
4. Update theme-color + favicon references
5. Smoke-test locally (`npx serve public`), then push to a preview branch
6. Visual review on `apeax-distribution.netlify.app` before merging to main
7. Merge → auto-deploy to `apeax.com.au`

**No new imagery is required for Phase 0.** Only the tokens, logos, and
shell updates. Product renders, heroes, and packaging are reserved for
Phase 1 onward per the three-step curation ritual in
`public/assets/README.md`.

---

## 9. Change control

This document can only be changed by the Director (Josh). If CIPHER or
any future agent believes a change is warranted, raise it as a proposal
in a Director briefing, not as an autonomous edit to this file.

The whole point of locking this is so no one re-litigates the brand
every time a new page is built.

---

## Appendix A — Source archive location and inventory

The source archive of original APEAX artwork lives OUTSIDE this repo at:

```
C:/Users/jhyde_zzz3b9b/Documents/Claude/Projects/ASI CENTCOM/APEAX Distribution Portal/repo/public/assets/apeax_full/
```

**Do not copy this folder wholesale into the repo.** It is gitignored
under the pattern `apeax_full/`. Only web-optimised, curated files
should land in `public/assets/` following the three-step ritual
documented in `public/assets/README.md`.

### What's in the archive (as of 2026-04-09)

**Top-level brand + hero files:**
- `APEAX AUSTRALIA DRAFT.png`
- `ApeaxWhite.png`, `ApeaxWhite - Copy.png`
- `apeax australia no background.png`
- `apeaxausnobg white.png`
- `apeaxaussurfaceprotection.png`, `..._black.png`
- `apeax tools image greyscale.png`
- `porscherender.png`, `porscherender_transparent.png` (landing gate candidate)
- `truckrender1.png`, `Large Truck Render.png`
- `Film Layer Graphic.png`, `impact, scratch & hydroparticle rejection layer.png`
- `X TEMPLATE.png`, `XTREME SERIES Spec.png`

**Per-product folders with renders + Golden X logos + spec tables:**

| Source folder          | Notable files                                                                                                                 |
|------------------------|-------------------------------------------------------------------------------------------------------------------------------|
| `Apeax OptiShield`     | B13 Volvo, B13R, Irizar i8 (front + side), Marcopolo full bus, Tram render, bus rolling, film explosion diagram, boat         |
| `Apeax Paintshield`    | Angry Corvette, G-Wagon, Moped, Russ Hood application video (mp4), Satin Urus, Range Rover, Porsche paintshield, boat render  |
| `Apeax RadShield`      | Window tint sample, Xtreme RadShield Gold-X, building skyscraper, bus side, boat                                              |
| `Apeax ClearShield`    | Golden X ClearShield logo, white + black transparents                                                                         |
| `Apeax Grafshield`     | Golden X Grafshield logo, white + black transparents                                                                          |
| `Apeax Xtreme Series`  | Golden X Xtreme Series logo, Green X variant, white series logo (FAMILY brand assets — not a separate product)                |
| `Packaging Artwork`    | Black Satin Box blank, Box Art Coach, Box Art Highrise, Box Art Luxury Yacht, Packaging Design Aus                            |
| `Product Display Images` | Banister grafshield, bus diagram of products, due-north products, Porsche xtreme films diagram, semi-truck, shopfront, van |

### Important: XTREME is a family prefix, not a product

"XTREME Series" is the brand family name applied to all five films:
XTREME OptiShield, XTREME PaintShield, XTREME RadShield,
XTREME ClearShield, XTREME GrafShield. There is NO sixth standalone
product called "XTREME Series".

On the deploy-side (`public/assets/products/`) there are **only five
product folders**, one per film. The `Apeax Xtreme Series` folder in
the source archive contains shared family-level wordmarks and logos
which get deployed under `public/assets/brand/` or `public/assets/heroes/`
depending on use, not into their own product folder.

Each product folder also contains `Product Branding/` (Golden X logo +
transparent variants), `Product Images/`, and `Spec Tables/` subfolders
where the per-product spec table PNGs already exist.

### Phase 1 curation recommendations (CVS's read)

When CIPHER starts Phase 1, strong candidates for first-pass page heroes:

- **Landing gate (split passenger/heavy):** `porscherender_transparent.png`
  on the PASSENGER panel, `busrollingoptishield.png` or `Marcopolo Optishield Render.png`
  on the HEAVY panel
- **Passenger hub page:** Porsche PaintShield (`porschepaintshield.png`),
  G-Wagon, or a Corvette render from PaintShield folder
- **Heavy hub page:** `B13 Volvo Optishield no logo.png` or
  `Irizar Front Side Elevation Optishield.png`
- **OptiShield product page:** `Irizar Front Side Film Illustrated.png`
  (good for the "film detection" story), `filmmaterialexplosiondiagram.png`
  for the specs section
- **Trade login split panel:** `porscherender_transparent.png` as the
  cinematic left panel
- **OG share card:** `apeaxaussurfaceprotection_black.png` on dark bg

These are first-pass recommendations only. Final selection goes through
the three-step ritual in `public/assets/README.md` — Josh briefs CIPHER
on the page intent, CIPHER proposes files with rationale, Josh approves
or swaps, then CIPHER copies + compresses + renames into `public/assets/`
following the naming convention.

### Compression targets before any asset ships

- **Heroes / renders:** WebP @ 1920w @ q80, target <400KB
- **Product shots:** WebP @ 1600w @ q82, target <300KB
- **Diagrams:** SVG where possible, otherwise WebP @ 1200w @ q85
- **Logos:** SVG only, optimise via svgo
- **Packaging boxes:** WebP @ 1200w @ q82, target <250KB
- **Product Branding Golden-X logos:** PNG with alpha at 512x512, then
  convert to WebP for web use

Total asset budget for the full public site: under 15MB, preferably
under 10MB. First paint target <250KB for the landing gate above-the-fold.
