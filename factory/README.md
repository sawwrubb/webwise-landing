# Webwise Kit Factory

Dogfood first. Templates second. Sell third.

Live homepage, `/clinics-doctors/`, and `/real-estate/` are **not** generated from here. Those stay locked until this lab is trusted.

## How to use

```bash
node factory/generate.mjs
```

Writes `preview/` (noindex pages):

| Path | What |
|---|---|
| `/preview/` | Lab index |
| `/preview/webwise/` | **Client zero** — Webwise on Webwise |
| `/preview/clinics/` | Clinic filling |
| `/preview/real-estate/` | Property filling |
| `/preview/salons/` | Salon filling |
| `/preview/restaurants/` | Restaurant filling |
| `/preview/weddings/` | Wedding filling |
| `/preview/d2c/` | D2C filling |

Each kit folder also has `rules.json` (WhatsApp guardrails) and `result-card.json` (leak math).

## Clone a niche

1. Copy `factory/kits/clinics.json` to `factory/kits/my-niche.json`
2. Change `id` (URL slug), copy, chat, rules, Result Card numbers
3. Keep `status: "template"` until Webwise dogfood feels boring
4. Run `node factory/generate.mjs`

Do not loosen clinic `never` medical rules.

## When to sell

Only after:

1. `/preview/webwise/` is the real enquiry door you actually use
2. One niche clone (clinic) is a JSON change, not a rewrite
3. Founder approves promoting a kit off `noindex`
