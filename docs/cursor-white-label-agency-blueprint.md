# Cursor × Webwise Digital — White-Label AI Automation Blueprint

**For:** Saurabh Chugh, Founder  
**Site scanned:** https://www.webwisedigital.net (homepage v4, `/clinics-doctors/`, `/real-estate/`, `/white-label/`, blog, proposal generator, Webwise OS branches)  
**Date:** 14 August 2026  
**Rule:** This document does not change the live marketing site.

---

## Executive answer

Webwise is already positioned as an **AI customer acquisition system**, not a chatbot vendor. That is the right fight. Wati and Interakt sell inboxes. Webwise should sell **the operating system behind the inbox**: Smart Site + AI employee + lead record + review engine + Google/AEO + voice, with industry guardrails.

Cursor should **not** be resold as seats to clinic owners. Cursor should become Webwise’s **delivery factory**: Cloud Agents + Automations that generate, ship, and maintain branded client systems at agency speed. That is how a Delhi-based operator scales India’s SMB market without hiring a 20-person build team.

The highest-value, most scalable products to brand and resell:

| Rank | Product (Webwise brand) | Why it wins in India SMB | Cursor’s job |
|---|---|---|---|
| 1 | Niche Smart Site Factory | Every clinic/salon/broker still has a dead site | Generate design + copy + schema + WhatsApp CTA from a niche kit |
| 2 | LeadFlow OS (WhatsApp + records + handoff) | High demand; Wati/Interakt leave setup and ops empty | Encode playbooks, rules, Result Cards, CRM handoff |
| 3 | Reputation Intelligence | Reviews drive Maps; few agencies do sentiment + ask-flows | Monitor, classify, draft replies, weekly owner dashboard |
| 4 | AEO Content Engine | “Get Found on Google” is an add-on with no factory | Blogs, FAQs, GBP posts, video scripts from Knowledge Vault |
| 5 | Sales OS (Leak Score → Result Card → proposal) | Pricing lives on a call; close rate depends on founder | Auto-diagnose, cost-frame, generate proposal + demo |
| 6 | Voice / missed-call recovery | Maps now answers clinic calls; missed-call leak is real | Scripts, IVR trees, post-call WhatsApp | 
| 7 | Partner White-Label Desk | Agencies want to sell automation without a team | Same factory, partner-branded output |

Email automation and cold “scrape every new GSTIN” outreach are **secondary**. WhatsApp is the channel. Email is a D2C/B2B add-on. Prospecting must stay on **licensed/public data + consent**, not grey-hat scraping.

---

## 1. Positioning scan of webwisedigital.net

### 1.1 What the site actually sells

**Category line:** “AI Customer Acquisition Systems.”  
**Promise:** The business should not stop when the owner does. Enquiries at night, missed calls, and forgotten follow-up are the enemy.

**Hero proof:** A clinic WhatsApp thread at 11:47 PM — enquiry → 4-second reply → qualification → appointment request saved → next-morning lead stack. This is the product demo. It is stronger than any feature list.

**Diagnosis funnel:** 8-question **Leak Score** (90 seconds, score /100, three gaps). This is the sales wedge. It is not yet a productised Result Card.

**Leak Map narrative:** Marketing creates demand → enquiry waits (WA / IG / web / call) → buyer cools → system captures context. Correct India-SMB story. Competitors talk “chatbots.” Webwise talks **revenue leak**.

**Verticals named on homepage:** Real estate & architects, clinics & doctors, salons & spas, restaurants & hospitality, wedding planners & caterers, D2C brands.  
**Verticals with dedicated pages:** Clinics, Real estate. Salons, restaurants, weddings, D2C are promised, not built as landers. That is a delivery and SEO gap Cursor can close.

**Core stack (homepage “What We Build”):**

1. **AI Smart Site** — site talks, captures, routes  
2. **AI Employees** — answer, qualify, book, follow up  
3. **Business Automation** — capture, store, assign, follow up  

**Add-ons:** Reviews & Reputation · Get Found on Google (SEO/AEO/GEO language, thin on page) · AI Voice / IVR  

**Not on the public core list (but in the user brief / OS):** Social media, email, landing-page factory as a named SKU, lead-gen scraping.

**Trust architecture:** Guardrails, approved answers, human fallback, 14-day go-live, client owns data, no lock-in, pricing on strategy call. Founder story (Amex → e-com → affiliate → SaaS → systems) is operator-led, not agency-fluff.

**Conversion path:** WhatsApp (`+91 8796504200`) + in-site assistant + Leak Score. Forms on niche pages post to `wwds.app.n8n.cloud/webhook/webwise-lead-capture`. Delivery is already n8n-shaped.

**White-label page (`/white-label/`):** Sell under partner brand; Webwise builds websites, WhatsApp, reviews, Sheets/Zoho handoff. Thin page, no partner SKUs, no SLA, no OS login. High commercial potential, under-productised.

**Internal tools already in repo (not public SKUs):**

- `webwise-proposal-generator.html` — diagnose → plan → Razorpay (~₹20k/mo + lead cost). Real-estate flavoured.  
- **Webwise OS** (`cursor/webwise-os-spec-v2-4079`): Next.js tenant app with Home, Leads, WhatsApp, Reviews, Pages, Social, Voice, Reports, Billing, Discover, AI rules, plus **agency console** (delivery, flags, revenue, rules, tasks). Demo tenants for clinic and travel. Script layer is OpenAI-shaped and reversible.

### 1.2 Positioning strengths

- Category is **system vs tool**. That is how you beat SaaS on price conversations.  
- Vertical safety (clinics: no medical advice, no EHR) is a moat Wati cannot copy in copy-paste bots.  
- Leak Score + Leak Map is a proprietary sales language.  
- “We run this system on our own agency first” is credible.  
- Data ownership + export is a trust closer for Indian owners who fear lock-in.

### 1.3 Positioning gaps (where Cursor adds premium value)

| Gap | Evidence | Risk if ignored |
|---|---|---|
| Vertical landers incomplete | Only clinics + RE live | Homepage over-promises; SEO leftover to Wati content farms |
| “Get Found on Google” is a slogan | No AEO playbook, 2 blog posts | Add-on cannot be sold at premium |
| Social / email missing from core | OS has `/social`; site does not | D2C and wedding clients still buy this elsewhere |
| Reviews = “ask after happy visit” | No sentiment, no Maps intelligence | Looks like a Wati template, not Reputation Intelligence |
| Sales still founder-dependent | Pricing FAQ = strategy call; Leak Score does not auto-issue a Result Card | Cannot scale inbound |
| White-label is a page, not a desk | No partner portal, no branded kits | Agencies churn to cheaper freelancers |
| Smart Site is not a factory | Static HTML per page | 14-day promise breaks at 20 concurrent clients |
| OS and marketing site are split | Correct technically; commercially unlinked | Client never “sees” Webwise OS as the product |

### 1.4 What India SMB actually buys (demand vs fulfilment)

High demand, chronically under-fulfilled:

1. **WhatsApp that books, not chats** — Wati/Interakt give the pipe; nobody installs industry rules, calendars, or staff handoff.  
2. **Google Maps + reviews** — discovery is Maps, not websites; Google answering clinic calls (your own blog) makes missed-call recovery urgent.  
3. **A site that captures WhatsApp** — owners still pay ₹8–25k for brochure sites that leak.  
4. **Follow-up that survives the star employee** — Knowledge Vault / tribal-knowledge thesis is right; almost no local agency operationalises it.  
5. **Proof of ROI** — Result Cards, leak ₹, show-rate. SaaS dashboards show message counts, not revenue.

Lower priority for this market: complex email journeys (except D2C), generic social calendars, “AI blog 30 posts/month” without GBP/Maps tie-in.

---

## 2. Cursor’s role (precise, so it stays premium)

**Cursor is the factory. Webwise is the brand. The client sees Webwise OS.**

Use Cursor for:

- Generating and maintaining **client Smart Sites** from niche kits  
- Turning Loom/Knowledge Vault into **approved playbooks + WhatsApp rules**  
- Drafting **AEO content, review replies, Result Cards, proposals**  
- Building **n8n + OS features** as Cloud Agents on a private repo  
- White-label **partner clones** of the same kit  

Do **not**:

- Put Cursor in front of a salon owner  
- Sell “we use ChatGPT” as the differentiator  
- Let agents write live marketing pages without the existing live-site lock  
- Scrape private portals, WhatsApp, or DND lists for lead gen  

---

## 3. High-value services Webwise can brand and resell

Each SKU below is **white-label ready**: partner or Webwise logo, same factory.

### SKU 1 — Niche Smart Site Factory (replace “landing pages”)

**Client promise:** A conversion site for *this* clinic / project / salon in days, not a brochure in weeks.  
**What’s included:** Niche template (clinic, RE, salon, restaurant, wedding, D2C), local copy, FAQ schema, GBP/WhatsApp CTAs, Leak Score embed, mobile-first, analytics.  
**Cursor:** Agent takes intake JSON (name, area, services, photos, hours, offer) → writes static page in the client kit repo → PR for human review → Vercel preview.  
**India fit:** High demand, owners compare on speed and WhatsApp button, not Figma.  
**Price band (indicative):** Setup ₹25k–₹75k; retain ₹5k–₹10k/mo for edits + AEO pages.  
**Why not Wati:** They do not ship the front door.

### SKU 2 — LeadFlow OS (core — already the homepage product)

**Client promise:** Enquiry → qualify → book/save → staff sees context. 14-day live.  
**What’s included:** WhatsApp Cloud API (or client’s WABA), approved scripts, kill-switch, human takeover, Sheets/Zoho/OS lead record, after-hours rules. Clinic-safe / RE-safe variants.  
**Cursor:** Maintain rule packs per niche in git; generate new tenant config from intake; regression-test scripts against “unknown question → human.”  
**Price band:** Setup ₹40k–₹1.2L; ₹12k–₹35k/mo depending on seats/volume.  
**Moat:** Guardrails + records + site, not the BSP.

### SKU 3 — Reputation Intelligence (upgrade add-on 04)

**Client promise:** Ask at the right moment, see sentiment, reply in brand voice, watch Maps.  
**What’s included:** Post-visit WhatsApp ask, Google review link, weekly digest (stars, themes, risk alerts), draft replies for 1–3★, competitor pin watch (public GBP data).  
**Cursor:** Classify new reviews; draft replies; produce owner PDF/WhatsApp “Reputation Card.”  
**India fit:** Clinics, hotels, salons live and die on Maps. Almost no local fulfilment beyond “please review” templates.  
**Price band:** ₹8k–₹18k/mo on top of LeadFlow.

### SKU 4 — AEO Content Engine (upgrade add-on 05)

**Client promise:** Show up in Google, Maps, and AI answers for *local intent*.  
**What’s included:** 4–8 AEO pages/month (service + locality), FAQ blocks, GBP post copy, 1 reel/script, internal links from Smart Site. Not generic blogs.  
**Cursor:** From Knowledge Vault + service list, generate draft pages that a human editor ships. Same factory as Smart Site.  
**India fit:** “SEO retainers” are oversold and under-delivered. AEO tied to booking intent is scarce.  
**Price band:** ₹12k–₹30k/mo.

### SKU 5 — Sales OS for Webwise (internal, then productised as Result Cards)

**Client-facing artefact:** Leak Score → **Result Card** (3 leaks, ₹/month at risk using niche ARPU, 14-day fix, investment vs leak). Then proposal + Razorpay.  
**Cursor:** After quiz/n8n payload, agent fills Result Card + proposal HTML (evolve `webwise-proposal-generator.html` into a multi-niche engine). Demo scheduling: WhatsApp slots, not Calendly-only.  
**Why it scales the agency:** Removes founder as the only closer. Partners can run the same card.  
**Do not sell this as a public SaaS first.** Use it to close. Later, sell “Revenue Leak Audit” as a ₹2,999–₹9,999 paid diagnostic.

### SKU 6 — Voice / missed-call recovery (add-on 06)

**Client promise:** Maps and missed calls become WhatsApp threads, not dead air.  
**What’s included:** IVR/voice for FAQs + booking *intent*; missed-call → WhatsApp in <2 min; clinic: no diagnosis.  
**Cursor:** Generate trees and post-call messages from the same rule pack as chat.  
**Price band:** ₹15k–₹40k/mo (voice minutes billed through). Premium, not the first SKU for tiny salons.

### SKU 7 — Knowledge Vault → AI Employee (blog thesis, productised)

**Client promise:** Best receptionist becomes the blueprint.  
**What’s included:** 5 Looms → playbooks → approved WhatsApp/voice scripts → OS rules. “Do not automate chaos” as a paid workshop (₹15k) that upsells LeadFlow.  
**Cursor:** Transcribe, structure playbook markdown, propose rules, flag unsafe medical/legal lines.

### SKU 8 — Partner White-Label Desk

**Partner promise:** They sell; Webwise OS builds; their logo on site, WA display name, proposals.  
**What’s included:** SKU 1–4 kits, partner pricing, delivery board already sketched in OS `/agency`.  
**Cursor:** Clone tenant kit, swap brand tokens, open partner-branded preview.

### SKUs to sequence later (not first-wave)

- **Smart Email:** D2C + B2B only (abandoned cart, post-purchase, broker drip). India SMB owners live on WhatsApp. Productise after LeadFlow is stable.  
- **Net-new business prospecting:** Use **MCA/GST public datasets, Google Business Profile APIs, and licensed lists**. Classify by niche + city + “no WhatsApp CTA on site.” Outreach via **consented / DND-compliant** WhatsApp templates. Do not scrape protected portals or run unsolicited spam. This is a Webwise *internal* growth engine first, then a “new clinic in Dwarka this month” add-on for partners.

---

## 4. Differentiation vs Wati, Interakt, and generic SaaS

| Dimension | Wati / Interakt | Generic site + ads agency | **Webwise** |
|---|---|---|---|
| Unit of sale | WhatsApp inbox / chatbot SaaS | Hours and posts | **Acquisition system** (site + AI + record + reviews + Google + voice) |
| Who does setup | Client or cheap freelancer | Designer | **14-day install** with niche kits |
| Industry risk | Generic bot | None | **Clinic-safe / RE-safe guardrails** in writing |
| Proof | Message volume | Vanity traffic | **Leak Score + Result Card + show/won outcomes in OS** |
| Data | Vendor cloud | Scattered | **Client-owned records, export, no lock-in** |
| After-hours | Bot if configured | Nobody | **Default 24/7 with human morning stack** |
| Maps / Google AI | Not their job | SEO PDF | **Missed-call + Maps thesis already on the blog** |
| Change velocity | Ticket to vendor | New SOW | **Cursor factory: page/script PR in hours** |
| Partner motion | Reseller of seats | Subcontract | **White-label system, not a BSP login** |

**One-line close:** *They rent you a pipe. We install the business that uses the pipe — and we can rebuild it when your offer changes.*

Sales rule: never compete on per-conversation price. Compete on **₹ leaked per month** vs **₹ subscription**. Result Cards make that math visible.

---

## 5. Execution roadmap — Cursor inside Webwise OS

Do not merge OS into the marketing repo’s public root. Keep the live-site lock. OS stays a **separate Vercel project** (`webwise-os/`), as the spec branch already states.

### Phase 0 — Operating rules (this week)

1. One **client kit repo** (or monorepo folder) per tenant: `sites/{tenant}/`, `rules/{tenant}.json`, `vault/{tenant}/`.  
2. Cursor Cloud Agent allowed paths: kits + OS. **Forbidden:** `index.html`, niche marketing pages, sitemap, unless founder confirms.  
3. Every agent PR needs: niche, tenant, “reversible: true”, human approve before WhatsApp/prod.  
4. n8n remains the runtime bus (you already capture leads there). OS is the system of record UI.

### Phase 1 — Factory for what you already sell (Smart Site + LeadFlow)

**Goal:** 14-day go-live becomes a checklist, not a hero week.

| Step | Owner | Cursor job | Client sees |
|---|---|---|---|
| Intake | WhatsApp / Leak Score | Normalize JSON | Same quiz |
| Kit generate | Agent | Clone niche template, fill copy, schema, WA links | Preview URL |
| Rules pack | Agent + you | Approved Q&A, fallback, clinic stops | Demo chat |
| Connect | You / n8n | WABA, webhook, Sheets/OS | Live thread |
| Handoff | OS | Staff login, kill-switch, morning stack | Webwise OS `/home` |

**OS screens to wire first (already stubbed):** `/whatsapp`, `/leads`, `/ai` (rules + kill), `/home` onboarding steps.

**Done when:** A second clinic can be spun from kit without rewriting HTML by hand.

### Phase 2 — Reputation + Pages (sell add-ons 04–05 for real)

- `/reviews`: ingest Google reviews (official APIs), sentiment tags, approve-reply flow (action already exists: `approveReviewAction`).  
- `/pages`: AEO drafts from Cursor → request/approve/toggle (actions already exist).  
- Weekly WhatsApp **Reputation Card** + **Visibility Card** to the owner — not a login nag.

**Done when:** Add-ons have artefacts owners forward to their CA/partner, not “we posted a blog.”

### Phase 3 — Sales OS (scale the founder)

1. Leak Score payload → Cursor generates **Result Card** (PDF/HTML + WA).  
2. Multi-niche proposal engine (today’s generator is RE/lead-gen flavoured; extend to clinic LeadFlow, salon chairs, restaurant reservations).  
3. Cost framing: niche ARPU table (implant consult, site visit, salon slot) × missed enquiries × close rate. Honest ranges, not fake case studies (white-label page already forbids those).  
4. Demo scheduling: Result Card CTA books a 20-min WhatsApp video or in-person Dwarka slot.

**Done when:** A partner can send a Result Card without you on the first call.

### Phase 4 — White-label desk + Voice + Social

- Agency console already has delivery, flags, revenue, tasks. Turn it into **partner view**: their clients, their brand tokens, your build SLA.  
- `/voice` and `/social` last: only after LeadFlow + reviews print money. Social = GBP posts + 4 WhatsApp status/reel scripts from the Content Engine, not a full IG agency.

### Phase 5 — Internal prospecting (compliant)

- Weekly agent job: public sources → “new/underserved clinics in NCR with no WA CTA.”  
- Output: classified list + suggested Result Card. Human sends template messages.  
- This SKU stays internal until legal/DND process is boringly clean.

---

## 6. 90-day commercial sequence (no calendar padding — by dependency)

**Now — productise language (site copy later, when you confirm):**  
Smart Site Factory · LeadFlow OS · Reputation Intelligence · AEO Engine · Result Card. Stop listing six equal bullets. Core vs add-on is already correct; name the factory.

**Next — two more niche kits:** Salon, then restaurant. Homepage already sells them. Each kit = lander + WA rules + Result Card math. Cursor clones from clinic kit.

**Then — OS demo as the close:** Strategy call is a walkthrough of `meera@kapoordental.in` (already in OS README), not a slide deck. “This login is what your receptionist opens at 9am.”

**Then — partner SKU:** 3 Delhi agencies get white-label LeadFlow + Smart Site at wholesale. You keep WABA / OS. They keep the client.

**Do not hire** a content team or a WhatsApp “operator farm” first. Hire **one** delivery lead who approves Cursor PRs and n8n credentials.

---

## 7. Suggested packaging (for proposals, not for the live site yet)

**Webwise Core (required):** Smart Site + LeadFlow OS + Leak Score baseline.  
**Protect:** Reputation Intelligence.  
**Grow:** AEO Engine.  
**Recover:** Voice / missed-call.  
**Partner:** White-Label Desk.

Investment story (aligned with existing generator): **monthly system fee + optional qualified-lead or content units**. Always show **leak ₹ vs fee ₹** on the Result Card.

---

## 8. Risks and non-goals

- **BSP dependency:** Keep Meta WABA portable; Webwise OS stores rules and records so a Wati export is not the business.  
- **Hallucination in clinics:** Never let Cursor auto-publish medical copy. Same FAQ as the clinic page.  
- **Live site lock:** Factory writes tenant kits, not webwisedigital.net homepage.  
- **Tool-chasing:** n8n + OS + Cursor is enough. Do not add another chatbot SaaS as the product.  
- **Spam growth:** Unsolicited scrape-and-blast will burn the WABA and the brand.

---

## 9. Founder checklist (actionable)

1. Freeze SKU names above; map every WhatsApp enquiry to one SKU.  
2. Turn Leak Score output into a Result Card template (HTML is enough).  
3. Extract clinic page + RE page into **kit templates** Cursor can clone.  
4. Keep Webwise OS on its own Vercel project; connect n8n → `/leads`.  
5. Sell Reputation Intelligence as the first add-on with a weekly card.  
6. Offer white-label only after two kits exist (clinic + one more).  
7. Use Cursor Cloud Agents on `sites/` and `webwise-os/` only.  
8. Walk every close through the OS demo tenant, not a PDF of features.

---

*Scan basis: live homepage positioning, clinic and real-estate service pages, white-label partner page, tribal-knowledge and Google Maps clinic posts, n8n lead webhook, proposal generator, and the in-progress Webwise OS (agency + client shells, leak-score lib, reviews/pages/WhatsApp/voice/social modules).*
