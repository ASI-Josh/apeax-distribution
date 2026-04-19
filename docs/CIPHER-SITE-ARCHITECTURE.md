# CIPHER Web Architecture Reference

Last updated: 2026-04-19 (expanded to cover both domains)

> **Note to DIRECTOR:** This file is the replacement for
> `.claude/skills/cipher/references/site-architecture.md`. The sandbox has that
> path mounted read-only, so CIPHER wrote the new version here. Copy this file
> over the reference locally when convenient.

CIPHER owns two independent production web assets. Each has its own repository,
Netlify project, deployment pipeline, and (likely) GA4 property. They share a
brand parent (ASI Australia) but are architecturally separate.

| Domain | Repo | Purpose | Status |
|---|---|---|---|
| asi-australia.com.au | `ASI-Josh/asi-custom-website` | ASI corporate site + sector content | Live, stable |
| apeax.com.au | `ASI-Josh/apeax-distribution` (CVS-maintained) | APEAX distribution portal, trade installer gateway, SHIELD-served | Live, Phase 0 brand reconciliation 2026-04-19 |

---

## ASSET 1: asi-australia.com.au

### Site Overview
- **URL:** https://asi-australia.com.au
- **Hosting:** Netlify (auto-deploy from GitHub push to main)
- **Repository:** github.com/ASI-Josh/asi-custom-website (public)
- **Stack:** Static HTML/CSS/JS (vanilla), no framework, no build step
- **Publish root:** `public/`
- **Netlify config:** `netlify.toml` in repo root
- **External portal link-out:** ASIPortal at hyperportal.online

### Tech Stack Details
- **Font:** Montserrat (400/500/600/700) via Google Fonts
- **CSS:** Single `main.css` (1,641 lines) + page-specific inline `<style>` blocks. APEAX subsite (legacy) has its own `apeax.css`
- **JS:** Minimal, `shop.js`, `apeax/scripts/apeax.js`. No shared JS modules
- **Analytics:** GA4 Measurement ID **G-4QTZKJSX55** (injected inline on every page)
- **Search Console:** Property verified, sitemap submitted

### Repository Structure

```
asi-custom-website/
├── netlify.toml              # Netlify config (clean URLs, headers, caching)
├── .gitignore
├── public/                   # ← Publish root
│   ├── index.html            # Homepage (375 lines)
│   ├── mass-transit.html     # Fleet sector (751 lines), most developed
│   ├── manufacturing.html    # Manufacturing sector (376 lines)
│   ├── wholesale-trade.html  # Trade sector (533 lines)
│   ├── structural.html       # Structural sector (763 lines), largest page
│   ├── marine.html           # Marine sector (357 lines)
│   ├── about.html            # About page (391 lines)
│   ├── contact.html          # Contact form (305 lines)
│   ├── sectors.html          # Sector index (264 lines)
│   ├── privacy-policy.html   # Privacy policy (225 lines)
│   ├── shop.html             # Shop placeholder (328 lines)
│   ├── paintshield.html      # PaintShield product (390 lines)
│   ├── robots.txt            # Search engine directives
│   ├── sitemap.xml           # 15 URLs submitted to Search Console
│   ├── styles/main.css       # Primary stylesheet (1,641 lines)
│   ├── scripts/shop.js       # Shop page JS
│   ├── images/               # All site images (~80+ files)
│   └── apeax/                # LEGACY APEAX product sub-site (superseded by apeax.com.au)
│       ├── index.html        # APEAX landing (426 lines)
│       ├── optishield.html   # OptiShield product (362 lines)
│       ├── radshield.html    # RadShield product (369 lines)
│       ├── images/
│       ├── styles/apeax.css
│       └── scripts/apeax.js
```

### Design System (legacy ASI brand)

| Element | Value |
|---------|-------|
| Nav background | `rgba(15, 23, 42, 0.95)` with `backdrop-filter: blur(10px)` |
| Primary accent | `#3b82f6` (blue) |
| CTA accent | `rgba(204, 255, 0)` / `#CCFF00` (yellow-green) |
| ASIPortal CTA | `linear-gradient(135deg, #ff8c00, #ff6b00)` (orange) |
| Section headings | `#ff9500` (orange) |
| Body font | Montserrat 400/500/600/700 |
| Glass morphism | `backdrop-filter: blur()` on nav and overlays |
| Responsive breakpoint | 1400px |

### SEO Infrastructure (deployed 2026-03-25)

| Element | Status |
|---------|--------|
| `<html lang="en-AU">` | All pages |
| `<meta charset="UTF-8">` | All pages |
| `<meta name="viewport">` | All pages |
| `<title>` (SEO-optimised) | All pages |
| `<meta name="description">` | All pages (150-160 chars each) |
| Open Graph tags | All pages |
| Twitter Card tags | All pages |
| Canonical URLs | All pages |
| GA4 tracking | All pages (G-4QTZKJSX55) |
| Schema.org LocalBusiness | Homepage |
| Schema.org Service | Each sector page |
| sitemap.xml | 15 URLs, submitted to Search Console |
| robots.txt | Allow all, sitemap reference |
| Netlify clean URLs | All pages (strip .html) |
| Security headers | X-Frame-Options, X-Content-Type-Options, XSS-Protection |
| Cache headers | Images (1yr), stylesheets (1wk) |
| Copyright | 2025 |

### Known Technical Debt (asi-australia.com.au)

1. **Inline styles everywhere**: most elements use inline styles rather than classes. Maintenance friction, page weight bloat.
2. **Duplicated nav/footer**: copy-pasted across every HTML file. Any nav change requires editing 15+ files.
3. **No shared JS**: each page has inline `<script>` blocks.
4. **Image optimisation**: PNG/JPEG originals only. No WebP, no lazy loading, no `srcset`.
5. **Inconsistent image naming**: spaces, mixed case, no convention.
6. **No favicon**: not specified in HTML.

### Content Gaps (asi-australia.com.au)

1. All XTREME/APEAX products marked "Coming Soon" across sector pages
2. No case studies or testimonials
3. No ROI calculators or interactive tools
4. No team/founder bios on About page
5. No business hours or physical address on Contact page
6. No social media links
7. Shop page non-functional
8. No blog or resources section

---

## ASSET 2: apeax.com.au

### Site Overview
- **URL:** https://apeax.com.au
- **Hosting:** Netlify (auto-deploy from GitHub push to main)
- **Repository:** github.com/ASI-Josh/apeax-distribution (CVS-built, CIPHER-maintained)
- **Stack:** Static HTML/CSS/JS + Netlify Functions (Node 20, esbuild-bundled)
- **Publish root:** `public/`
- **Functions directory:** `netlify/functions/`
- **Netlify config:** `netlify.toml` in repo root
- **Backend:** ASI Portal at https://asiportal.live (thin-proxy pattern)
- **Purpose:** APEAX film distribution, trade installer gateway, SHIELD-served ordering

### Tech Stack Details
- **Fonts:** Archivo (400/500/600/900), Inter (400/500/600/700), JetBrains Mono (500) via Google Fonts
- **CSS:** Single `_shared.css` (monochrome inverse-pair tokens per BRAND-DECISIONS.md v1.0) + page-specific inline `<style>` blocks
- **JS:** `/assets/js/analytics.js` (GA4 loader, async). Trade dashboard has inline JWT session handling.
- **Analytics:** GA4 Measurement ID **[TBC, see Phase 0 pending]**. Options:
  1. Reuse G-4QTZKJSX55 (single ASI property, cross-domain linker via GA4 Admin)
  2. Dedicated apeax.com.au property (cleaner reporting; separate user journey)

  DIRECTOR decision pending. Current state: `G-PLACEHOLDER` in `/assets/js/analytics.js`. Analytics inactive until real ID installed.
- **Search Console:** Not yet verified. Pending Phase 1.

### Repository Structure

```
apeax-distribution/
├── netlify.toml                    # Netlify config (redirects, CSP, caching)
├── package.json                    # Node deps for Functions
├── README.md
├── docs/                           # Locked design and build docs
│   ├── 00-PROJECT-BRIEF.md
│   ├── 01-BRAND-SYSTEM.md         # SUPERSEDED by BRAND-DECISIONS.md
│   ├── 02-INFORMATION-ARCHITECTURE.md
│   ├── 03-REPO-SCAFFOLD.md
│   ├── 04-COMPONENT-LIBRARY.md
│   ├── 05-DEPLOY-RUNBOOK.md
│   └── BRAND-DECISIONS.md         # v1.0 LOCKED, 2026-04-09, AUTHORITATIVE
├── public/                         # ← Publish root
│   ├── index.html                 # Homepage (monochrome, inline :root)
│   ├── passenger.html             # Passenger vehicle lane
│   ├── heavy.html                 # Heavy fleet lane
│   ├── optishield-hv.html         # OptiShield HV product page
│   ├── warranty.html              # Warranty terms
│   ├── quote.html                 # Trade quote request
│   ├── _shared.css                # BRAND-DECISIONS v1.0 monochrome tokens
│   ├── assets/
│   │   ├── brand/                 # PNG logos (SVG pending per BRAND-DECISIONS §3)
│   │   ├── heroes/                # Hero renders
│   │   ├── renders/               # Product renders
│   │   ├── packaging/             # Packaging visuals
│   │   ├── products/              # Product shots
│   │   ├── icons/                 # UI icons
│   │   ├── diagrams/              # Technical diagrams
│   │   ├── js/analytics.js        # GA4 loader (async)
│   │   └── apeax-catalogue-2026.pdf
│   └── trade/
│       ├── apply.html             # Trade account application
│       ├── login.html             # Trade login
│       └── dashboard.html         # Installer dashboard (JWT-gated)
└── netlify/functions/
    ├── _lib/portal.js             # Shared helper: callPortal, JWT, CORS, sanitise
    ├── health.js                  # GET /api/health
    ├── quote-request.js           # POST /api/quote-request
    ├── trade-application.js       # POST /api/trade-application
    ├── trade-login.js             # POST /api/trade-login (issues JWT)
    ├── trade-dashboard.js         # GET /api/trade-dashboard (JWT required)
    ├── trade-order.js             # POST /api/trade-order (JWT + line items)
    └── stock.js                   # GET /api/stock (JWT + category/sku filter)
```

### Functions: Thin-Proxy Pattern

Every Function follows the same pattern:

1. Gate the HTTP method and options preflight (CORS).
2. For authenticated endpoints, extract bearer JWT from `Authorization` header via `getBearer(event)`.
3. Normalise/validate the incoming payload.
4. Call the ASI Portal via `callPortal(path, { method, body, bearerJwt, serviceApiKey })`.
5. Map Portal responses to the installer-safe shape via `sanitiseForInstaller()` which strips `costPrice`, `marginPercent`, `supplierReference`, and other internal fields.
6. Return `ok(payload)` or `bad(message, statusCode)`.

Environment variables (server-side only, never exposed to browser):

| Var | Purpose |
|---|---|
| `PORTAL_BASE_URL` | `https://asiportal.live` |
| `SHIELD_API_KEY` | SHIELD service account token, mirror of ASI Portal value |
| `JWT_SECRET` | 64-char secret for trade session tokens, HS256 |
| `GA4_MEASUREMENT_ID` | Documented in README but NOT used by Functions. GA4 is client-side in `/assets/js/analytics.js`. |
| `SHIELD_ALERT_EMAIL` | `shield@asi-australia.com.au` |

### Auth Flow

1. Installer hits `/trade/login` with email + password.
2. `trade-login.js` proxies to ASI Portal for credential validation.
3. On success, ASI Portal returns a 7-day HS256 JWT signed with `JWT_SECRET`.
4. Browser stores JWT in `sessionStorage` (default) or `localStorage` (remember me).
5. All subsequent trade API calls include `Authorization: Bearer <jwt>`.
6. Dashboard / orders / stock all re-validate JWT on each call via `getBearer(event)`.
7. 401 responses map to `"Session expired. Please sign in again."` on the client.

### Design System (BRAND-DECISIONS.md v1.0 LOCKED)

| Token | Value | Purpose |
|---|---|---|
| `--apx-dark` | `#1E2531` | Primary dark surface, text on light |
| `--apx-dark-bg` | `#0B0F18` | Hero / full-page dark background |
| `--apx-light` | `#FFFFFF` | Primary light surface, text on dark |
| `--apx-light-bg` | `#FAFBFC` | Page body on light pages |
| `--apx-grey-95/70/50/30/12` | rgba(30,37,49, x) | Grey opacity scale on light |
| `--apx-light-70/50/30/12` | rgba(255,255,255, x) | Grey opacity scale on dark |
| `--apx-success` | `#22C55E` | Form validation only |
| `--apx-error` | `#EF4444` | Form validation only |

Legacy token aliases preserved (`--apx-void`, `--apx-carbon`, `--apx-graphite`, `--apx-bone`, `--apx-mist`, `--apx-xenon`, `--apx-flare`) so existing HTML doesn't need rewrites. Values point to monochrome.

Button hover semantic: inverse-pair flip (light BG + dark text inverts to dark BG + light text on hover) with 4px translateX.

Typography:
- Display: Archivo 900/600
- Body: Inter 400-700
- Code/meta: JetBrains Mono 500

### Netlify Config Highlights

- `[[redirects]]`: `/api/*` routes rewrite to `/.netlify/functions/*` (friendly URL shape matches ASI Portal)
- `[[redirects]]`: `/trade/login`, `/trade/apply`, `/trade/dashboard` serve the `.html` variants (clean URLs)
- **CSP:** `default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com https://www.google-analytics.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://asiportal.live https://www.google-analytics.com https://*.analytics.google.com https://*.google-analytics.com https://*.googletagmanager.com; frame-ancestors 'none'`
- HSTS: `max-age=63072000; includeSubDomains; preload`
- Frame ancestors: `'none'` (no embedding)
- Cache: `_shared.css` 1hr, HTML 5min must-revalidate, API `no-store`

### ISO Touchpoints Seeded by Functions

When `trade-order.js` creates a distribution job on the Portal, it seeds ISO audit hooks on the job record:
- **8.2.1** Customer communication (order ack)
- **8.2.2** Determining requirements (line item validation)
- **8.4.1** Control of externally provided processes (SHIELD validation SLA)

GUARDIAN reads these via the ASI Portal MCP for ISO 9001 evidence.

### Phase 0 State (2026-04-19)

Completed under DIRECTOR urgent directive:
- `_shared.css` migrated from cyberpunk palette to BRAND-DECISIONS.md v1.0 monochrome (legacy aliases preserved)
- Link rot repaired across nav, footer Trade block, and page CTAs on passenger / heavy / optishield-hv
- GA4 loader installed at `/assets/js/analytics.js`, script tag injected on all 9 HTML pages
- CSP expanded to allow GA4 connect endpoints
- This reference doc updated

Pending:
- DIRECTOR to set real GA4 measurement ID in `/assets/js/analytics.js`
- SVG brand assets (BRAND-DECISIONS §3) still sitting as PNG in `/assets/brand/`
- Trade sub-pages for forgot-password, order history, warranty register
- Marine and structural product sub-pages (currently link to `#`)
- Terms, Privacy, ISO certification static pages
- Search Console verification + sitemap submission

---

## Build & Deploy Pipeline (both assets)

1. DIRECTOR / CIPHER edits files in local clone.
2. Commit + push to `main`.
3. Netlify webhook fires, pulls latest, runs build command (for apeax-distribution: bundles Functions via esbuild; for asi-custom-website: no build step).
4. Netlify publishes `public/` to CDN. Headers and redirects applied per `netlify.toml`.
5. Auto-deploy live within 30-90 seconds.

Rollback: Netlify UI > Deploys > click prior deploy > "Publish deploy". Instant revert.

## Cross-Asset Principles

- Both domains are CIPHER's responsibility.
- asi-australia.com.au is the corporate / sector / marketing surface.
- apeax.com.au is the distribution / trade / product surface.
- No code is shared between repos. Each site is independently deployable, independently themed, and independently versioned.
- SHIELD owns apeax.com.au content strategy (channel-facing copy, pricing tone, installer messaging). CIPHER owns structure, performance, SEO, and deployment.
- ATHENA receives weekly status from CIPHER covering both assets.

## Git Remote Conventions

| Repo | Remote | Default branch |
|---|---|---|
| asi-custom-website | `origin` = `git@github.com:ASI-Josh/asi-custom-website.git` | `main` |
| apeax-distribution | `origin` = `git@github.com:ASI-Josh/apeax-distribution.git` | `main` |

CIPHER commits with conventional commit messages (`feat:`, `fix:`, `chore:`, `docs:`, `style:`) and scopes where helpful (`feat(trade): ...`, `fix(brand): ...`).
