(function () {
  "use strict";

  var DEFAULTS = {
    campaignId: "vci-acq-launch-2026-09",
    startAt: "2026-09-09T05:30:00.000Z",
    durationDays: 14,
    autoReset: false,
    headline: "System Launch in Progress – Countdown to Results.",
    liveHeadline: "The acquisition system is live. Results are in motion.",
    fallback: "System Launch in Progress – Countdown to Results. The 14-day launch window is underway.",
    primaryCta: {
      label: "Book Your Demo",
      href: "https://wa.me/918796504200?text=Hi%20Voice%20Craft%20Institute%2C%20I%27d%20like%20to%20book%20a%20demo."
    },
    secondaryCta: {
      label: "See Results",
      href: "#results"
    }
  };

  var cfg = Object.assign({}, DEFAULTS, window.VCI_COUNTDOWN || {});
  var DAY_MS = 24 * 60 * 60 * 1000;
  var startAt = Date.parse(cfg.startAt);
  if (!Number.isFinite(startAt)) return;

  var durationMs = Math.max(1, Number(cfg.durationDays) || 14) * DAY_MS;

  function pad(n) {
    return String(Math.max(0, n)).padStart(2, "0");
  }

  function endAt(now) {
    var end = startAt + durationMs;
    if (!cfg.autoReset) return end;
    if (now <= end) return end;
    var cycles = Math.floor((now - startAt) / durationMs);
    return startAt + (cycles + 1) * durationMs;
  }

  function sanitizeHref(href) {
    try {
      var url = new URL(href, window.location.href);
      if (url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:") return url.href;
    } catch (e) { /* ignore */ }
    if (typeof href === "string" && href.charAt(0) === "#") return href;
    return "#";
  }

  var css = [
    ":host{all:initial;font-family:Inter,system-ui,-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a2b56;display:block;}",
    ".wrap{background:#f7e1a0;border:1px solid rgba(26,43,86,.08);padding:22px 18px 18px;text-align:center;}",
    ".kicker{margin:0 0 14px;font-size:15px;font-weight:800;}",
    ".grid{display:grid;grid-template-columns:repeat(4,1fr);}",
    ".unit{position:relative;padding:4px 8px 8px;}",
    ".unit:not(:last-child)::after{content:'';position:absolute;right:0;top:18%;height:64%;width:1px;background:rgba(26,43,86,.18);}",
    ".digit{display:block;font-size:clamp(28px,5vw,44px);font-weight:800;letter-spacing:-.04em;line-height:1;font-variant-numeric:tabular-nums;}",
    ".label{display:block;margin-top:6px;font-size:11px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:#6b7289;}",
    ".bar{height:8px;margin:14px 0 8px;background:#fff6d8;border-radius:99px;overflow:hidden;}",
    ".bar>span{display:block;height:100%;width:0;background:#2e5bff;transition:width .6s ease;}",
    ".note{margin:0 0 14px;font-size:13px;font-weight:700;color:#24365f;}",
    ".actions{display:flex;justify-content:center;flex-wrap:wrap;gap:10px;}",
    "a{display:inline-flex;align-items:center;justify-content:center;min-height:44px;padding:10px 16px;border-radius:6px;font-size:13px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;text-decoration:none;}",
    ".primary{background:#fff;color:#1a2b56;border:1.5px solid #1a2b56;}",
    ".gold{background:#1a2b56;color:#f7e1a0;}",
    ".fallback{display:none;margin:0;color:#6b7289;font-size:14px;}",
    ".expired .grid,.expired .bar,.expired .note{display:none;}",
    "@media (max-width:640px){.grid{grid-template-columns:repeat(2,1fr);row-gap:12px;}.unit:nth-child(2)::after{display:none;}a{width:100%;}}"
  ].join("");

  function createWidget(host) {
    var shadow = host.attachShadow({ mode: "open" });
    var style = document.createElement("style");
    style.textContent = css;
    var wrap = document.createElement("div");
    wrap.className = "wrap";
    wrap.setAttribute("role", "timer");
    wrap.setAttribute("aria-live", "polite");

    var kicker = document.createElement("p");
    kicker.className = "kicker";
    kicker.textContent = cfg.headline;

    var grid = document.createElement("div");
    grid.className = "grid";
    var units = ["Days", "Hours", "Minutes", "Seconds"];
    var digits = {};
    units.forEach(function (label) {
      var unit = document.createElement("div");
      unit.className = "unit";
      var digit = document.createElement("span");
      digit.className = "digit";
      digit.textContent = label === "Days" ? "14" : "00";
      var lab = document.createElement("span");
      lab.className = "label";
      lab.textContent = label;
      unit.appendChild(digit);
      unit.appendChild(lab);
      grid.appendChild(unit);
      digits[label.toLowerCase()] = digit;
    });

    var bar = document.createElement("div");
    bar.className = "bar";
    var fill = document.createElement("span");
    bar.appendChild(fill);

    var note = document.createElement("p");
    note.className = "note";
    note.textContent = "Day 1 of 14 — daily progress is live.";

    var fallback = document.createElement("p");
    fallback.className = "fallback";
    fallback.textContent = cfg.fallback;

    var actions = document.createElement("div");
    actions.className = "actions";
    var primary = document.createElement("a");
    primary.className = "gold";
    primary.textContent = cfg.primaryCta.label;
    primary.setAttribute("href", sanitizeHref(cfg.primaryCta.href));
    var secondary = document.createElement("a");
    secondary.className = "primary";
    secondary.textContent = cfg.secondaryCta.label;
    secondary.setAttribute("href", sanitizeHref(cfg.secondaryCta.href));
    actions.appendChild(primary);
    actions.appendChild(secondary);

    wrap.appendChild(kicker);
    wrap.appendChild(grid);
    wrap.appendChild(bar);
    wrap.appendChild(note);
    wrap.appendChild(fallback);
    wrap.appendChild(actions);
    shadow.appendChild(style);
    shadow.appendChild(wrap);

    function paint() {
      var now = Date.now();
      var end = endAt(now);
      var ms = Math.max(0, end - now);
      if (ms <= 0) {
        wrap.classList.add("expired");
        kicker.textContent = cfg.liveHeadline;
        return false;
      }
      digits.days.textContent = pad(Math.floor(ms / DAY_MS));
      digits.hours.textContent = pad(Math.floor((ms % DAY_MS) / 3600000));
      digits.minutes.textContent = pad(Math.floor((ms % 3600000) / 60000));
      digits.seconds.textContent = pad(Math.floor((ms % 60000) / 1000));
      var windowStart = end - durationMs;
      var elapsed = Math.min(durationMs, Math.max(0, now - windowStart));
      fill.style.width = (Math.round((elapsed / durationMs) * 1000) / 10) + "%";
      var day = Math.min(cfg.durationDays, Math.max(1, Math.floor((now - windowStart) / DAY_MS) + 1));
      note.textContent = "Day " + day + " of " + cfg.durationDays + " — daily progress is live.";
      return true;
    }

    if (paint()) {
      var id = window.setInterval(function () {
        if (!paint()) window.clearInterval(id);
      }, 1000);
    }
  }

  function boot() {
    var nodes = document.querySelectorAll("[data-vci-embed]");
    if (!nodes.length) {
      var host = document.createElement("div");
      host.setAttribute("data-vci-embed", "auto");
      document.body.insertBefore(host, document.body.firstChild);
      createWidget(host);
      return;
    }
    for (var i = 0; i < nodes.length; i += 1) createWidget(nodes[i]);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
