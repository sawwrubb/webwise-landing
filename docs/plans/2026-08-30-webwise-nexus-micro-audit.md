# Webwise Digital — NEXUS-Micro audit + TODAY backlog

**Date:** 2026-08-30  
**Mode:** NEXUS-Micro (bounded audit + plan)  
**Live site:** https://www.webwisedigital.net/  
**Constraint:** No published marketing page, CSS, JS, or sitemap edits until the founder types `I confirm live site edits`.

Skills requested under `.cursor/skills/` and `.cursor/agency-agents/` are **not in this repo**. Process followed from Superpowers brainstorming/writing-plans/verification rules plus public Agency briefs (Agents Orchestrator, Reality Checker, marketing-campaign runbook).

---

## A. Classification

**BOUNDED audit + plan.** Design: map claimed offer vs buyer path; fetch live URLs; grep repo; rank gaps by money/time; write 5–8 TODAY tasks that live in `docs/` or unlinked HTML; stop for niche + live-edit confirmation.

**Specialists (roles applied, files missing locally):**

| Role | Lead on |
|------|---------|
| Agents Orchestrator | Pipeline, stop-gates, TODAY vs live-edit split |
| Business Strategist | Two-product collision (CAS vs property lead-gen) |
| Sales Discovery Coach | Leak score / chat / WA prefill quality |
| Offer / Lead-gen Strategist | SKUs, add-ons, proposal generator |
| Growth Hacker | Funnel leaks, 404 niches, CTA copy |
| SEO Specialist | Sitemap, Search Console meta, thin/404 niches |
| Sprint Prioritizer | Clinics as 14-day wedge |
| Reality Checker | Default **NEEDS WORK**; no invented metrics |

**Reality Checker:** Homepage is a brochure + client-side quiz + rule-based chat. Two niche pages have forms. That is **not** a certified CRM/automation system. Status: **NEEDS WORK**.

---

## B. Evidence table

Verified 2026-08-30 via live fetch/curl and repo read. No conversion %, volume, or revenue numbers (none exist in repo or public pages).

| URL or file | Claim on site | Reality in repo | Gap | Revenue / automation impact |
|---|---|---|---|---|
| https://www.webwisedigital.net/ | Smart Site + WhatsApp + Instagram + Messenger; “every lead recorded”; “We run this exact system in our own agency first.” | Channel pills in `index.html`. Chat is keyword rules in `homepage-v4.js`. Quiz email is not POSTed. No IG/Messenger API, pixel, or CRM write on homepage. | Dogfood is asserted, not shown as numbers or a public lead log. | Buyers cannot inspect proof; close depends on founder WhatsApp. |
| `index.html` nav Pricing | Label “Pricing” | `wa.me/918796504200` strategy-call prefill. FAQ: pricing only on call. | No starting SKU, no self-serve checkout on CAS. | High-intent “Pricing” click becomes a call request; slower close. |
| `index.html` hero CTAs | “Watch My Business Run” / “See It Work” | Prefill: `Please enter your niche here` | Buyer must edit the message. | Extra friction on the primary CTA. |
| `index.html` `#niches` + footer | Links to `/salons/`, `/restaurants/`, `/weddings/`, `/d2c/` | No folders in repo. Live `curl -sI` → **HTTP 404** (`x-vercel-error: NOT_FOUND`). Clinics + RE exist. | Four of six industry promises 404. | Trust and SEO damage; wasted clicks. |
| https://www.webwisedigital.net/clinics-doctors/ | Clinic WhatsApp OS, Sheets/Zoho handoff, 14-day story implied via homepage FAQ | Substantial page + demo form POSTs `https://wwds.app.n8n.cloud/webhook/webwise-lead-capture`. GET/HEAD on webhook = 404 (common for n8n; **POST not tested** — would create a fake lead). QuickReply widget + WA. | Capture exists on this page only. Delivery kit/SOP not in repo. | Best current close path. If webhook fails, form falls back to WA (coded). |
| https://www.webwisedigital.net/real-estate/ | Portal → site-visit WhatsApp OS | Same n8n webhook + form. Strong copy, no case studies. | Same as clinics. | Second productized page; competes with proposal SKU (below). |
| `homepage-v4.js` quiz | “Send report”; answers stay with Webwise; 3 biggest gaps | Score is local math. Email collected then opened into chat. Chip `handoff leak score` matches `handoff` and opens **generic** WA: “speak to a human…” — **score, email, answers omitted**. | Leak score is not a lead record. | Highest-volume homepage tool does not enrich CRM or founder inbox. |
| `index.html` add-ons 04–06 | Reviews, Google, AI Voice/IVR “add anytime” | Copy only. No SKU, no package HTML, no delivery checklist. | Unsellable add-ons. | Leave money on the table; every quote is custom. |
| Homepage FAQ | “Live in 14 days once inputs ready” | No intake checklist, no day-by-day SOP in repo. | Claim without operating system. | Founder re-scopes every deal. |
| Blog https://www.webwisedigital.net/blog/ | Leak Score is “top-of-funnel utility”; clusters for Salon OS, etc. | 2 live posts. Hub lists “planned” posts. CTA to `/#quiz` (same leak). | Thin cluster; planned pages not built. | SEO promise ahead of inventory. |
| https://www.webwisedigital.net/white-label/ | Agency white-label delivery | Live **200**. **Not** in `sitemap.xml`. No partner SKU/SOP. | Hidden channel. | Partner revenue not indexed or packaged. |
| https://www.webwisedigital.net/webwise-proposal-generator.html | Shareable proposal + Razorpay | Live **200**, unlisted. Default **₹20,000/mo** + CPL for **property lead generation**, not CAS. Hash-encoded client data in URL. Apps Script + `no-cors`. UI still mentions tiiny.host. | Second product colliding with homepage CAS. | Confused sales story; possible public PII in URL hashes. |
| `index.html` + others | Search Console | `<meta name="google-site-verification" content="" data-webwise-pending="search-console" />` | Empty verification meta. File `google20d10aa51b4528ba.html` exists. | Indexing/Search Console setup incomplete on-page. |
| `sitemap.xml` | Listed URLs only | Live `curl` **200**. WebFetch tool returned **500** once (treat as tool flake unless reproduced). Omits white-label, proposal, data-deletion. | Incomplete index of live URLs. | Partners/legal pages less discoverable. |

---

## C. Offer gaps (max 8), ranked

1. **Homepage leak score + chat never become a structured lead** — score/email/answers dropped on WA handoff; no n8n POST from quiz.  
2. **Four niche tiles 404** — salons, restaurants, weddings, D2C.  
3. **CAS has no SKU; property proposal has ₹20k + CPL** — two businesses, one brand.  
4. **Primary CTAs are generic WA with “enter your niche”** — Pricing = call.  
5. **Add-ons not packaged** — reviews / Google / IVR.  
6. **No proof artifacts** — no case studies, before/after, or dogfood metrics in repo or live HTML.  
7. **14-day install is a sentence, not a kit** — no delivery SOP, intake, or QA checklist.  
8. **White-label + proposal are live but off-sitemap / off-homepage** — ops and partner motion invisible.

---

## D. Scale plan

### TODAY (this work block — no live confirmation)

Internal factory docs + unlinked kit. **Do not** edit `index.html`, niche marketing pages, CSS, JS, or `sitemap.xml`.

### 14 days — productize **Clinics & Doctors** first (recommendation)

**Why (evidence, not vibes):** homepage night demo is a clinic implant flow; `/clinics-doctors/` is the thickest service page; clinic blog post exists; admin/clinical guardrails are already written (faster compliance). Real estate is a close second but the proposal generator sells a **different** property product (lead gen + CPL), which would muddy a 14-day CAS wedge.

14-day outcome: one clinic install kit, one WhatsApp close script, one SKU ladder, one dogfood capture (Webwise’s own WA) written as numbers only if true.

### 90 days — factory

Templates per remaining niche; WA close scripts; delivery SOP; retainer menu; partner white-label rate card; leak-score → CRM as default; proof page only with real installs.

---

## E. TODAY execution backlog (do not start until founder says `go`)

Each 15–45 min. **Owner** = Agency role. **Done-when** = file exists and can be used on a call without opening the homepage editor.

1. **Offer SKU ladder (CAS + add-ons)**  
   - Path: `docs/playbooks/offer-skus.md`  
   - Owner: Offer / Lead-gen Strategist  
   - Done-when: Core / Core+Reviews / Core+Google / IVR add-on lines; starting rupee bands marked “internal until live-site yes”; CAS vs property-CPL called out as separate products.

2. **WhatsApp close script + leak-score payload**  
   - Path: `docs/playbooks/whatsapp-close-script.md`  
   - Owner: Sales Discovery Coach  
   - Done-when: Openers for clinic vs RE vs generic; required fields (niche, volume, reply time, tool); paste-ready message **including leak score + answers** (the payload homepage should send after live-edit).

3. **Clinic delivery kit (Webwise delivery kit v1)**  
   - Paths: `docs/delivery-kits/clinics/README.md`, `intake.md`, `14-day-checklist.md`, `guardrails.md`  
   - Owner: Sprint Prioritizer + Reality Checker  
   - Done-when: Day 0–14 checklist, admin-only WhatsApp scope, Sheets/Zoho handoff fields, go-live QA, no medical-advice rules copied from live clinic page (attribution: live FAQ).

4. **Inbound triage SOP (one-founder ops)**  
   - Path: `docs/playbooks/inbound-triage.md`  
   - Owner: Business Strategist  
   - Done-when: SLA, qualify/disqualify, when to send proposal generator vs CAS quote, QuickReply vs homepage chat.

5. **Unlinked leak-score handoff spec** (not wired to live JS)  
   - Path: `docs/specs/leak-score-handoff.md`  
   - Owner: Growth Hacker  
   - Done-when: Exact `wa.me` template, JSON for n8n (`source`, `score`, `answers[]`, `email`, `page`), and note that implementing it in `homepage-v4.js` needs live-site confirmation.

6. **Property product boundary**  
   - Path: `docs/playbooks/product-boundary-cas-vs-leadgen.md`  
   - Owner: Business Strategist  
   - Done-when: When to use `webwise-proposal-generator.html` vs clinic/RE CAS; warning that proposal URLs hash client data.

7. **White-label partner one-pager (unlinked)**  
   - Path: `docs/playbooks/white-label-partner.md`  
   - Owner: Offer Strategist  
   - Done-when: What partner sells, what Webwise delivers, what not to promise (mirrors live white-label: no fake case studies).

### Live-site edits — parked until `I confirm live site edits`

- Stop 404s: stub niche pages **or** point tiles to `/#quiz` / WhatsApp with niche prefilled.  
- Quiz: POST to n8n; WA prefill with score + answers (fix `handoff leak score` matching generic handoff).  
- Hero CTA: niche-specific prefills or a niche picker.  
- Optional: starting-at SKU on Pricing.  
- Sitemap: white-label (and data-deletion if desired).  
- Search Console: fill verification meta or rely on `google20d10aa51b4528ba.html` only.

---

## F. Stop gates

1. Which niche to productize first? (Recommendation: **clinics**; alternative: **real estate** if the 14-day goal is the ₹20k lead-gen motion.)  
2. Type **`I confirm live site edits`** before any marketing HTML/CSS/JS/sitemap change.  
3. Type **`go`** to execute TODAY tasks 1–7 (docs only).
