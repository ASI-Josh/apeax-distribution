---
title: APEAX Distribution Order Workflow
version: 1.0
date: 2026-04-09
owner: CIPHER + SHIELD
---

# Order Workflow: Portal → SHIELD → ASI → APEAX USA → ISO

Every order through apeax.com.au is a traceable ISO event. This document is the canonical flow. Divergence from it means something broke.

## Two Entry Paths

### Path A: Quote Request (new, unvetted installer)

```
1. Installer lands on apeax.com.au
2. Browses Passenger or Heavy category
3. Clicks "Request Quote" on a product
4. Fills quote.html form:
   - Business name, ABN
   - Contact name, email, phone
   - Primary sector (Passenger / Heavy / Marine / Structural / Aviation)
   - State / postcode
   - Brand exclusivity declaration (checkbox + free text)
   - Product(s) of interest, indicative quantities
   - Timeframe
5. Netlify function submit-quote.js:
   a. Validates payload (zod schema)
   b. Hits ASI Portal MCP: create_lead + create_leads_register_entry
   c. Fires an alert into SHIELD's queue (dead-drop or direct ATHENA push)
   d. Returns confirmation to installer with ticket reference
6. Installer sees thank-you screen with 48-hour response SLA
```

### Path B: Direct Order (vetted trade account)

```
1. Installer logs in at /trade/login
2. Session token issued by trade-login.js (Netlify function)
3. Installer sees dashboard with:
   - Order history
   - Stock availability
   - Trade pricing (RRP - discount band)
   - Quick reorder
4. Clicks "New Order" on a product
5. Fills order.html form with validated quantities
6. Netlify function trade-order.js:
   a. Validates token + account status
   b. Validates SKU + quantity against procurement manual rules
   c. Calculates price: EX-WORKS USD × 1.62 + freight + GST - trade discount
   d. Hits ASI Portal: create job record (type: APEAX_DISTRIBUTION_ORDER)
   e. Attaches order payload to job
   f. Returns confirmation to installer
7. Order lands in SHIELD queue with AUTO_VALIDATED flag
```

## SHIELD Triage Stage

Once the order or quote is in SHIELD's queue:

```
[Queue item arrives]
      |
      v
[SHIELD reviews within 48h business hours]
      |
  is this an approved trade account?
      |
   yes ────────┐         no ──────────┐
               v                      v
     [Validate order]         [Initiate vetting gate]
               |                      |
               v                      v
     [Stock check in       [ABN lookup, exclusivity
      Films Module]         check, trade credentials]
               |                      |
               v                      v
   in stock? ───┐           vet pass? ─┐
                                        
     yes ───> [Allocate from stock]   yes ──> [Approve account,
     no  ───> [Proceed to procure]             issue credentials,
                                               route to direct order]
               |                      no ──> [Log rejection,
               v                             12-month lockout]
     [Commit order to ASI Portal]
```

## ASI Procurement Stage

SHIELD hands off to ASI Procurement (which is the existing LEDGER+VANGUARD procurement path that handles APEAX USA orders today):

```
1. SHIELD creates a Purchase Order payload via Xero MCP (xero_create_purchase_order)
   - Supplier: APEAX USA (existing Xero contact)
   - Currency: USD
   - Line items: SKU + qty + EX-WORKS unit price
2. Purchase order sent to APEAX USA via xero_send_purchase_order
3. APEAX USA acknowledges, confirms lead time
4. Freight booked (air or sea, depending on urgency and size)
5. Customs + import duty handled by ASI's freight agent
6. Goods arrive at ASI HQ
```

## GUARDIAN QA Hold

On arrival at ASI HQ:

```
1. Goods received by ASI ops, logged via create_goods_received
2. GUARDIAN auto-triggers a batch QA inspection (ims_audit or ims_incident if issues)
3. Batch inspected against APEAX spec:
   - Roll dimensions correct
   - Film adhesion test (random sample)
   - Optical clarity spot check
   - Serial / batch numbers match PO
   - Packaging integrity
4. If PASS: GUARDIAN releases batch, stock available for allocation
5. If FAIL: GUARDIAN raises ims_incident, SHIELD escalates to ATHENA,
   APEAX USA notified, no release until resolved
```

## Release to Installer

Once the batch is released:

```
1. SHIELD matches batch to the pending trade order
2. SHIELD chooses fulfilment method:
   - Pickup from ASI HQ (preferred for Victorian installers)
   - Courier (StarTrack / TNT) for interstate
3. SHIELD logs dispatch via update_job (status: IN_TRANSIT)
4. Tracking number sent to installer via email
5. Installer confirms receipt
6. SHIELD updates job to DELIVERED
```

## Warranty Registration

Non-negotiable for every install:

```
1. Installer completes install on their end
2. Installer logs back into /trade/dashboard
3. Clicks "Register Warranty" for that order
4. Fills warranty registration form:
   - Install date
   - Asset details (VIN / vehicle ID / building ID / vessel ID)
   - Surfaces treated
   - Photos (pre, during, post)
5. Netlify function calls register_film_warranty on ASI Portal
6. Films Module creates the warranty record
7. SHIELD confirms via confirm_warranty_registration
8. Installer sees warranty certificate PDF
9. End customer can look up warranty via public warranty portal
```

## Invoicing + Close-Out

```
1. SHIELD closes the job: close_out_job
2. LEDGER creates the invoice: xero_create_invoice
   - Payment terms: 7 days (default) or negotiated per account
   - Westpac Business One as payment account
   - Line items ex-GST, GST applied separately, matches Portal record / 1.1
3. Invoice sent: xero_send_invoice
4. Job logged against Leads Register entry, stage updated to CLOSED_WON
5. SHIELD weekly report picks it up
```

## ISO Traceability Touchpoints

Every one of these events creates an auditable ASI Portal record:

| Event | Record type | ISO clause |
|-------|-------------|-----------|
| Quote created | Lead | 9001 8.2 |
| Trade account approved | Organization + Contact | 9001 8.4 |
| Order validated | Job | 9001 8.2.3 |
| PO to APEAX USA | Xero PO | 9001 8.4.1 |
| Goods received | Goods Received | 9001 8.4.2 |
| Batch QA inspection | IMS Audit | 9001 8.6 / 14001 / 45001 |
| Release to installer | Job status update | 9001 8.5.1 |
| Warranty registration | Films Module warranty | 9001 8.5.2 |
| Invoice issued | Xero Invoice | 9001 8.5.6 |
| Job close-out | Job closure | 9001 10.3 |

If any step is missing, GUARDIAN flags it on the weekly IMS audit and it becomes a corrective action.

## Failure Modes (with recovery)

| Failure | Recovery |
|---------|----------|
| Installer abandons quote mid-form | Session draft saved, email reminder at 24h |
| Trade login fails | Password reset link, SHIELD manual review if 3 fails |
| ASI Portal MCP timeout during order | Retry queue on Netlify function, 3 attempts, final failure emails SHIELD |
| APEAX USA stock shortage | SHIELD notifies installer, offers partial ship or 45-day hold |
| Freight delay | SHIELD updates ETA, notifies installer, logs note against job |
| GUARDIAN QA fail | Batch held, SHIELD notifies all installers in the queue, alt sourced or refunded |
| Warranty registration missed | GUARDIAN catches it at weekly audit, SHIELD chases installer |
| Invoice overdue >7 days | LEDGER follows up, SHIELD pauses further orders from that account |
| Trade account caught with exclusive competitor tie | Immediate account suspension, ATHENA escalation |
