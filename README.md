# APEAX Distribution Portal

**Live:** https://apeax.com.au
**Division:** ASI Distribution Division (ASI Australia)
**Operations agent:** SHIELD
**Status:** Active

Online Sales Point and Client Ordering Portal for the APEAX XTREME Series
performance films — window film, paint protection film, graffiti film,
radiant heat rejection film. Run by Advanced Surface Innovations Pty Ltd (ASI)
as Australia's exclusive APEAX distributor.

---

## Architecture

- **Frontend:** Static HTML/CSS/JS, no framework, no build step
- **Hosting:** Netlify, auto-deploy on push to `main`
- **Backend:** ASI Portal ([asiportal.live](https://asiportal.live)) via
  SHIELD service account. Netlify Functions under `/api/apeax/*` proxy
  requests to the portal and inject `SHIELD_API_KEY` server-side.
- **Trade sessions:** 7-day HS256 JWT issued by ASI Portal, stored in
  browser session storage. Portal verifies every authenticated call.

```
┌────────────────────────────┐
│  apeax.com.au (this repo)  │
│  Static HTML + forms       │
└──────────────┬─────────────┘
               │ /api/apeax/*
               ▼
┌────────────────────────────┐
│  Netlify Functions (this)  │
│  Thin proxy + JWT handling │
│  Injects SHIELD_API_KEY    │
└──────────────┬─────────────┘
               │ /api/apeax/*
               ▼
┌────────────────────────────┐
│  ASI Portal backend        │
│  asiportal.live            │
│  Firestore + SHIELD logic  │
└────────────────────────────┘
```

---

## Repo structure

```
apeax-distribution/
├── public/                       # Netlify publish root
│   ├── index.html                # Landing gate (passenger | heavy split)
│   ├── passenger.html            # Passenger category hub
│   ├── heavy.html                # Heavy vehicle category hub
│   ├── optishield-hv.html        # OptiShield heavy vehicle detail
│   ├── quote.html                # Public quote form
│   ├── warranty.html             # Warranty registration info
│   ├── _shared.css               # Shared styles
│   └── trade/
│       ├── login.html            # Installer login
│       ├── apply.html            # Trade account application
│       └── dashboard.html        # Authenticated installer dashboard
├── netlify/
│   └── functions/
│       ├── health.js             # Uptime probe
│       ├── quote-request.js      # POST public quote
│       ├── trade-application.js  # POST public trade app
│       ├── trade-login.js        # POST installer login
│       ├── trade-dashboard.js    # GET installer dashboard
│       ├── trade-order.js        # POST installer order
│       ├── stock.js              # GET installer stock view
│       └── _lib/
│           └── portal.js         # Shared ASI Portal client + helpers
├── docs/                         # Source specs from CIPHER
│   ├── 00-PROJECT-BRIEF.md
│   ├── 01-BRAND-SYSTEM.md
│   ├── 02-SHIELD-AGENT-SOP.md
│   ├── 03-REPO-SCAFFOLD.md
│   ├── 04-ORDER-WORKFLOW.md
│   └── 05-DEPLOY-RUNBOOK.md
├── netlify.toml                  # Redirects, headers, CSP, function config
├── package.json                  # Runtime metadata (no dependencies)
└── README.md                     # This file
```

---

## Local preview

```bash
# Simple static preview (no functions)
npx serve public

# Full Netlify dev with functions
npx netlify dev
```

The full `netlify dev` mode runs the functions locally. You'll need to set
the required env vars in a local `.env` (never commit) — see next section.

---

## Environment variables (Netlify dashboard)

| Variable | Purpose |
|---|---|
| `PORTAL_BASE_URL` | ASI Portal backend URL (`https://asiportal.live`) |
| `SHIELD_API_KEY` | SHIELD service account token — matches the value set on the ASI Portal Netlify project |
| `GA4_MEASUREMENT_ID` | GA4 measurement ID for analytics |

**Security:** `SHIELD_API_KEY` must never reach the browser. Only Netlify
Functions on the server side read it from `process.env` when constructing
the `X-SHIELD-API-Key` header on outbound requests to `asiportal.live`.

---

## API routes (handled by Netlify redirects)

Public (no auth):
- `POST /api/quote-request` → proxy to ASI Portal `/api/apeax/quote-request`
- `POST /api/trade-application` → proxy to ASI Portal `/api/apeax/trade-application`
- `POST /api/trade-login` → proxy, returns installer JWT on success

Installer (JWT required):
- `GET /api/trade-dashboard` → installer profile, orders, stock
- `POST /api/trade-order` → place new distribution order
- `GET /api/stock` → filtered stock view with installer pricing

Operational (not exposed here):
- Health: `GET /api/health` → internal uptime probe only
- SHIELD-only operations (queue, approve, reject, validate) are called
  directly against `asiportal.live` by SHIELD via MCP tools or internal
  admin UI, not through this frontend.

---

## Deploy

Pushing to `main` triggers an auto-deploy on Netlify. Deployment takes
~30 seconds for a static site. Rollback: Netlify → Deploys → previous
green deploy → "Publish deploy".

See `docs/05-DEPLOY-RUNBOOK.md` for full DNS/SSL setup notes.

---

## Operations

Day-to-day distribution ops are run by **SHIELD**, the APEAX Distribution
Agent. See `docs/02-SHIELD-AGENT-SOP.md` for SHIELD's authority, vetting
gate, and escalation rules. SHIELD reports weekly to ATHENA via
`push_department_report` on the ASI Portal.

---

## License

All rights reserved. Advanced Surface Innovations Pty Ltd (ASI Australia).
APEAX and XTREME SERIES are trademarks of their respective owners.
