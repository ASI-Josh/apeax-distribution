# APEAX Distribution — Asset Library

All static imagery and iconography for apeax.com.au lives here. Organised
by purpose, not by page, so assets can be reused across the site without
duplication.

## Directory layout

```
public/assets/
├── brand/              Logos, wordmarks, brand marks (SVG preferred)
├── products/
│   ├── optishield/     OPTISHIELD — passenger + heavy vehicle window film
│   ├── paintshield/    PAINTSHIELD — paint protection film
│   ├── radshield/      RADSHIELD — radiant heat rejection film
│   ├── clearshield/    CLEARSHIELD — anti-scratch clear film
│   ├── grafshield/     GRAFSHIELD — anti-graffiti sacrificial film
│   └── xtreme-series/  Shared XTREME series banner assets
├── heroes/             Landing gate, passenger hub, heavy hub, trade panel
├── renders/            Cross-page reusable renders (product in context)
├── packaging/          Box art for trade dashboard "what you get" panels
├── diagrams/           Film layer illustrations, product display diagrams
└── icons/              Small UI glyphs (SVG)
```

## Naming convention

Use kebab-case, lowercase. Prefix with the product slug where applicable.

- `optishield-hv-spec-sheet.svg` (product diagram)
- `optishield-passenger-hero.webp` (hero)
- `porsche-paintshield-render.webp` (cross-page render)
- `radshield-box-front.webp` (packaging)
- `xtreme-series-wordmark.svg` (brand)
- `icon-truck-delivery.svg` (icon)

## Formats

| Use case | Preferred | Fallback |
|---|---|---|
| Logos, icons, diagrams | SVG | PNG @ 2x |
| Hero / render photography | WebP @ 1920w | JPG @ 1920w |
| Packaging / product shots | WebP @ 1600w | JPG @ 1600w |
| Small UI imagery | SVG or WebP | PNG |

## Caching

Files under `assets/` are cached aggressively — `Cache-Control: public,
max-age=31536000, immutable` (set via `netlify.toml`). If you update an
asset, bump the filename or add a query string in the HTML reference
(e.g. `?v=2`) to bust the cache.

## Referencing assets in HTML

Always use root-relative paths:

```html
<!-- Good -->
<img src="/assets/products/optishield/optishield-hv-spec-sheet.svg" alt="…">

<!-- Bad — breaks if page moves -->
<img src="../assets/products/optishield/...">
```
