(function () {
  const OS = window.WEBWISE_OS;
  const app = document.getElementById("app");
  const KEY = "webwise_os_session";

  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
    }[c]));
  }

  function session() {
    try { return JSON.parse(sessionStorage.getItem(KEY) || "null"); }
    catch { return null; }
  }
  function setSession(user) { sessionStorage.setItem(KEY, JSON.stringify(user)); }
  function clearSession() { sessionStorage.removeItem(KEY); }

  function route() {
    const hash = (location.hash || "#/login").replace(/^#/, "");
    const parts = hash.split("/").filter(Boolean);
    return { view: parts[0] || "login", rest: parts.slice(1) };
  }

  function go(path) {
    location.hash = path.startsWith("#") ? path : "#/" + path.replace(/^\//, "");
  }

  const NAV_CLIENT = [
    ["overview", "▣", "Command Center"],
    ["landing", "◈", "Landing Pages"],
    ["whatsapp", "◉", "WhatsApp"],
    ["reviews", "★", "Reviews"],
    ["seo", "↗", "SEO · AEO · GEO"],
    ["social", "▦", "Social"],
    ["voice", "☎", "Voice AI"],
    ["billing", "₹", "Billing"],
    ["reports", "▤", "Reports"],
    ["onboarding", "→", "Onboarding"]
  ];
  const NAV_AGENCY = [
    ["catalog", "☰", "Service catalog"],
    ["niches", "◎", "Niches"],
    ["competitors", "⚔", "Competitors"],
    ["blueprint", "⬡", "Platform blueprint"],
    ["levers", "⚡", "Execution levers"]
  ];

  function clinicData() {
    return OS.clients.clinics;
  }

  function renderLogin(err) {
    app.innerHTML = `
      <div class="bg-grid"></div>
      <div class="login-shell">
        <div class="login-copy">
          <div>
            <a class="brand-lock" href="/"><span class="brand-mark">W</span> WEBWISE <span style="color:var(--cyan)">OS</span></a>
            <h1>Log in. See an AI agency <span>running.</span></h1>
            <p class="lede">${esc(OS.brand.promise)} Built for clinics, hospitality, real estate, D2C — and the next wave of travel, CA firms, and high-volume manual industries.</p>
            <div class="proof-row">
              <span class="proof-chip">Landing · WhatsApp · Reviews</span>
              <span class="proof-chip">SEO / AEO / GEO</span>
              <span class="proof-chip">Social + Voice AI</span>
              <span class="proof-chip">14-day automated onboarding</span>
            </div>
          </div>
          <p class="lede">Webwise Digital · New Delhi · India’s AI automation partner</p>
        </div>
        <div class="login-panel">
          <form class="card" id="loginForm">
            <div class="pill"><i></i> Client portal</div>
            <h2>Enter Webwise OS</h2>
            <p class="sub">Onboarding, live services, billing, and reports in one login.</p>
            <label for="email">Email</label>
            <input id="email" name="email" type="email" autocomplete="username" required placeholder="you@business.com" />
            <label for="password">Password</label>
            <input id="password" name="password" type="password" autocomplete="current-password" required />
            <div class="err" id="loginErr">${esc(err || "")}</div>
            <div class="login-actions">
              <button class="btn btn-primary" type="submit">Enter the OS →</button>
              <button class="btn btn-ghost" type="button" data-demo="client@webwise">Demo: clinic client</button>
              <button class="btn btn-ghost" type="button" data-demo="agency@webwise">Demo: agency command</button>
              <button class="btn btn-teal" type="button" data-demo="new@webwise">Demo: new client onboarding</button>
            </div>
            <div class="demo-box">
              Demo access (password for all: <b>demo123</b>)<br>
              client@webwise · agency@webwise · new@webwise
            </div>
          </form>
        </div>
      </div>`;

    document.getElementById("loginForm").addEventListener("submit", (e) => {
      e.preventDefault();
      auth(document.getElementById("email").value.trim().toLowerCase(), document.getElementById("password").value);
    });
    app.querySelectorAll("[data-demo]").forEach((btn) => {
      btn.addEventListener("click", () => auth(btn.getAttribute("data-demo"), "demo123"));
    });
  }

  function auth(email, password) {
    const user = OS.demoUsers[email];
    if (!user || user.password !== password) {
      renderLogin("Those credentials are not recognised. Use a demo account or ask Webwise for an invite.");
      return;
    }
    setSession(Object.assign({ email }, user));
    go(user.onboardingComplete ? "overview" : "onboarding");
  }

  function requireUser() {
    const user = session();
    if (!user) {
      renderLogin();
      return null;
    }
    return user;
  }

  function shell(user, active, inner) {
    const agencyNav = user.role === "agency"
      ? `<div class="nav-sec">Agency OS</div>${NAV_AGENCY.map(n => navBtn(n, active)).join("")}`
      : "";
    app.innerHTML = `
      <div class="bg-grid"></div>
      <div class="os">
        <aside class="sidebar" id="sidebar">
          <div class="side-brand">
            <span class="brand-mark">W</span>
            <div>WEBWISE OS<small>${esc(user.business)}</small></div>
          </div>
          <div class="nav-sec">Operations</div>
          ${NAV_CLIENT.map(n => navBtn(n, active)).join("")}
          ${agencyNav}
          <div class="side-foot">
            <div class="who"><b>${esc(user.name)}</b><span>${esc(user.email)} · ${esc(user.role)}</span></div>
            <button class="logout" id="logout" type="button">Sign out</button>
          </div>
        </aside>
        <section class="main">
          <button class="btn btn-ghost btn-sm menu-toggle" id="menuBtn" type="button">Menu</button>
          ${inner}
        </section>
      </div>`;
    document.getElementById("logout").onclick = () => { clearSession(); go("login"); };
    document.getElementById("menuBtn").onclick = () => document.getElementById("sidebar").classList.toggle("open");
    app.querySelectorAll("[data-go]").forEach((el) => {
      el.addEventListener("click", () => go(el.getAttribute("data-go")));
    });
  }

  function navBtn(n, active) {
    return `<button class="nav-btn${n[0] === active ? " active" : ""}" data-go="${n[0]}" type="button"><span class="ic">${n[1]}</span>${n[2]}</button>`;
  }

  function header(title, sub) {
    return `<div class="top">
      <div>
        <div class="pill"><i></i> AI-first operations</div>
        <h1>${esc(title)}</h1>
        <p>${esc(sub)}</p>
      </div>
      <div class="live-chip">● System live · agents on duty</div>
    </div>`;
  }

  function renderOverview(user) {
    const d = clinicData();
    const kpis = d.kpis.map((k) => `<div class="kpi"><span>${esc(k.label)}</span><b>${esc(k.value)}</b><em>${esc(k.delta)}</em></div>`).join("");
    const mods = OS.services.core.concat(OS.services.upsell).map((s) => `
      <button class="mod" data-go="${esc(s.module)}" type="button">
        <div class="status ${s.status === "live" ? "" : "off"}">${s.status === "live" ? "Agent live" : "Available upsell"}</div>
        <h3>${esc(s.name)}</h3>
        <p>${esc(s.summary)}</p>
      </button>`).join("");
    const feed = d.activity.map((a) => `<div class="feed-item"><time>${esc(a.t)}</time><div><b>${esc(a.title)}</b><span>${esc(a.detail)}</span></div></div>`).join("");
    shell(user, "overview", `
      ${header("Command Center", user.role === "agency" ? "Agency view — this is what every client should feel on login." : `Welcome back, ${user.name}. Your acquisition system did not sleep.`)}
      <div class="kpis">${kpis}</div>
      <div class="grid-2">
        <div class="panel">
          <div class="pill"><i></i> Live activity</div>
          <h3 style="margin:8px 0 14px">Overnight capture — clinic playbook</h3>
          <div class="feed" id="liveFeed">${feed}</div>
        </div>
        <div class="panel">
          <div class="pill">Leak map</div>
          <h3 style="margin:8px 0 8px">Where money was leaking</h3>
          <p class="meta">After-hours replies, missed calls, and review asks were the three biggest gaps. Core OS is closing them. Voice AI is the next lever.</p>
          <div class="progress"><i style="width:82%"></i></div>
          <button class="btn btn-primary btn-sm" data-go="voice" type="button">Activate Voice AI</button>
          <button class="btn btn-ghost btn-sm" data-go="reports" type="button">Open report</button>
        </div>
      </div>
      <div class="mods">${mods}</div>
    `);
  }

  function renderLanding(user) {
    const p = clinicData().landing;
    const rows = p.variants.map((v) => `<tr><td>${esc(v.name)}</td><td>${v.visitors}</td><td>${esc(v.conv)}</td><td>${esc(v.status)}</td></tr>`).join("");
    shell(user, "landing", `
      ${header("Landing Studio", "Niche pages that talk, capture, and route — not brochure sites.")}
      <div class="kpis">
        <div class="kpi"><span>Primary URL</span><b style="font-size:18px">${esc(p.url)}</b><em>${esc(p.status)}</em></div>
        <div class="kpi"><span>Visitors (30d)</span><b>${p.visitors.toLocaleString("en-IN")}</b><em>organic + ads + maps</em></div>
        <div class="kpi"><span>Conv. to chat</span><b>${esc(p.conv)}</b><em>WhatsApp + site AI</em></div>
        <div class="kpi"><span>Lever</span><b style="font-size:16px">UTM → lead</b><em>${esc(OS.levers[0].line)}</em></div>
      </div>
      <div class="panel">
        <h3>Active variants</h3>
        <table><thead><tr><th>Page</th><th>Visitors</th><th>Conv</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
      </div>
    `);
  }

  function renderWhatsapp(user) {
    const chats = clinicData().chats.map((c) => `
      <div class="chat-row ${c.unread ? "unread" : ""}">
        <div>
          <b>${esc(c.from)}</b>
          <div class="meta">${esc(c.channel)} · ${esc(c.time)} ago · ${esc(c.state)}</div>
          <div>${esc(c.preview)}</div>
        </div>
        <button class="btn btn-ghost btn-sm" type="button">Open</button>
      </div>`).join("");
    shell(user, "whatsapp", `
      ${header("Conversation OS", "White-label WhatsApp at the core — Instagram, Messenger, and site chat in the same rail.")}
      <div class="grid-2">
        <div class="panel">
          <div class="pill"><i></i> Unified inbox</div>
          ${chats}
        </div>
        <div class="panel">
          <h3>AI agent</h3>
          <p class="meta">Replies from approved clinic rules. Unknowns route to reception. Every lead is recorded.</p>
          <ul class="meta">
            <li>Speed-to-lead: 4.2s</li>
            <li>Handoff SLA: under 8 min in hours</li>
            <li>Broadcasts: review ask + appointment reminder</li>
          </ul>
          <p class="take">${esc(OS.levers[1].line)}</p>
        </div>
      </div>
    `);
  }

  function renderReviews(user) {
    const r = clinicData().reviews;
    shell(user, "reviews", `
      ${header("Reputation Engine", "Ask when they are happiest. Recover when they are not.")}
      <div class="kpis">
        <div class="kpi"><span>Asks sent</span><b>${r.asked}</b><em>post-visit trigger</em></div>
        <div class="kpi"><span>Reviews in</span><b>${r.submitted}</b><em>${r.avg} avg</em></div>
        <div class="kpi"><span>Recovered</span><b>${r.recovered}</b><em>private WhatsApp</em></div>
        <div class="kpi"><span>Pending</span><b>${r.pending}</b><em>staff to close</em></div>
      </div>
      <div class="panel"><p>${esc(OS.levers[2].line)}</p></div>
    `);
  }

  function renderSeo(user) {
    const rows = clinicData().seo.map((s) => `<tr><td>${esc(s.q)}</td><td>${esc(s.pos)}</td><td>${esc(s.change)}</td><td>${esc(s.type)}</td></tr>`).join("");
    shell(user, "seo", `
      ${header("Discover Agent", "SEO for Google. AEO for AI answers. GEO for maps and generative engines.")}
      <div class="panel">
        <table><thead><tr><th>Query / entity</th><th>Position</th><th>Change</th><th>Layer</th></tr></thead><tbody>${rows}</tbody></table>
        <p class="take" style="margin-top:14px">${esc(OS.levers[3].line)}</p>
      </div>
    `);
  }

  function renderSocial(user) {
    const rows = clinicData().social.map((s) => `<tr><td>${esc(s.when)}</td><td>${esc(s.channel)}</td><td>${esc(s.title)}</td><td>${esc(s.status)}</td></tr>`).join("");
    shell(user, "social", `
      ${header("Social Desk", "Proof-of-work content. DMs join Conversation OS — not a separate vendor.")}
      <div class="panel">
        <table><thead><tr><th>When</th><th>Channel</th><th>Asset</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
        <p class="take" style="margin-top:14px">${esc(OS.levers[4].line)}</p>
      </div>
    `);
  }

  function renderVoice(user) {
    const rows = clinicData().calls.map((c) => `<tr><td>${esc(c.who)}</td><td>${esc(c.when)}</td><td>${esc(c.result)}</td><td>${esc(c.dur)}</td></tr>`).join("");
    shell(user, "voice", `
      ${header("Voice Bridge", "Missed calls become bookings. Every call drops a WhatsApp summary.")}
      <div class="panel">
        <table><thead><tr><th>Caller</th><th>When</th><th>Outcome</th><th>Duration</th></tr></thead><tbody>${rows}</tbody></table>
        <p class="take" style="margin-top:14px">${esc(OS.levers[5].line)}</p>
        <button class="btn btn-primary" style="margin-top:12px" type="button">Request Voice AI activation</button>
      </div>
    `);
  }

  function renderBilling(user) {
    const rows = clinicData().invoices.map((i) => `<tr><td>${esc(i.id)}</td><td>${esc(i.period)}</td><td>${esc(i.items)}</td><td>${esc(i.amount)}</td><td>${esc(i.status)}</td></tr>`).join("");
    shell(user, "billing", `
      ${header("Billing", "Core OS retainer plus module add-ons. No mystery invoices.")}
      <div class="panel">
        <table><thead><tr><th>Invoice</th><th>Period</th><th>Modules</th><th>Amount</th><th>Status</th></tr></thead><tbody>${rows}</tbody></table>
      </div>
    `);
  }

  function renderReports(user) {
    shell(user, "reports", `
      ${header("Reporting", "Plain-language weekly digest — the Ryze lesson: reports clients actually read.")}
      <div class="grid-3">
        <div class="panel"><h3>Acquisition</h3><p class="meta">186 leads · 4.2s AI reply · 74 appointments. After-hours share: 41%.</p></div>
        <div class="panel"><h3>Conversion</h3><p class="meta">Landing-to-chat 9.4%. Qualified-to-booked 62%. No-show reminders cut misses.</p></div>
        <div class="panel"><h3>Compound</h3><p class="meta">31 new Google reviews. 3 recoveries. Local pack held. Implant query +4.</p></div>
      </div>
    `);
  }

  function renderOnboarding(user) {
    const done = user.onboardingComplete;
    const steps = OS.onboardingSteps.map((s, i) => {
      const complete = done || i < 2;
      return `<div class="ob-item ${complete ? "done" : ""}">
        <div><b>${s.id}. ${esc(s.title)}</b><div class="meta">${esc(s.hint)}</div></div>
        <span class="status ${complete ? "" : "off"}">${complete ? "Done" : "Next"}</span>
      </div>`;
    }).join("");
    const pct = done ? 100 : 33;
    shell(user, "onboarding", `
      ${header("Onboarding rail", "WebinarKit lesson: go-live is a product. Motivation is highest on day one.")}
      <div class="panel">
        <div class="pill">14-day go-live</div>
        <div class="progress"><i style="width:${pct}%"></i></div>
        <div class="ob-list">${steps}</div>
        ${done ? "" : `<button class="btn btn-primary" id="finishOb" type="button" style="margin-top:16px">Mark profile complete & enter OS</button>`}
      </div>
    `);
    const fin = document.getElementById("finishOb");
    if (fin) {
      fin.onclick = () => {
        const u = session();
        u.onboardingComplete = true;
        setSession(u);
        go("overview");
      };
    }
  }

  function renderCatalog(user) {
    const card = (s, kind) => `
      <div class="panel">
        <div class="status ${kind === "core" ? "" : "off"}">${kind === "core" ? "Core" : "Upsell"}</div>
        <h3>${esc(s.name)}</h3>
        <p class="meta">${esc(s.summary)}</p>
        <p><b>Automation:</b> ${esc(s.automation)}</p>
        <p><b>Conversion:</b> ${esc(s.conversion)}</p>
        <p><b>Retention:</b> ${esc(s.retention)}</p>
      </div>`;
    shell(user, "catalog", `
      ${header("Service catalog", "Core system first. Add-ons when the leak score says so.")}
      <h3>Core</h3>
      <div class="grid-3">${OS.services.core.map((s) => card(s, "core")).join("")}</div>
      <h3 style="margin-top:22px">Upsells</h3>
      <div class="grid-3">${OS.services.upsell.map((s) => card(s, "upsell")).join("")}</div>
    `);
  }

  function renderNiches(user) {
    const cur = OS.niches.current.map((n) => `
      <div class="panel">
        <div class="pill">${esc(n.code)}</div>
        <h3>${esc(n.name)}</h3>
        <p>${esc(n.outcome)}</p>
        <p class="meta">${esc(n.playbook)}</p>
        <div class="meta">KPIs: ${n.kpis.map(esc).join(" · ")}</div>
      </div>`).join("");
    const exp = OS.niches.expansion.map((n) => `
      <div class="panel">
        <div class="status off">Expansion</div>
        <h3>${esc(n.name)}</h3>
        <p>${esc(n.ripe)}</p>
        <p class="meta">${esc(n.playbook)}</p>
        <p class="take">Wedge: ${esc(n.wedge)}</p>
      </div>`).join("");
    shell(user, "niches", `
      ${header("Niche switcher", "Same OS. Playbooks and KPIs swap. Built to add travel, CA, and high-volume manual industries without a new product.")}
      <h3>Currently served</h3>
      <div class="grid-3">${cur}</div>
      <h3 style="margin-top:22px">Expansion</h3>
      <div class="grid-3">${exp}</div>
    `);
  }

  function renderCompetitors(user) {
    const html = OS.competitors.map((c) => `
      <div class="panel comp">
        <div class="pill">${esc(c.type)}</div>
        <h3>${esc(c.name)}</h3>
        <p class="meta">${esc(c.scale)}</p>
        <ul>${c.effective.map((e) => `<li>${esc(e)}</li>`).join("")}</ul>
        <p class="take">Takeaway — ${esc(c.takeaway)}</p>
      </div>`).join("");
    shell(user, "competitors", `
      ${header("Competitor bench", "Steal the operating patterns. Differentiate as India’s AI automation agency OS — not another BSP.")}
      ${html}
    `);
  }

  function renderBlueprint(user) {
    const mods = OS.blueprint.modules.map((m) => `<div class="panel"><h3>${esc(m.name)}</h3><p class="meta">${esc(m.purpose)}</p></div>`).join("");
    const flows = OS.blueprint.flows.map((f) => `<div class="lever"><b>${esc(f.name)}</b>${esc(f.steps)}</div>`).join("");
    const ux = OS.blueprint.ux.map((u) => `<li>${esc(u)}</li>`).join("");
    shell(user, "blueprint", `
      ${header("Platform blueprint", OS.blueprint.principle)}
      <div class="mods">${mods}</div>
      <div class="grid-2" style="margin-top:16px">
        <div class="panel"><h3>System flows</h3><div class="levers">${flows}</div></div>
        <div class="panel"><h3>UI / UX doctrine</h3><ul>${ux}</ul></div>
      </div>
    `);
  }

  function renderLevers(user) {
    const html = OS.levers.map((l) => `<div class="lever"><b>${esc(l.service)}</b>${esc(l.line)}</div>`).join("");
    shell(user, "levers", `
      ${header("Execution levers", "One line per service. This is how the OS is sold, delivered, and retained.")}
      <div class="panel levers">${html}</div>
    `);
  }

  const views = {
    login: () => renderLogin(),
    overview: (u) => renderOverview(u),
    landing: (u) => renderLanding(u),
    whatsapp: (u) => renderWhatsapp(u),
    reviews: (u) => renderReviews(u),
    seo: (u) => renderSeo(u),
    social: (u) => renderSocial(u),
    voice: (u) => renderVoice(u),
    billing: (u) => renderBilling(u),
    reports: (u) => renderReports(u),
    onboarding: (u) => renderOnboarding(u),
    catalog: (u) => renderCatalog(u),
    niches: (u) => renderNiches(u),
    competitors: (u) => renderCompetitors(u),
    blueprint: (u) => renderBlueprint(u),
    levers: (u) => renderLevers(u)
  };

  function draw() {
    const { view } = route();
    if (view === "login") {
      if (session()) {
        go("overview");
        return;
      }
      renderLogin();
      return;
    }
    const user = requireUser();
    if (!user) return;
    if (user.role !== "agency" && ["catalog", "niches", "competitors", "blueprint", "levers"].includes(view)) {
      renderOverview(user);
      return;
    }
    (views[view] || views.overview)(user);
  }

  window.addEventListener("hashchange", draw);
  if (!location.hash) location.hash = session() ? "#/overview" : "#/login";
  else draw();
})();
