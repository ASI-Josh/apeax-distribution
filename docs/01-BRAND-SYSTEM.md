---
title: APEAX Distribution Portal — Brand System
version: 1.0
date: 2026-04-09
author: CIPHER
---

# APEAX Brand System

The portal presents APEAX as a distinct, near-standalone brand. It does not borrow the ASI visual identity directly. ASI is the distributor and operational spine, but apeax.com.au speaks in APEAX's own voice so installers engage with the product brand, not a reseller site.

## Positioning

**"German-engineered films, designed specifically for Australian mass-transit duty and UV conditions."**

APEAX is the performance shield. Passenger vehicles and heavy vehicles both, but each with its own dedicated ground. The portal is built around two parallel worlds (Passenger and Heavy) that share one film technology family.

### Brand Pillars

1. **Engineered, not sold.** Technical credibility first. Every claim has a spec sheet behind it.
2. **Protecting what moves Australia.** Direct mission statement. Coach fleets, rideshare, prestige autos, marine, architecture.
3. **Cinematic proof.** Motion-driven storytelling. Products seen in situ. Not stock photography.
4. **Trade-first.** The end buyer is the installer. The marketing has to respect that.

## Visual Identity

### Palette

| Role | Token | Hex | Notes |
|------|-------|-----|-------|
| Base (background) | `--apx-void` | `#05060A` | Near-black, slight blue bias |
| Surface elevation 1 | `--apx-carbon` | `#0E1218` | Cards, panels |
| Surface elevation 2 | `--apx-graphite` | `#1A2130` | Hover, raised states |
| Primary ink | `--apx-bone` | `#F2F4F7` | Headlines, display type |
| Secondary ink | `--apx-mist` | `#9BA3B3` | Body, supporting text |
| Accent primary | `--apx-xenon` | `#00E5C8` | Cyan-teal, electric, CTAs, key moments |
| Accent secondary | `--apx-flare` | `#FFB020` | Warm amber for heat/UV warnings, hazard signals |
| Success | `--apx-verdigris` | `#2FD27E` | Confirmed orders, in-stock |
| Warning | `--apx-ember` | `#FF7A33` | Limited stock, ETA risk |
| Error | `--apx-crimson` | `#FF3D5E` | Form errors, rejected |
| Border subtle | `--apx-wire` | `rgba(255,255,255,0.08)` | Hairlines |
| Border accent | `--apx-trace` | `rgba(0,229,200,0.4)` | Active focus |

**Why xenon cyan as primary accent:** APEAX XTREME OPTISHIELD is positioned around optical clarity and self-healing polyurethane. Cyan-teal reads as "optical", "technical", "cold engineering" without falling into the generic blue that every competitor uses. It also has maximum contrast against the void base.

**Why flare amber as secondary:** UV protection is APEAX's thermal story. Amber/flare reads as heat and sun, and gives the brand warmth against an otherwise cold palette. Used sparingly: UV block percentages, heat reduction stats, warranty badges.

### Typography

Two families, both Google Fonts (free, fast, no licensing drama):

- **Display:** `Neue Machina` (if license allows) or fallback to `Archivo` 900 weight. Condensed, uppercase, industrial. Used for section heroes, landing gate, product category titles.
- **Body:** `Inter` 400/500/600. Neutral, legible, modern. Used for all body copy, product specs, forms.
- **Mono accent:** `JetBrains Mono` 500. Used for SKUs, part numbers, spec tables. Signals "this is technical data."

Scale (rem base 16):

```
--fs-display-xl: 8.0rem   /* Landing hero */
--fs-display-lg: 5.0rem   /* Page heroes */
--fs-display-md: 3.5rem   /* Section heads */
--fs-display-sm: 2.25rem  /* Sub-sections */
--fs-body-xl:    1.25rem  /* Lead paragraphs */
--fs-body-lg:    1.125rem /* Body default */
--fs-body-md:    1.0rem   /* UI, forms */
--fs-body-sm:    0.875rem /* Captions, meta */
--fs-mono:       0.875rem /* SKUs, specs */
```

Tracking: display uses `letter-spacing: -0.02em`, body default, mono `letter-spacing: 0.02em`.

### Motion

GSAP is the motion engine. No frameworks. Principles:

1. **Inertia, not ease.** Use `power3.out` or `expo.out` for entries. Motion should feel heavy but controlled, like precision engineering.
2. **Scroll is the camera.** ScrollTrigger drives the narrative. Each section is a shot.
3. **Text is alive.** SplitText on all display headlines. Characters stagger in from below or scale from `0.95`.
4. **No bounce.** Nothing overshoots. Elastic easing is banned. This is a weapon, not a toy.
5. **60fps or nothing.** If a motion can't hold 60fps on a 2019 MacBook Air, it gets cut.

### Logo Treatment

Pending Canva extraction of the AUSTRALIA design asset and APEAX FILMS page 1. For the repo scaffold, the placeholder logo lock-up is:

```
APEAX
XTREME SERIES
```

Set in Neue Machina Display, tracked +50, white on void. Dedicated SVG to be dropped in once exported from Canva. The portal header uses an outlined hexagonal motif as secondary mark (already implied across ASI APEAX imagery).

## Voice

### Principles

- **Under-claim. Over-deliver.** Specs are precise and verifiable. No hype language.
- **Australian English.** Colour, optimise, fibre, specialise. No emdashes anywhere.
- **Second-person trade.** Speak to the installer. "You'll fit. You'll warranty. You'll protect."
- **Numbers front and centre.** 99% UV block. 10-year warranty. 40"×100ft rolls. These are the hooks.
- **No corporate filler.** Delete "solutions", "leverage", "seamless", "synergy", "empower" on sight.

### Tone by Zone

| Zone | Tone |
|------|------|
| Landing gate | Cinematic, spare, 4-6 words per panel |
| Product hero | Declarative, specification-anchored |
| Trade onboarding | Warm professional, straight talk |
| Quote form | Crisp functional, zero marketing |
| Trade dashboard | Operational, dense, mono for part numbers |
| Error / warning | Short, human, no blame |

### Sample Copy

Landing gate, Passenger side:
> **PASSENGER.**
> Prestige, Tesla, Rideshare.
> Optical protection engineered for the windscreen that earns its keep.

Landing gate, Heavy side:
> **HEAVY.**
> Coach, Bus, Marine, Structural.
> The films that keep the fleet in service and the schedule honest.

Product hero, OptiShield HV:
> **XTREME OPTISHIELD.**
> Hydrophobic. Particle-phobic. RF-safe. Refreshable.
> 99% UV block. 10-year structural warranty.
> Designed for Australian mass-transit duty.

## Layout System

### Grid

12-column, 1440 max-width container. 24px gutters on desktop, 16px on mobile. Breakpoints:

```
--bp-xs:  420px
--bp-sm:  640px
--bp-md:  900px
--bp-lg:  1200px
--bp-xl:  1440px
```

### Spacing scale

```
--sp-1:  4px
--sp-2:  8px
--sp-3:  12px
--sp-4:  16px
--sp-5:  24px
--sp-6:  32px
--sp-7:  48px
--sp-8:  64px
--sp-9:  96px
--sp-10: 128px
```

### Corner radii

```
--rad-sm: 2px    /* Pills, chips */
--rad-md: 6px    /* Cards */
--rad-lg: 12px   /* Panels */
--rad-xl: 20px   /* Hero media */
--rad-pill: 999px /* CTA buttons */
```

Buttons default to pill. Cards default to 12px. Hero blocks default to 20px. Hard corners (radius 0) are used for spec tables and code blocks only, as a deliberate texture contrast.

### Elevation

No drop shadows. Elevation is expressed with background token changes and 1px borders. Shadows are banned except on modals (where a single `0 40px 80px rgba(0,0,0,0.6)` is allowed).

## Components (initial inventory)

1. Landing Gate (split-screen Passenger \| Heavy)
2. Navigation (sticky, translucent, backdrop blur)
3. Product hero (full-bleed media + spec badge column)
4. Product spec table (mono type, zebra rows in graphite)
5. CTA button (primary xenon pill, secondary outline pill)
6. Quote form (multi-step, progress rail)
7. Trade login modal (single modal, sharp focus)
8. Trade dashboard (order history, quick reorder, warranty log)
9. Order confirmation screen (xenon verdigris tick, ISO traceability badge)
10. Footer (distribution division notice, ASI parent attribution, sitemap)

## Things the Brand Is Not

- Not a glossy showroom. No rendered hero cars. Real fleet, real coaches.
- Not a consumer site. No "Shop Now", no "Add to Cart", no prices with cents.
- Not the ASI site. No orange, no `#ff9500`, no Montserrat. Different family entirely.
- Not apologetic. No "we're proud to". No "family-owned". That's asi-australia.com.au's register.
