(function () {
  "use strict";

  var cfg = window.VCI_COUNTDOWN;
  if (!cfg) return;

  var DAY_MS = 24 * 60 * 60 * 1000;
  var startAt = Date.parse(cfg.startAt);
  if (!Number.isFinite(startAt)) return;

  var durationMs = Math.max(1, Number(cfg.durationDays) || 14) * DAY_MS;
  var pad = function (n) {
    return String(Math.max(0, n)).padStart(2, "0");
  };

  function endAt(now) {
    var end = startAt + durationMs;
    if (!cfg.autoReset) return end;
    if (now <= end) return end;
    var elapsed = now - startAt;
    var cycles = Math.floor(elapsed / durationMs);
    return startAt + (cycles + 1) * durationMs;
  }

  function remaining(now) {
    var ms = Math.max(0, endAt(now) - now);
    var days = Math.floor(ms / DAY_MS);
    var hours = Math.floor((ms % DAY_MS) / 3600000);
    var minutes = Math.floor((ms % 3600000) / 60000);
    var seconds = Math.floor((ms % 60000) / 1000);
    return { ms: ms, days: days, hours: hours, minutes: minutes, seconds: seconds };
  }

  function progressPct(now) {
    var windowStart = endAt(now) - durationMs;
    var elapsed = Math.min(durationMs, Math.max(0, now - windowStart));
    return Math.round((elapsed / durationMs) * 1000) / 10;
  }

  function dayIndex(now) {
    var windowStart = endAt(now) - durationMs;
    var elapsedDays = Math.floor((now - windowStart) / DAY_MS) + 1;
    return Math.min(cfg.durationDays, Math.max(1, elapsedDays));
  }

  function setDigit(el, value) {
    if (!el) return;
    var next = pad(value);
    if (el.textContent === next) return;
    el.textContent = next;
    el.classList.remove("tick");
    void el.offsetWidth;
    el.classList.add("tick");
  }

  function sanitizeHref(href) {
    try {
      var url = new URL(href, window.location.href);
      if (url.protocol === "https:" || url.protocol === "http:" || url.protocol === "mailto:") {
        return url.href;
      }
    } catch (e) {
      /* ignore */
    }
    if (typeof href === "string" && href.charAt(0) === "#") return href;
    return "#";
  }

  function bindCtas(root) {
    var primary = root.querySelector("[data-cta=primary]");
    var secondary = root.querySelector("[data-cta=secondary]");
    if (primary) {
      primary.textContent = cfg.primaryCta.label;
      primary.setAttribute("href", sanitizeHref(cfg.primaryCta.href));
    }
    if (secondary) {
      secondary.textContent = cfg.secondaryCta.label;
      secondary.setAttribute("href", sanitizeHref(cfg.secondaryCta.href));
    }
  }

  function mount(root) {
    if (!root) return;
    document.documentElement.classList.remove("no-js");
    bindCtas(root);

    var daysEl = root.querySelector("[data-unit=days]");
    var hoursEl = root.querySelector("[data-unit=hours]");
    var minutesEl = root.querySelector("[data-unit=minutes]");
    var secondsEl = root.querySelector("[data-unit=seconds]");
    var bar = root.querySelector("[data-progress]");
    var dayNote = root.querySelector("[data-day-note]");
    var kicker = root.querySelector("[data-kicker]");
    var live = false;
    var timerId = 0;

    function paint() {
      var now = Date.now();
      var left = remaining(now);
      if (left.ms <= 0) {
        root.classList.add("expired");
        if (kicker) kicker.textContent = cfg.liveHeadline;
        if (timerId) window.clearInterval(timerId);
        return;
      }
      setDigit(daysEl, left.days);
      setDigit(hoursEl, left.hours);
      setDigit(minutesEl, left.minutes);
      setDigit(secondsEl, left.seconds);
      if (bar) bar.style.width = progressPct(now) + "%";
      if (dayNote) {
        dayNote.textContent =
          "Day " + dayIndex(now) + " of " + cfg.durationDays + " — daily progress is live.";
      }
      if (kicker && !live) {
        kicker.textContent = cfg.headline;
        live = true;
      }
    }

    paint();
    root.setAttribute("data-ready", "true");
    timerId = window.setInterval(paint, 1000);
  }

  window.VCICountdown = {
    remaining: remaining,
    progressPct: progressPct,
    mount: mount
  };

  function start() {
    var roots = document.querySelectorAll("[data-vci-countdown]");
    if (!roots.length) return;
    for (var i = 0; i < roots.length; i += 1) mount(roots[i]);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }

  window.setTimeout(function () {
    var root = document.querySelector("[data-vci-countdown]");
    if (root && root.getAttribute("data-ready") !== "true") {
      document.documentElement.classList.add("js-failed");
    }
  }, 2500);
})();
