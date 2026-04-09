---
title: apeax-distribution — Repo Scaffold Plan
version: 1.0
date: 2026-04-09
owner: CIPHER
---

# Repo Scaffold: `apeax-distribution`

## Target

- **Org:** github.com/ASI-Josh
- **Name:** `apeax-distribution`
- **Visibility:** Public (same as asi-custom-website, so Netlify can auto-build on push without auth hoops).
- **License:** All Rights Reserved notice in README; no open-source license file.
- **Branching:** `main` only for now. Feature branches when SHIELD is scaling.
- **Deploy trigger:** Netlify auto-deploys on push to `main`.

## Top-Level Structure

```
apeax-distribution/
├── README.md                 # Project overview, build instructions
├── .gitignore
├── netlify.toml              # Netlify config: clean URLs, headers, caching, redirects
├── public/                   # ← Netlify publish root, everything here is served
│   ├── index.html            # LANDING GATE (split-screen Passenger | Heavy)
│   ├── passenger.html        # Passenger landing, category hub
│   ├── heavy.html            # Heavy landing, category hub
│   ├── products/
│   │   ├── optishield.html        # XTREME OPTISHIELD (passenger + heavy variants)
│   │   ├── optishield-hv.html     # Heavy vehicle OptiShield detail
│   │   ├── clearshield.html       # XTREME CLEARSHIELD
│   │   ├── radshield.html         # XTREME RADSHIELD (40"×100ft roll)
│   │   ├── paintshield.html       # XTREME PAINTSHIELD
│   │   ├── grafshield.html        # XTREME GRAFSHIELD
│   │   └── gloss60.html           # Gloss 60 PPF
│   ├── trade/
│   │   ├── login.html             # Trade installer login (form posts to serverless function)
│   │   ├── apply.html             # New trade account application form
│   │   ├── dashboard.html         # Authenticated dashboard shell (JS-gated)
│   │   └── order.html             # Direct-order form for vetted accounts
│   ├── quote.html                  # Quote request form (public, new installers)
│   ├── about.html                  # About APEAX + ASI Distribution Division
│   ├── contact.html                # Contact SHIELD
│   ├── privacy.html                # Privacy policy
│   ├── terms.html                  # Trade terms of supply
│   ├── warranty.html               # Warranty registration info
│   ├── 404.html
│   ├── robots.txt
│   ├── sitemap.xml
│   ├── favicon.svg
│   ├── assets/
│   │   ├── logo/
│   │   │   ├── apeax-wordmark.svg
│   │   │   ├── apeax-mark.svg
│   │   │   └── apeax-wordmark-horizontal.svg
│   │   ├── hero/                    # Landing + product hero imagery
│   │   ├── products/                # Product detail imagery
│   │   ├── icons/                   # Inline SVG icon set
│   │   └── brand/                   # Brand system assets (guidelines PDFs, colour swatches)
│   ├── styles/
│   │   ├── tokens.css               # Design tokens (colour, type, spacing)
│   │   ├── base.css                 # Reset, typography base, layout primitives
│   │   ├── components.css           # Button, card, form, nav, footer
│   │   ├── landing.css              # Landing gate specific
│   │   ├── product.css              # Product hero + spec layout
│   │   ├── trade.css                # Trade portal skin
│   │   └── main.css                 # Imports + utility
│   └── scripts/
│       ├── main.js                  # Site-wide: nav, reveal animations, form helpers
│       ├── landing.js               # Landing gate split interaction
│       ├── product.js               # Product hero animation, spec tabs
│       ├── quote.js                 # Quote form multi-step
│       ├── trade-auth.js            # Trade login/session handling (calls Netlify function)
│       ├── trade-dashboard.js       # Dashboard rendering (calls ASI Portal via Netlify function)
│       └── lib/
│           ├── gsap.min.js          # GSAP core (vendored or CDN-imported)
│           └── analytics.js         # GA4 wrapper
├── netlify/
│   └── functions/
│       ├── submit-quote.js          # POST quote -> create Lead in ASI Portal
│       ├── submit-trade-app.js      # POST trade app -> create Leads Register entry
│       ├── trade-login.js           # Validates installer credentials
│       ├── trade-order.js           # Authenticated: creates ASI Portal job record
│       ├── get-trade-account.js     # Returns installer dashboard payload
│       └── _shared/
│           ├── asi-portal.js        # ASI Portal MCP/API client wrapper
│           └── auth.js              # JWT session helpers
└── docs/
    ├── BRAND-SYSTEM.md              # Mirrors 01-BRAND-SYSTEM.md
    ├── SHIELD-SOP.md                # Mirrors 02-SHIELD-AGENT-SOP.md
    ├── ORDER-WORKFLOW.md            # Mirrors 04-ORDER-WORKFLOW.md
    └── DEPLOY.md                    # Mirrors 05-DEPLOY-RUNBOOK.md
```

## netlify.toml (initial)

```toml
[build]
  publish = "public"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "geolocation=(), camera=(), microphone=()"
    Strict-Transport-Security = "max-age=31536000; includeSubDomains; preload"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "/styles/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"

[[headers]]
  for = "/scripts/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"

[build.processing]
  skip_processing = false

[build.processing.html]
  pretty_urls = true

[[redirects]]
  from = "/shop"
  to = "/trade/login"
  status = 302

[[redirects]]
  from = "/login"
  to = "/trade/login"
  status = 302

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

## .gitignore (initial)

```
.DS_Store
node_modules/
.netlify/
.env
.env.*
*.log
dist/
build/
.vscode/
.idea/
```

## README.md (initial content sketch)

```
# APEAX Distribution Portal

Online Sales Point and Client Ordering Portal for APEAX XTREME Series films.
Run by Advanced Surface Innovations Pty Ltd (ASI) as Australia's exclusive APEAX distributor.

## Stack
- Static HTML/CSS/JS, no framework, no build step
- GSAP for motion
- Netlify hosting, auto-deploy from main
- Netlify Functions for serverless trade integrations
- ASI Portal (asiportal.live) integration for ISO 9001/14001/45001 traceability

## Local Preview
Serve `public/` with any static server:
  npx serve public

## Deploy
Push to `main`. Netlify builds automatically. DNS is pointed from Crazy Domains to Netlify DNS.

## Operational Agent
Day-to-day distribution operations are run by SHIELD.
See docs/SHIELD-SOP.md
```

## Build Order

1. `index.html` + tokens.css + base.css + landing.css + logo placeholder + landing.js
2. Shared nav / footer pattern (inlined per page for now, refactor later)
3. `passenger.html` + `heavy.html` category hubs
4. `products/optishield.html` as the flagship product template
5. Duplicate product template for clearshield, radshield, paintshield, grafshield, gloss60, optishield-hv
6. `quote.html` form + `submit-quote.js` function
7. `trade/apply.html` form + `submit-trade-app.js` function
8. `trade/login.html` + `trade-login.js` + session layer
9. `trade/dashboard.html` + `trade-order.js` + `get-trade-account.js`
10. Polish: `about.html`, `contact.html`, `privacy.html`, `terms.html`, `warranty.html`, `404.html`, `sitemap.xml`, `robots.txt`
11. GA4 + Search Console verify
12. DNS cutover + SSL

## Dependencies

No npm install required for the static site. The only Node dependencies are for Netlify Functions:

```
netlify/functions needs:
  - @netlify/functions (runtime)
  - node-fetch (or native fetch if Node 18+)
  - jsonwebtoken (trade session handling)
  - zod (payload validation)
```

These get installed via a root `package.json` that Netlify resolves automatically on deploy. No local build needed for the site itself.
