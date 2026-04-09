---
title: APEAX Distribution Portal — Project Brief
owner: CIPHER (build) + SHIELD (ops)
division: ASI Distribution Division
status: ACTIVE BUILD
started: 2026-04-09
---

# APEAX Distribution Portal

## One-Liner

A standalone, cinematic online Sales Point and Client Ordering Portal for APEAX XTREME Series films, positioning ASI as Australia's exclusive distributor and getting raw film material directly into vetted trade installers' hands. Not a shop. Not a microsite. A weapon.

## Strategic Purpose

1. Maximise ASI's exclusive AU distributorship by creating a dedicated commercial surface for APEAX that is distinct from asi-australia.com.au.
2. Recruit, vet, and onboard trade installers who are not already exclusively aligned to a competing film brand.
3. Streamline procurement from APEAX USA by funnelling all orders through a single validated pipeline with automatic ISO traceability.
4. Establish the ASI Distribution Division as an operationally independent arm, complementing the Service Division.
5. Build the commercial foundation the Films Management Module (already live in ASI Portal) was designed to feed.

## Scope Locked 2026-04-09

| Decision | Value |
|----------|-------|
| Domain | apeax.com.au (registered via Crazy Domains) |
| Hosting | Netlify, auto-deploy from GitHub main |
| Repo | github.com/ASI-Josh/apeax-distribution (new, standalone) |
| Stack | Static HTML/CSS/JS + GSAP for motion, same philosophy as ASI site |
| Landing gate | Split-screen PASSENGER \| HEAVY (Eurohub reference) |
| Deep aesthetic | Dark cinematic, condensed headline type, motion-driven |
| Access model | Hybrid: public marketing + quote-request (new) + direct-order (vetted trade accounts) |
| Pricing visibility | Public RRP shown, trade discount revealed behind installer login |
| Commerce | Order flow only, no payment processing |
| Target audience | Trade installers with NO exclusive alignment to competing film brands |
| Ops agent | SHIELD (new, dedicated, APEAX-only) |
| ISO integration | Every order creates an ASI Portal record for 9001/14001/45001 audit trail |

## Division Structure

ASI Pty Ltd (single ABN) now has two operational divisions:

- Service Division — existing five-sector field operations (Mass-Transit, Manufacturing, Wholesale/Trade, Structural, Marine)
- Distribution Division — new, APEAX-first, run through apeax.com.au and the SHIELD agent

Distribution presents publicly as a near-standalone brand (apeax.com.au has its own identity), but all invoices, warranties, compliance, and ISO records live inside ASI's existing Portal infrastructure.

## Build Phases

1. Foundations: brand system, repo scaffold, SHIELD agent SOP, order workflow map
2. Landing gate: split-screen PASSENGER \| HEAVY cinematic entry
3. Passenger side: Light Vehicle product range, installer flow, RRP display, quote form, trade login
4. Heavy side: Coach/Bus/Marine/Structural range, installer flow, RRP display, quote form, trade login
5. Trade account layer: vetted installer login, discount reveal, direct-order form
6. ASI Portal integration: order submission creates Portal record, SHIELD triage, GUARDIAN QA hold, Films Module warranty registration
7. Deploy: Netlify project, SSL, apeax.com.au DNS binding, GA4, Search Console
8. Launch: SHIELD live, installer recruitment sequence, soft-launch, hard-launch

## Success Metrics (12-month)

- 25+ vetted trade installer accounts onboarded nationally
- $450k+ distribution revenue through APEAX channel
- 100% orders traced through ASI Portal (zero off-book)
- <48hr quote-to-response SLA held by SHIELD
- Zero warranty claims unregistered in Films Module
