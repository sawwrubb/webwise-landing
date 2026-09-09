# Voice Craft Institute — 14-day launch countdown

Standalone Vercel project for [thevoicecraftinstitute.com](http://thevoicecraftinstitute.com/). Kept in `clients/voice-craft-institute/` so it stays separate from the Webwise marketing site and other client folders.

## What ships

- Homepage hero countdown matching Voice Craft Institute: off-white page, navy type (`#1A2B56`), royal accent (`#2E5BFF`), gold stats bar and gold CTAs (`#F7E1A0`).
- 14-day window starting **2026-09-09T05:30:00.000Z** (edit `config.js`).
- Animated digits, launch progress bar, and a visible **Day X of 14** note.
- CTAs: **Book Your Demo** and **See Results**.
- After 14 days the digits and bar are removed; the live-system message remains (`autoReset: false`).
- Fallback copy if JavaScript is blocked or fails.
- Lightweight client-side timer (no backend). Safe to cache through Cloudflare.

## Fallback text

`System Launch in Progress – Countdown to Results. The 14-day launch window is underway. Book a demo to see the client acquisition system in action.`

## Local preview

```bash
cd clients/voice-craft-institute
python3 -m http.server 4173
```

Open `http://127.0.0.1:4173/`.

## Vercel — separate project / folder

Do **not** deploy this as the Webwise Digital root. Create a dedicated Vercel project:

1. Import the `sawwrubb/webwise-landing` GitHub repo (or a fork used only for this client).
2. Project name: `voice-craft-institute-countdown`.
3. **Root Directory:** `clients/voice-craft-institute`
4. Framework preset: Other.
5. Output: leave default (static HTML).
6. Deploy. Confirm the Vercel URL loads HTTPS.

Optional production domain on Vercel: `launch.thevoicecraftinstitute.com` or `countdown.thevoicecraftinstitute.com`.

### Homepage snippet (if the main site stays on another host)

Place this **above the fold** on the Voice Craft Institute homepage. Replace the script origin with the Vercel production URL:

```html
<div data-vci-embed></div>
<noscript>
  System Launch in Progress – Countdown to Results. The 14-day launch window is underway.
</noscript>
<script src="https://YOUR-VERCEL-DOMAIN/widget.js" async></script>
```

`widget.js` is sanitized (no `innerHTML`, href allowlist) and uses Shadow DOM so it cannot inherit hostile page scripts into the timer markup.

## Cloudflare

Point DNS through Cloudflare (orange-cloud proxy) for the countdown hostname.

1. **DNS:** CNAME `launch` → `cname.vercel-dns.com` (use the target Vercel shows for the domain).
2. **SSL/TLS:** Full (strict). Always Use HTTPS: On. Minimum TLS: 1.2.
3. **HTTPS:** Automatic HTTPS Rewrites: On.
4. **Security:** Bot Fight Mode or Super Bot Fight; WAF managed ruleset enabled; DDoS is on by default on the proxy.
5. **Caching:** Cache Rules
   - `*.js` / `*.css` / `*.svg` → Eligible for cache, Edge TTL 1 hour, Browser TTL 5 minutes.
   - HTML (`/`) → Eligible for cache, Edge TTL 2 minutes (timer math is client-side, so HTML cache is safe).
6. **Firewall custom rule (optional):** Challenge traffic with empty UA or obvious scrapers; allow `thevoicecraftinstitute.com` if you only embed from that origin.

Do not put secrets in `config.js`. The deadline is public by design.

## After the window

With `autoReset: false` the widget hides digits after expiry. Set `autoReset: true` in `config.js` only if a new 14-day cycle should restart automatically.
