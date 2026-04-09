---
title: APEAX Portal — Deploy Runbook
version: 1.0
date: 2026-04-09
owner: CIPHER
audience: Josh
---

# Deploy Runbook — apeax.com.au

One-time setup steps, in order. Do each block, then tell CIPHER the output.

## Block 1: GitHub Repo

1. Go to https://github.com/new
2. Owner: `ASI-Josh`
3. Repository name: `apeax-distribution`
4. Description: `Online Sales Point and Client Ordering Portal for APEAX XTREME Series films. Australian exclusive distribution by ASI.`
5. Visibility: **Public**
6. Do NOT initialise with README, .gitignore, or license. We'll push those in the first commit.
7. Create repository.
8. Copy the repo URL: `https://github.com/ASI-Josh/apeax-distribution.git`

CIPHER then pushes the scaffolded files as commit 1.

## Block 2: Netlify Project

1. Go to https://app.netlify.com
2. Click "Add new site" → "Import an existing project"
3. Choose GitHub, authorise if needed
4. Select `ASI-Josh/apeax-distribution`
5. Branch: `main`
6. Publish directory: `public`
7. Build command: *(leave blank — static site, no build)*
8. Deploy site
9. Once deployed, rename the site in Netlify:
   - Settings → Change site name → `apeax-distribution`
   - Default URL becomes `apeax-distribution.netlify.app`

## Block 3: Netlify DNS Zone

Crazy Domains cannot set A/CNAME records for Netlify's edge reliably, and Netlify DNS is free and integrated, so we point the domain at Netlify's nameservers.

1. In Netlify: Domain management → Add custom domain → `apeax.com.au`
2. Netlify asks to verify ownership — choose "Use Netlify DNS"
3. Netlify will generate 4 nameservers, typically:
   - `dns1.p03.nsone.net`
   - `dns2.p03.nsone.net`
   - `dns3.p03.nsone.net`
   - `dns4.p03.nsone.net`
   (your actual values will be shown in the Netlify UI)
4. Copy all 4 nameservers
5. Also add `www.apeax.com.au` as an alias pointing to the apex

## Block 4: Crazy Domains NS Records

1. Log into Crazy Domains
2. Domains → apeax.com.au → Manage
3. Nameservers → Use custom nameservers
4. Replace the Crazy Domains defaults with the 4 Netlify nameservers from Block 3
5. Save

DNS propagation for .com.au typically completes in 30 minutes to 4 hours. Netlify will auto-provision Let's Encrypt SSL once propagation is detected.

## Block 5: SSL Confirmation

1. In Netlify: Domain management → HTTPS
2. Wait for "Certificate issued" status
3. Enable "Force HTTPS"
4. Visit https://apeax.com.au to confirm padlock

## Block 6: GA4 + Search Console

1. Create a new GA4 property: `apeax.com.au`
2. Copy the Measurement ID (G-XXXXXXX)
3. CIPHER adds it to `scripts/lib/analytics.js`
4. Push commit
5. Verify data flowing in GA4 realtime

6. Go to https://search.google.com/search-console
7. Add property: `https://apeax.com.au`
8. Verify via DNS TXT record (add via Netlify DNS → Records → Add)
9. Submit sitemap: `https://apeax.com.au/sitemap.xml`

## Block 7: Email for SHIELD

SHIELD needs an email inbox for installer correspondence. Options:

- **Recommended:** `shield@asi-australia.com.au` as a distribution group on the existing Google Workspace, auto-forwarding to SHIELD's Gmail agent inbox
- Alt: `shield@apeax.com.au` via Netlify DNS + Google Workspace routing ($)

Recommendation: use the existing ASI Workspace group to avoid a second Workspace licence. All SHIELD outbound can sign as "SHIELD, ASI Distribution Division, apeax.com.au".

## Block 8: Environment Variables

Set these in Netlify → Site settings → Environment variables:

| Variable | Value |
|----------|-------|
| `ASI_PORTAL_API_URL` | (ASI Portal production endpoint) |
| `ASI_PORTAL_API_KEY` | (SHIELD service account token) |
| `JWT_SECRET` | (generated 64-char secret for trade session tokens) |
| `XERO_CLIENT_ID` | (existing, mirror from asi-custom-website if reused) |
| `XERO_CLIENT_SECRET` | (existing) |
| `GA4_MEASUREMENT_ID` | (from Block 6) |
| `SHIELD_ALERT_EMAIL` | `shield@asi-australia.com.au` |

Never commit these to the repo. The Netlify Functions read them from `process.env`.

## Rollback Plan

If a deploy breaks the live site:

1. Netlify → Deploys → previous green deploy → "Publish deploy"
2. Push a fix to `main`, re-deploy
3. If the breakage is serious, lock deploys while fixing: Netlify → Deploys → Stop auto publishing

The repo is single-branch for now. Every deploy is traceable. Every breakage is reversible in under 60 seconds.
