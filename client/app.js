(() => {
  const STORE_USERS = "ww_users_v1";
  const STORE_SESSION = "ww_session_v1";
  const storeKey = (id) => `ww_account_${id}`;
  const GST = 0.18;
  const PRICE = {
    competitorPack: 1999,
    bundleList: 20000,
    bundlePartner: 10000,
    diy: { website: 80000, landing: 35000, whatsapp: 45000, reviews: 25000, staff: 60000 }
  };
  const STEPS = [
    { id: "account", label: "Account" },
    { id: "funnel", label: "Health quiz" },
    { id: "report", label: "Health check" },
    { id: "offer", label: "Offer" },
    { id: "onboarding", label: "Onboarding" },
    { id: "automation", label: "Meta automation" },
    { id: "reviews", label: "Reviews" },
    { id: "growth", label: "Growth add-ons" },
    { id: "complete", label: "Live" }
  ];

  const QUESTIONS = [
    { id: "businessType", q: "What kind of business are we checking?", h: "This sets your competitor benchmark and report copy.", a: [
      { v: "clinic", l: "Clinic or doctor", d: "Hospitals, clinics, dentists, specialists" },
      { v: "salon", l: "Salon or spa", d: "Salons, barbers, spas, beauty clinics" },
      { v: "realestate", l: "Real estate or architect", d: "Agents, builders, architects" },
      { v: "restaurant", l: "Restaurant or hospitality", d: "Restaurants, cafes, hotels" },
      { v: "wedding", l: "Wedding or catering", d: "Planners, caterers, events" },
      { v: "d2c", l: "D2C or local brand", d: "Online brands, retailers, services" }
    ]},
    { id: "hasWebsite", q: "Do you have a live website?", h: "A site is required later for Meta automation.", a: [
      { v: "strong", l: "Yes — updated in the last 12 months", d: "Fast, mobile, converting" },
      { v: "weak", l: "Yes — but outdated or slow", d: "Looks dated or does not convert" },
      { v: "none", l: "No website yet", d: "Social or Google only" },
      { v: "builder", l: "Only a template / Instagram bio link", d: "Not a dedicated business site" }
    ]},
    { id: "websiteType", q: "What website type do you want?", h: "Feeds the Smart Site build brief.", a: [
      { v: "smart", l: "AI Smart Site that talks to visitors", d: "Recommended" },
      { v: "landing", l: "Single high-converting landing page", d: "One offer, one action" },
      { v: "multi", l: "Multi-page brochure site", d: "About, services, contact" },
      { v: "unsure", l: "Not sure — recommend for me", d: "We will pick from your niche" }
    ]},
    { id: "designPref", q: "Which design direction feels right?", h: "Used in onboarding and the site brief.", a: [
      { v: "clinical", l: "Clean clinical / medical", d: "White space, trust, calm" },
      { v: "premium", l: "Premium dark + accent", d: "Webwise-style authority" },
      { v: "warm", l: "Warm lifestyle / hospitality", d: "Photos first, inviting" },
      { v: "minimal", l: "Minimal typography-led", d: "Quiet, expensive, simple" }
    ]},
    { id: "certs", q: "Which trust signals should the report and site show?", h: "Certifications, empaneled bodies, awards.", a: [
      { v: "clinical", l: "Clinical / NABH / board certifications", d: "Doctors, clinics, labs" },
      { v: "trade", l: "Trade, RERA or industry licences", d: "Property, construction" },
      { v: "fssai", l: "FSSAI / hospitality credentials", d: "Food, events" },
      { v: "none", l: "None yet — help me present trust", d: "We will use process + reviews" }
    ]},
    { id: "social", q: "How active is social media today?", h: "Benchmark vs the top domestic competitor.", a: [
      { v: "daily", l: "Posting most days", d: "Reels / posts running" },
      { v: "weekly", l: "A few posts a week", d: "Inconsistent" },
      { v: "dormant", l: "Profiles exist but quiet", d: "No system" },
      { v: "none", l: "No business profiles", d: "Start from zero" }
    ]},
    { id: "automation", q: "What happens when a lead messages after hours?", h: "This is the automation score.", a: [
      { v: "instant", l: "AI or staff replies in minutes", d: "Strong" },
      { v: "morning", l: "We reply next working morning", d: "Leakage" },
      { v: "missed", l: "Many messages go unanswered", d: "High leak" },
      { v: "none", l: "No WhatsApp / chat system", d: "Start here" }
    ]},
    { id: "reviews", q: "How are Google reviews requested?", h: "Feeds the reputation engine score.", a: [
      { v: "auto", l: "Automated after every visit", d: "Compounding" },
      { v: "manual", l: "Staff ask sometimes", d: "Hits and misses" },
      { v: "rarely", l: "Rarely or never", d: "Gap" },
      { v: "none", l: "We do not have a GBP process", d: "Bonus: GBP optimisation" }
    ]}
  ];

  const COMPETITORS = {
    clinic: { local: "North Delhi multi-chair clinic", youHint: "Your clinic", global: "US DSO implant brand" },
    salon: { local: "Premium salon chain (city lead)", youHint: "Your salon", global: "Drybar / international spa brand" },
    realestate: { local: "Top local channel partner desk", youHint: "Your project desk", global: "International property portal brand" },
    restaurant: { local: "Highest-rated neighbourhood restaurant", youHint: "Your restaurant", global: "Global casual-dining chain" },
    wedding: { local: "City wedding planner with 4.8 GBP", youHint: "Your studio", global: "Destination wedding house" },
    d2c: { local: "Category Amazon/D2C leader", youHint: "Your brand", global: "Global D2C benchmark brand" }
  };

  const EMAILS = [
    { day: 0, id: "e0", subject: "Your Webwise Digital Health Check is ready", body: "Your one-pager is in the portal. We scored website, social, landing page, automation and reviews against a top domestic competitor. Download it anytime from your dashboard." },
    { day: 1, id: "e1", subject: "Case study: the clinic that stopped missing night enquiries", body: "I'M Dental went live with Smart Site + WhatsApp + reviews. After-hours implant enquiries now get a reply in seconds. Same system we just scored for you." },
    { day: 3, id: "e2", subject: "What owners tell us after week two", body: "“We did not need more ads. We needed the system that never drops a lead.” — typical partner note. Your leak is still open until onboarding is finished." },
    { day: 5, id: "e3", subject: "Your competitor pack (₹1,999) — 24-hour TAT", body: "See two domestic competitors + one global benchmark. Order from the report page. Delivery inside 24 hours of payment confirmation." },
    { day: 7, id: "e4", subject: "72 hours left on the partner rate window", body: "DIY to rebuild website, chat, landing and reviews typically crosses ₹2L+ in vendor + staff cost. The bundled Client Acquisition System is ₹10,000 + GST / month at partner rate. Finish setup today." }
  ];

  const $ = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content;
  };
  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const today = () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const rupee = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const route = () => (location.hash.replace(/^#/, "") || "/").split("?")[0];
  const go = (path) => { location.hash = path; };

  const loadUsers = () => JSON.parse(localStorage.getItem(STORE_USERS) || "[]");
  const saveUsers = (u) => localStorage.setItem(STORE_USERS, JSON.stringify(u));
  const session = () => JSON.parse(localStorage.getItem(STORE_SESSION) || "null");
  const setSession = (s) => localStorage.setItem(STORE_SESSION, JSON.stringify(s));
  const clearSession = () => localStorage.removeItem(STORE_SESSION);
  const account = (id) => JSON.parse(localStorage.getItem(storeKey(id)) || "null");
  const saveAccount = (acc) => localStorage.setItem(storeKey(acc.userId), JSON.stringify(acc));

  const bufToHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  const randomHex = (n = 16) => bufToHex(crypto.getRandomValues(new Uint8Array(n)));
  const hashPass = async (pass, salt) => {
    const data = new TextEncoder().encode(`${salt}:${pass}`);
    return bufToHex(await crypto.subtle.digest("SHA-256", data));
  };
  const otp6 = () => String(Math.floor(100000 + Math.random() * 900000));

  const currentUser = () => {
    const s = session();
    if (!s || s.expires < Date.now()) { clearSession(); return null; }
    return loadUsers().find((u) => u.id === s.userId) || null;
  };

  const ensureAccount = (user) => {
    let acc = account(user.id);
    if (!acc) {
      acc = {
        userId: user.id,
        createdAt: Date.now(),
        answers: {},
        funnelIndex: 0,
        stage: "funnel",
        reportSent: false,
        competitorOrder: null,
        comparisonSeen: false,
        approved: false,
        onboarding: {
          company: "", address: "", phone: "", email: user.email || "",
          metaNumber: "", altNumber: "", website: "",
          websiteType: "", designPref: "", logoName: "", refs: "", certs: "",
          kyc: { aadhaar: null, gst: null, utility: null }
        },
        automation: { submitted: false, metaStatus: "pending", websiteOk: false },
        reviewsMod: { process: "", locations: "" },
        upsells: { social: null, emailAuto: null },
        inbox: [],
        nurtureArmed: false
      };
      saveAccount(acc);
    }
    return acc;
  };

  const completion = (user, acc) => {
    const checks = [
      !!user,
      user && user.verified,
      acc && Object.keys(acc.answers).length >= QUESTIONS.length,
      acc && acc.reportSent,
      acc && acc.comparisonSeen,
      acc && acc.approved,
      acc && onboardingPct(acc) === 100,
      acc && acc.automation.submitted,
      acc && acc.reviewsMod.process,
      acc && acc.upsells.social != null && acc.upsells.emailAuto != null
    ];
    const done = checks.filter(Boolean).length;
    return Math.round((done / checks.length) * 100);
  };

  const onboardingPct = (acc) => {
    const o = acc.onboarding;
    const need = ["company", "address", "phone", "email", "metaNumber", "altNumber", "website", "websiteType", "designPref"];
    const filled = need.filter((k) => String(o[k] || "").trim()).length;
    const kyc = ["aadhaar", "gst", "utility"].filter((k) => o.kyc[k]).length;
    return Math.round(((filled + kyc) / (need.length + 3)) * 100);
  };

  const metricScore = (answers) => {
    const map = {
      website: { strong: 86, weak: 48, none: 22, builder: 34 },
      social: { daily: 82, weekly: 61, dormant: 38, none: 18 },
      landing: { smart: 88, landing: 74, multi: 58, unsure: 40, strong: 70, weak: 42, none: 20, builder: 28 },
      automation: { instant: 90, morning: 44, missed: 24, none: 16 },
      reviews: { auto: 88, manual: 52, rarely: 28, none: 18 }
    };
    const website = map.website[answers.hasWebsite] ?? 40;
    const social = map.social[answers.social] ?? 40;
    const landing = map.landing[answers.websiteType] ?? map.landing[answers.hasWebsite] ?? 40;
    const automation = map.automation[answers.automation] ?? 40;
    const reviews = map.reviews[answers.reviews] ?? 40;
    const overall = Math.round((website + social + landing + automation + reviews) / 5);
    return { website, social, landing, automation, reviews, overall };
  };

  const competitorScores = (you) => ({
    local: {
      website: Math.min(96, you.website + 18),
      social: Math.min(94, you.social + 16),
      landing: Math.min(95, you.landing + 20),
      automation: Math.min(97, you.automation + 28),
      reviews: Math.min(94, you.reviews + 22)
    },
    global: { website: 92, social: 90, landing: 94, automation: 96, reviews: 91 }
  });

  const pill = (n) => n >= 75 ? "good" : n >= 50 ? "mid" : "bad";

  const armNurture = (acc) => {
    if (acc.nurtureArmed) return;
    acc.nurtureArmed = true;
    acc.inbox = EMAILS.map((e) => ({
      ...e,
      sentAt: Date.now() + e.day * 86400000,
      status: e.day === 0 ? "sent" : "queued"
    }));
    saveAccount(acc);
  };

  const nav = (user) => `
    <header class="topbar">
      <div class="nav">
        <a class="brand" href="/" aria-label="Webwise Digital home">
          <img src="/webwise-logo.png" alt="Webwise Digital logo" />
          <span class="brand-word">WEBWISE <span>DIGITAL</span></span>
        </a>
        <div class="nav-right">
          <a class="hide-sm" href="/">Website</a>
          ${user ? `<span class="live">Portal</span><a href="#/dashboard">${esc(user.name || user.email || user.phone)}</a><button class="btn btn-secondary" type="button" id="logoutBtn">Log out</button>` : `<a class="btn btn-primary" href="#/login">Client Login</a>`}
        </div>
      </div>
    </header>`;

  const progressBar = (user, acc, nowId) => {
    const pct = completion(user, acc);
    const reached = STEPS.findIndex((s) => s.id === nowId);
    return `
      <div class="progress-shell">
        <div class="progress-meta"><span>Onboarding completion</span><b>${pct}%</b></div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="steps">
          ${STEPS.map((s, i) => `<span class="step-chip ${i < reached ? "done" : i === reached ? "now" : ""}">${esc(s.label)}</span>`).join("")}
        </div>
      </div>`;
  };

  const shell = (user, inner) => `${nav(user)}<main class="wrap">${inner}</main><p class="footer-mini">Webwise Digital — Calm inside. Systems outside. · GST 07AFRPC8163L1ZX</p>`;

  const renderReportHTML = (user, acc) => {
    const a = acc.answers;
    const scores = metricScore(a);
    const comp = competitorScores(scores);
    const niche = COMPETITORS[a.businessType] || COMPETITORS.d2c;
    const q = QUESTIONS.find((x) => x.id === "businessType").a.find((x) => x.v === a.businessType);
    const name = acc.onboarding.company || user.name || "Your business";
    return `
      <article class="ww-report" id="healthReport">
        <div class="ww-r-top">
          <div class="ww-r-brand"><img src="/webwise-logo.png" alt="" /><b>WEBWISE</b>&nbsp;<span>DIGITAL</span></div>
          <div class="ww-r-from"><strong>Saurabh Chugh</strong>Founder, Webwise Digital<br>Dwarka, New Delhi<br>+91 87965 04200 · Saurabh@webwisedigital.net</div>
        </div>
        <div class="ww-r-banner">
          <div class="kicker">Digital Health Check · One-Pager</div>
          <h1>Client Acquisition System Health Check for ${esc(name)}</h1>
          <p>Website · Social · Landing page · Automation · Reviews</p>
          <div class="ww-r-meta">Prepared for ${esc(user.name || user.email || "Client")} — ${esc(q ? q.l : "Business")} | ${esc(today())} | Ref: WWD-HC-${esc(String(user.id).slice(0, 6).toUpperCase())}</div>
        </div>
        <p class="ww-r-quote">“You don’t need more marketing. You need a system that never misses a customer.”</p>
        <div class="ww-r-body">
          <div class="ww-r-sec">
            <div class="ww-r-num">1</div>
            <div>
              <h2>Benchmark vs top domestic competitor</h2>
              <p>Scored from your funnel answers against a typical category leader (${esc(niche.local)}). Global reference: ${esc(niche.global)}.</p>
              <table class="ww-r-table">
                <thead><tr><th>Metric</th><th>You</th><th>Top domestic</th><th>Gap</th></tr></thead>
                <tbody>
                  ${["website","social","landing","automation","reviews"].map((k) => {
                    const label = { website: "Website", social: "Social media", landing: "Landing page", automation: "Automation", reviews: "Reviews" }[k];
                    const gap = comp.local[k] - scores[k];
                    return `<tr><td>${label}</td><td class="you"><span class="score-pill ${pill(scores[k])}">${scores[k]}</span></td><td>${comp.local[k]}</td><td>${gap > 0 ? "−" + gap : "on par"}</td></tr>`;
                  }).join("")}
                </tbody>
              </table>
            </div>
          </div>
          <div class="ww-r-sec">
            <div class="ww-r-num">2</div>
            <div>
              <h2>What this means</h2>
              <div class="ww-r-cards">
                <div class="ww-r-card"><b>Overall presence ${scores.overall}/100</b><span>The largest leaks are usually after-hours replies, inconsistent reviews and a site that does not capture intent.</span></div>
                <div class="ww-r-card"><b>Website type: ${esc((QUESTIONS.find((x)=>x.id==="websiteType").a.find(x=>x.v===a.websiteType)||{}).l || "—")}</b><span>Design direction: ${esc((QUESTIONS.find((x)=>x.id==="designPref").a.find(x=>x.v===a.designPref)||{}).l || "—")}. Trust signals: ${esc((QUESTIONS.find((x)=>x.id==="certs").a.find(x=>x.v===a.certs)||{}).l || "—")}.</span></div>
              </div>
            </div>
          </div>
          <div class="ww-r-sec">
            <div class="ww-r-num">3</div>
            <div>
              <h2>Partner system (if you proceed)</h2>
              <div class="ww-r-invest">
                <div>
                  <div class="badge">LAUNCH PARTNER RATE</div>
                  <div class="amt"><s>${rupee(PRICE.bundleList)}</s> ${rupee(PRICE.bundlePartner)} + GST / month</div>
                </div>
                <div style="font-size:13px;color:rgba(255,255,255,.8);text-align:right">90-day engagement<br>Billed monthly · No setup fee<br>Smart Site · WhatsApp · Reviews</div>
              </div>
              <div class="ww-r-bonus" style="margin-top:10px"><b>✦ Included bonuses — at no extra cost</b><br>Google Business Profile optimisation · Instagram, Facebook &amp; YouTube profile optimisation · Messaging &amp; positioning refinement</div>
            </div>
          </div>
        </div>
        <div class="ww-r-foot"><span>Webwise Digital — Calm inside. Systems outside.</span><span>Page 1 / 1</span></div>
      </article>`;
  };

  const viewLogin = (mode = "signup") => {
    return shell(null, `
      <div class="auth-wrap">
        <div class="eyebrow">✦ Client portal</div>
        <h1>${mode === "login" ? "Welcome <span>back.</span>" : "Start your <span>health check.</span>"}</h1>
        <p class="lead">${mode === "login" ? "Sign in with Google, email or phone." : "Create a secure account. We confirm email only after you opt in."}</p>
        <div class="card">
          <div class="tabs">
            <button class="tab ${mode === "signup" ? "on" : ""}" data-go="#/signup" type="button">Sign up</button>
            <button class="tab ${mode === "login" ? "on" : ""}" data-go="#/login" type="button">Log in</button>
          </div>
          <div class="auth-methods">
            <button class="auth-method" type="button" id="googleBtn"><i>G</i> Continue with Google</button>
            <button class="auth-method email" type="button" id="showEmail"><i>@</i> Continue with email</button>
            <button class="auth-method phone" type="button" id="showPhone"><i>●</i> Continue with phone</button>
          </div>
          <form id="emailForm" class="hidden" autocomplete="on">
            ${mode === "signup" ? `<div class="field"><label>Full name <span class="req">*</span></label><input name="name" required placeholder="Your name" /></div>` : ""}
            <div class="field"><label>Work email <span class="req">*</span></label><input name="email" type="email" required placeholder="you@business.com" /></div>
            <div class="field"><label>Password <span class="req">*</span></label><input name="password" type="password" minlength="8" required placeholder="Min 8 characters" /></div>
            ${mode === "signup" ? `<label class="check"><input type="checkbox" name="optin" required /><span>I opt in to receive my health-check report, onboarding emails and confirmation mail from Webwise Digital. I can unsubscribe anytime.</span></label>` : ""}
            <p class="error hidden" id="authErr"></p>
            <button class="btn btn-primary btn-block" type="submit">${mode === "login" ? "Log in with email" : "Create account & send confirmation"}</button>
          </form>
          <form id="phoneForm" class="hidden">
            <div class="field"><label>Full name <span class="req">*</span></label><input name="name" required /></div>
            <div class="field"><label>Mobile (India) <span class="req">*</span></label><input name="phone" required pattern="[6-9][0-9]{9}" placeholder="10-digit number" /></div>
            <p class="hint">We send a 6-digit OTP to verify the number. Demo OTP is shown on the next screen until an SMS gateway is connected.</p>
            <p class="error hidden" id="phoneErr"></p>
            <button class="btn btn-primary btn-block" type="submit">Send OTP</button>
          </form>
          <p class="hint" style="margin-top:14px">By continuing you agree to the <a href="/terms-of-service/">Terms</a> and <a href="/privacy-policy/">Privacy Policy</a>.</p>
        </div>
      </div>`);
  };

  const viewVerify = (user) => shell(user, `
    <div class="auth-wrap">
      <div class="eyebrow">Secure confirmation</div>
      <h1>Confirm your <span>${user.method === "phone" ? "phone" : "email"}.</span></h1>
      <p class="lead">${user.method === "phone" ? "Enter the OTP sent to +91 " + esc(user.phone) : "Enter the 6-digit code we emailed to " + esc(user.email)}. This keeps the portal and report private.</p>
      <div class="card">
        <p class="note">Demo verification code: <b>${esc(user.pendingCode)}</b><br>Production wires this to transactional email / SMS. Opt-in is required before any confirmation mail is sent.</p>
        <form id="verifyForm">
          <div class="field"><label>Confirmation code</label><input name="code" inputmode="numeric" maxlength="6" required placeholder="000000" /></div>
          <p class="error hidden" id="verErr"></p>
          <button class="btn btn-primary btn-block" type="submit">Verify & continue</button>
        </form>
      </div>
    </div>`);

  const viewGoogle = () => shell(null, `
    <div class="auth-wrap">
      <div class="eyebrow">Google sign-in</div>
      <h1>Use your <span>Google</span> account</h1>
      <p class="lead">You stay on Webwise. We never clone a Google login page. Production OAuth uses your Google Client ID; this step captures the account you want linked.</p>
      <div class="card">
        <form id="googleForm">
          <div class="field"><label>Name</label><input name="name" required placeholder="Name on Google account" /></div>
          <div class="field"><label>Google email</label><input name="email" type="email" required placeholder="name@gmail.com" /></div>
          <label class="check"><input type="checkbox" name="optin" required /><span>I opt in to health-check and onboarding emails from Webwise Digital.</span></label>
          <button class="btn btn-primary btn-block" type="submit">Link Google & enter portal</button>
        </form>
      </div>
    </div>`);

  const viewFunnel = (user, acc) => {
    const i = acc.funnelIndex;
    const q = QUESTIONS[i];
    if (!q) { go("/report"); return ""; }
    return shell(user, `
      ${progressBar(user, acc, "funnel")}
      <div class="eyebrow">Lead capture · ${i + 1} / ${QUESTIONS.length}</div>
      <h1 class="quiz-q">${esc(q.q)}</h1>
      <p class="quiz-h">${esc(q.h)}</p>
      <div class="card">
        <div class="options">
          ${q.a.map((opt) => `<button class="option" type="button" data-qid="${q.id}" data-val="${esc(opt.v)}"><span><b>${esc(opt.l)}</b><span>${esc(opt.d)}</span></span><span class="option-arrow">→</span></button>`).join("")}
        </div>
      </div>`);
  };

  const viewReport = (user, acc) => {
    const scores = metricScore(acc.answers);
    return shell(user, `
      ${progressBar(user, acc, "report")}
      <div class="eyebrow">Health check report</div>
      <h1>Your digital presence, <span>one page.</span></h1>
      <p class="lead">Benchmark vs a top domestic competitor. Also emailed to your inbox and stored in the dashboard.</p>
      <div class="metric-grid">
        ${[["Website", scores.website],["Social", scores.social],["Landing", scores.landing],["Automation", scores.automation],["Reviews", scores.reviews]].map(([k,v]) => `<div class="metric"><div class="k">${k}</div><div class="v ${pill(v)==="good"?"good":pill(v)==="mid"?"warn":"bad"}">${v}</div><small>/ 100</small></div>`).join("")}
      </div>
      <div class="report-actions">
        <button class="btn btn-primary" type="button" id="printReport">Download / print PDF</button>
        <button class="btn btn-secondary" type="button" id="emailReport">Email me this report</button>
        <a class="btn btn-secondary" href="#/inbox">Open inbox</a>
      </div>
      ${renderReportHTML(user, acc)}
      <div class="upsell">
        <div class="tat">24-hour TAT after payment</div>
        <h3>See more competitors — order now ${rupee(PRICE.competitorPack)}</h3>
        <p>Unlock 2 domestic competitors + 1 global competitor, scored on the same five metrics. Delivered inside 24 hours.</p>
        <div class="price">${rupee(PRICE.competitorPack)} <small>incl. briefing, not GST on this micro-product if billed as report fee</small></div>
        <div class="actions">
          <button class="btn btn-primary" type="button" id="orderComp">Order competitor pack →</button>
          <a class="btn btn-secondary" href="#/compare">Skip to DIY vs Webwise</a>
        </div>
      </div>`);
  };

  const viewCompetitors = (user, acc) => {
    const scores = metricScore(acc.answers);
    const c = competitorScores(scores);
    const niche = COMPETITORS[acc.answers.businessType] || COMPETITORS.d2c;
    const paid = !!acc.competitorOrder;
    return shell(user, `
      ${progressBar(user, acc, "offer")}
      <div class="eyebrow">Competitor pack</div>
      <h1>${paid ? "Pack unlocked." : "Order the <span>competitor pack.</span>"}</h1>
      <p class="lead">${paid ? "24-hour TAT clock started. Preview scores below; full write-up lands in your inbox." : "₹1,999 · 2 domestic + 1 global · same five metrics as your health check."}</p>
      <div class="card">
        ${paid ? `<p class="note">Order ${esc(acc.competitorOrder.id)} · ${esc(acc.competitorOrder.at)} · Status: <b>In production — 24h TAT</b></p>` : ""}
        <table class="ww-r-table dark">
          <thead><tr><th>Metric</th><th>You</th><th>Domestic A</th><th>Domestic B</th><th>Global</th></tr></thead>
          <tbody>
            ${["website","social","landing","automation","reviews"].map((k) => `<tr>
              <td>${k}</td>
              <td>${scores[k]}</td>
              <td>${paid ? c.local[k] : "••••"}</td>
              <td>${paid ? Math.min(99, c.local[k] - 4) : "••••"}</td>
              <td>${paid ? c.global[k] : "••••"}</td>
            </tr>`).join("")}
          </tbody>
        </table>
        <p class="hint">Domestic A: ${esc(niche.local)}. Domestic B: runner-up in your city cluster. Global: ${esc(niche.global)}.</p>
        ${paid ? `<div class="actions"><a class="btn btn-primary" href="#/compare">Next: DIY vs Webwise →</a></div>` : `<div class="actions"><button class="btn btn-primary" id="payComp" type="button">Pay ${rupee(PRICE.competitorPack)} & unlock</button><a class="btn btn-secondary" href="#/compare">Continue without pack</a></div>`}
      </div>`);
  };

  const viewCompare = (user, acc) => {
    const diy = Object.values(PRICE.diy).reduce((s, n) => s + n, 0);
    const year = PRICE.bundlePartner * 12;
    const yearGst = Math.round(year * (1 + GST));
    const save = diy - yearGst;
    return shell(user, `
      ${progressBar(user, acc, "offer")}
      <div class="eyebrow">Investment logic</div>
      <h1>DIY stack vs <span>Webwise bundled.</span></h1>
      <p class="lead">Typical first-year cost to piece this together yourself versus the Client Acquisition System partner rate.</p>
      <div class="compare">
        <div class="col">
          <div class="eyebrow">Do it yourself</div>
          <h2>${rupee(diy)}</h2>
          <p class="hint">Year-1 vendor + staff time (typical)</p>
          <ul>
            <li>Website ${rupee(PRICE.diy.website)}</li>
            <li>Landing ${rupee(PRICE.diy.landing)}</li>
            <li>WhatsApp / chat ${rupee(PRICE.diy.whatsapp)}</li>
            <li>Reviews tooling ${rupee(PRICE.diy.reviews)}</li>
            <li>Staff hours ${rupee(PRICE.diy.staff)}</li>
          </ul>
        </div>
        <div class="col win">
          <div class="eyebrow">Webwise Digital</div>
          <p class="strike">${rupee(PRICE.bundleList)} / mo list</p>
          <h2>${rupee(PRICE.bundlePartner)} + GST / mo</h2>
          <p class="hint">12 months ≈ ${rupee(yearGst)} incl. GST</p>
          <div class="save">${rupee(Math.max(0, save))} saved</div>
          <p style="color:var(--teal);font-weight:800">Green = money you keep by bundling.</p>
          <ul>
            <li>AI Smart Site</li>
            <li>WhatsApp automation</li>
            <li>Reviews & GBP bonus</li>
            <li>No setup fee · 90-day engagement</li>
          </ul>
        </div>
      </div>
      <div class="actions">
        <button class="btn btn-teal" type="button" id="approveBtn">Approve partner system →</button>
        <a class="btn btn-secondary" href="#/nurture">Not now — keep sending me emails</a>
      </div>`);
  };

  const viewNurture = (user, acc) => shell(user, `
    ${progressBar(user, acc, "offer")}
    <div class="eyebrow">Email sequence</div>
    <h1>We will stay with you <span>until you convert.</span></h1>
    <p class="lead">Non-action leads receive this nurture until approval. Case studies, testimonials, urgency.</p>
    <div class="timeline">
      ${acc.inbox.map((m) => `
        <div class="t-item">
          <div class="dot ${m.status === "sent" ? "green" : ""}"></div>
          <div class="mail">
            <div class="from">Day ${m.day} · ${m.status === "sent" ? "Sent" : "Queued"} · Saurabh@webwisedigital.net</div>
            <h4>${esc(m.subject)}</h4>
            <p>${esc(m.body)}</p>
          </div>
        </div>`).join("")}
    </div>
    <div class="actions">
      <a class="btn btn-primary" href="#/compare">Convert now — see savings</a>
      <a class="btn btn-secondary" href="#/inbox">Open portal inbox</a>
    </div>`);

  const viewOnboarding = (user, acc) => {
    const o = acc.onboarding;
    const pct = onboardingPct(acc);
    return shell(user, `
      ${progressBar(user, acc, "onboarding")}
      <div class="eyebrow">Post-approval handover</div>
      <h1>Tell us what we need <span>to go live.</span></h1>
      <p class="lead">Required company, KYC and build preferences. Handover pack ${pct}% complete.</p>
      <div class="card">
        <form id="onboardForm">
          <div class="field"><label>Company name <span class="req">*</span></label><input name="company" required value="${esc(o.company)}" /></div>
          <div class="field"><label>Registered address <span class="req">*</span></label><textarea name="address" required>${esc(o.address)}</textarea></div>
          <div class="field"><label>Phone <span class="req">*</span></label><input name="phone" required value="${esc(o.phone || user.phone || "")}" /></div>
          <div class="field"><label>Email <span class="req">*</span></label><input name="email" type="email" required value="${esc(o.email)}" /></div>
          <div class="field"><label>Fresh Meta / WhatsApp number <span class="req">*</span></label><input name="metaNumber" required value="${esc(o.metaNumber)}" placeholder="Number for Business API" /></div>
          <div class="field"><label>Alternate number <span class="req">*</span></label><input name="altNumber" required value="${esc(o.altNumber)}" /></div>
          <div class="field"><label>Website URL <span class="req">*</span></label><input name="website" required value="${esc(o.website)}" placeholder="https:// — mandatory for Meta automation" /></div>
          <div class="field"><label>Website type</label>
            <select name="websiteType">${["AI Smart Site","Landing page","Multi-page","Recommend for me"].map((x)=>`<option ${o.websiteType===x?"selected":""}>${x}</option>`).join("")}</select>
          </div>
          <div class="field"><label>Colour / design preference</label>
            <select name="designPref">${["Clean clinical","Premium dark + cyan","Warm lifestyle","Minimal typography"].map((x)=>`<option ${o.designPref===x?"selected":""}>${x}</option>`).join("")}</select>
          </div>
          <div class="field"><label>Logo file</label><input name="logo" type="file" accept="image/*,.pdf" /></div>
          <div class="field"><label>Past / reference sites</label><textarea name="refs">${esc(o.refs)}</textarea></div>
          <div class="field"><label>Certifications to display</label><input name="certs" value="${esc(o.certs)}" placeholder="NABH, RERA, FSSAI, Harvard, CGHS…" /></div>
          <p class="hint">KYC — Aadhaar, GST/COI, utility bill. Files stay in this browser session (demo). Production uploads to encrypted storage.</p>
          <div class="kyc">
            <label class="file-row">Aadhaar <input name="aadhaar" type="file" accept=".pdf,image/*" /> <span class="ok">${o.kyc.aadhaar ? esc(o.kyc.aadhaar) : "Required"}</span></label>
            <label class="file-row">GST certificate / COI <input name="gst" type="file" accept=".pdf,image/*" /> <span class="ok">${o.kyc.gst ? esc(o.kyc.gst) : "Required"}</span></label>
            <label class="file-row">Utility bill <input name="utility" type="file" accept=".pdf,image/*" /> <span class="ok">${o.kyc.utility ? esc(o.kyc.utility) : "Required"}</span></label>
          </div>
          <div class="actions"><button class="btn btn-primary" type="submit">Save handover pack →</button></div>
        </form>
      </div>`);
  };

  const viewAutomation = (user, acc) => {
    const web = (acc.onboarding.website || "").trim();
    const ready = /^https?:\/\//i.test(web);
    return shell(user, `
      ${progressBar(user, acc, "automation")}
      <div class="eyebrow">Automation module</div>
      <h1>Submit for <span>Meta approval.</span></h1>
      <p class="lead">Website is mandatory for Meta / WhatsApp automation. We cannot file without a live URL.</p>
      ${ready ? `<div class="note">Website on file: <b>${esc(web)}</b></div>` : `<div class="note">Add a website URL in onboarding before we can submit to Meta.</div>`}
      <div class="card">
        <p><b>Details that will be submitted</b></p>
        <ul>
          <li>Company: ${esc(acc.onboarding.company || "—")}</li>
          <li>Meta number: ${esc(acc.onboarding.metaNumber || "—")}</li>
          <li>Alt number: ${esc(acc.onboarding.altNumber || "—")}</li>
          <li>Website: ${esc(web || "missing")}</li>
        </ul>
        <p>Status: <b>${esc(acc.automation.metaStatus)}</b></p>
        <div class="actions">
          <button class="btn btn-primary" id="submitMeta" type="button" ${ready ? "" : "disabled"}>Confirm & submit to Meta →</button>
          <a class="btn btn-secondary" href="#/onboarding">Fix website</a>
        </div>
      </div>`);
  };

  const viewReviews = (user, acc) => shell(user, `
    ${progressBar(user, acc, "reviews")}
    <div class="eyebrow">Review & reputation</div>
    <h1>How should reviews <span>compound?</span></h1>
    <p class="lead">GBP optimisation is included as a bonus with the partner system.</p>
    <div class="card">
      <form id="revForm">
        <div class="field"><label>Current review process</label>
          <select name="process">
            ${[["auto","Automated after every visit"],["staff","Staff ask in person"],["qr","QR / SMS sometimes"],["none","No process yet"]].map(([v,l]) => `<option value="${v}" ${acc.reviewsMod.process===v?"selected":""}>${l}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Number of locations</label>
          <select name="locations">
            ${["1","2","3-5","6+"].map((v)=>`<option ${acc.reviewsMod.locations===v?"selected":""}>${v}</option>`).join("")}
          </select>
        </div>
        <div class="ww-r-bonus" style="background:rgba(0,212,170,.08);border-color:var(--teal);color:var(--white)"><b>Bonus included:</b> Google Business Profile optimisation for every location you list.</div>
        <div class="actions"><button class="btn btn-primary" type="submit">Save & continue →</button></div>
      </form>
    </div>`);

  const viewUpsell = (user, acc, kind) => {
    const title = kind === "social" ? "Social Media Automation" : "Email Automation";
    const next = kind === "social" ? "/upsell-email" : "/thanks";
    const field = kind === "social" ? "social" : "emailAuto";
    return shell(user, `
      ${progressBar(user, acc, "growth")}
      <div class="eyebrow">Final upsell</div>
      <h1>${title}. <span>Yes or not yet?</span></h1>
      <p class="lead">${kind === "social" ? "Weekly content engine: blog, YouTube, Instagram + FB shorts. Priced separately after core systems prove out." : "Lifecycle sequences: recall, no-show rescue, offer drops. Runs on the same lead record."}</p>
      <div class="card">
        <div class="actions">
          <button class="btn btn-primary" type="button" data-upsell="${field}" data-val="yes" data-next="${next}">Yes — take me to the landing page</button>
          <button class="btn btn-secondary" type="button" data-upsell="${field}" data-val="no" data-next="${next}">No — keep me on the nurture sequence</button>
        </div>
      </div>`);
  };

  const viewSocialLanding = (user) => shell(user, `
    <div class="eyebrow">Social Media Growth Engine</div>
    <h1>Content that feeds <span>the system.</span></h1>
    <p class="lead">Priced separately — start anytime after the core systems prove out.</p>
    <div class="card">
      <p>Weekly: 1 blog + YouTube video + Instagram short + FB short. À la carte video per project.</p>
      <div class="actions"><a class="btn btn-primary" href="#/upsell-email">Continue to email automation →</a></div>
    </div>`);

  const viewEmailLanding = (user) => shell(user, `
    <div class="eyebrow">Email automation</div>
    <h1>Follow-up that <span>does not sleep.</span></h1>
    <p class="lead">Sequences for new leads, no-shows and 3 / 6 month recall — same record as WhatsApp.</p>
    <div class="card">
      <div class="actions"><a class="btn btn-primary" href="#/thanks">Finish setup →</a></div>
    </div>`);

  const viewThanks = (user, acc) => shell(user, `
    ${progressBar(user, acc, "complete")}
    <div class="thanks card">
      <div class="seal">PREMIUM PARTNER</div>
      <h1>Calm inside. <span>Systems outside.</span></h1>
      <p class="lead">Thank you. Your handover is in motion. Meta review is ${esc(acc.automation.metaStatus)}. We start the moment this pack and first payment are confirmed — the same sequence we run for partner clinics.</p>
      <p>1. Confirmed · 2. Payment · 3. Handover pack · We go live</p>
      <p>Saurabh Chugh · Founder, Webwise Digital · Dwarka, New Delhi</p>
      <div class="actions" style="justify-content:center"><a class="btn btn-primary" href="#/dashboard">Open dashboard</a></div>
    </div>`);

  const viewInbox = (user, acc) => shell(user, `
    ${progressBar(user, acc, acc.approved ? "onboarding" : "report")}
    <div class="eyebrow">Portal inbox</div>
    <h1>Reports & <span>nurture.</span></h1>
    <div class="timeline">${(acc.inbox.length ? acc.inbox : [{day:0,status:"queued",subject:"No mail yet",body:"Complete the health check to generate your report email."}]).map((m)=>`<div class="mail" style="margin-bottom:10px"><div class="from">Day ${m.day} · ${m.status}</div><h4>${esc(m.subject)}</h4><p>${esc(m.body)}</p></div>`).join("")}</div>`);

  const viewDash = (user, acc) => {
    const pct = completion(user, acc);
    return shell(user, `
      <div class="dash">
        <aside class="side">
          <p class="live">Client OS</p>
          <a href="#/dashboard" class="on">Overview</a>
          <a href="#/funnel">Health quiz</a>
          <a href="#/report">Health check</a>
          <a href="#/competitors">Competitor pack</a>
          <a href="#/compare">DIY vs Webwise</a>
          <a href="#/onboarding">Onboarding</a>
          <a href="#/automation">Meta automation</a>
          <a href="#/reviews">Reviews</a>
          <a href="#/upsell-social">Social add-on</a>
          <a href="#/upsell-email">Email add-on</a>
          <a href="#/inbox">Inbox</a>
          <a href="#/nurture">Nurture sequence</a>
          <a href="#/architecture">System map</a>
        </aside>
        <div>
          ${progressBar(user, acc, acc.stage || "funnel")}
          <h1>${pct}% complete. <span>Keep going.</span></h1>
          <p class="lead">Every unfinished step is a leak. Finish setup so Meta, reviews and follow-up can run.</p>
          <div class="metric-grid">
            <div class="metric"><div class="k">Report</div><div class="v ${acc.reportSent?"good":"warn"}">${acc.reportSent?"Sent":"Open"}</div></div>
            <div class="metric"><div class="k">Pack ₹1,999</div><div class="v">${acc.competitorOrder?"On":"—"}</div></div>
            <div class="metric"><div class="k">Approved</div><div class="v ${acc.approved?"good":"warn"}">${acc.approved?"Yes":"No"}</div></div>
            <div class="metric"><div class="k">Handover</div><div class="v">${onboardingPct(acc)}%</div></div>
            <div class="metric"><div class="k">Meta</div><div class="v">${esc(acc.automation.metaStatus)}</div></div>
          </div>
          <div class="actions">
            <a class="btn btn-primary" href="#/${acc.approved ? "onboarding" : acc.reportSent ? "compare" : "funnel"}">Continue where I left off →</a>
          </div>
        </div>
      </div>`);
  };

  const viewArch = (user) => shell(user, `
    <div class="eyebrow">Architecture</div>
    <h1>Modules + <span>flows.</span></h1>
    <div class="card">
      <ol>
        <li><b>Auth</b> — Google / email / phone → hashed credentials → opt-in → confirmation code.</li>
        <li><b>Funnel MCQs</b> — 8 questions (type, website, design, certs, social, automation, reviews) feed scores.</li>
        <li><b>Health check</b> — one-pager vs top domestic competitor; email + download.</li>
        <li><b>Upsell</b> — competitor pack ₹1,999 (2 domestic + 1 global, 24h TAT) → DIY vs bundle (green savings) → approve.</li>
        <li><b>Nurture</b> — Day 0/1/3/5/7 emails if they do not approve.</li>
        <li><b>Onboarding</b> — company, KYC, Meta number, website (mandatory).</li>
        <li><b>Progress bar</b> — % across 9 stages.</li>
        <li><b>Automation</b> — submit details → Meta approval.</li>
        <li><b>Reviews</b> — process + locations + GBP bonus.</li>
        <li><b>Final upsells</b> — Social yes→landing / no→nurture; Email yes→landing / no→nurture; thank-you.</li>
      </ol>
    </div>`);

  const requireUser = () => {
    const user = currentUser();
    if (!user) { go("/login"); return null; }
    if (!user.verified && route() !== "/verify") { go("/verify"); return null; }
    return user;
  };

  const upsertUser = (partial) => {
    const users = loadUsers();
    const i = users.findIndex((u) => u.id === partial.id);
    if (i >= 0) users[i] = { ...users[i], ...partial };
    else users.push(partial);
    saveUsers(users);
    return users.find((u) => u.id === partial.id);
  };

  const loginSession = (user) => {
    setSession({ userId: user.id, token: randomHex(24), expires: Date.now() + 1000 * 60 * 60 * 24 * 14 });
  };

  const startEmailSignup = async (form, isLogin) => {
    const fd = new FormData(form);
    const email = String(fd.get("email") || "").trim().toLowerCase();
    const name = String(fd.get("name") || "").trim();
    const password = String(fd.get("password") || "");
    const users = loadUsers();
    const existing = users.find((u) => u.email === email && u.method === "email");
    const err = form.querySelector("#authErr");
    const show = (m) => { err.textContent = m; err.classList.remove("hidden"); };

    if (isLogin) {
      if (!existing) return show("No email account found. Sign up first.");
      const hash = await hashPass(password, existing.salt);
      if (hash !== existing.passHash) return show("Wrong password.");
      loginSession(existing);
      go(existing.verified ? "/dashboard" : "/verify");
      return;
    }
    if (existing) return show("That email already exists. Log in.");
    if (!form.optin || !form.optin.checked) return show("Opt-in is required before we send a confirmation email.");
    const salt = randomHex(8);
    const user = {
      id: randomHex(8),
      method: "email",
      name, email, phone: "",
      salt,
      passHash: await hashPass(password, salt),
      verified: false,
      optIn: true,
      pendingCode: otp6(),
      createdAt: Date.now()
    };
    upsertUser(user);
    loginSession(user);
    go("/verify");
  };

  const bindAuth = (mode) => {
    document.querySelectorAll("[data-go]").forEach((b) => b.addEventListener("click", () => go(b.getAttribute("data-go").slice(1))));
    document.getElementById("googleBtn")?.addEventListener("click", () => go("/google"));
    document.getElementById("showEmail")?.addEventListener("click", () => document.getElementById("emailForm").classList.remove("hidden"));
    document.getElementById("showPhone")?.addEventListener("click", () => document.getElementById("phoneForm").classList.remove("hidden"));
    document.getElementById("emailForm")?.addEventListener("submit", (e) => { e.preventDefault(); startEmailSignup(e.target, mode === "login"); });
    document.getElementById("phoneForm")?.addEventListener("submit", (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const phone = String(fd.get("phone") || "");
      const name = String(fd.get("name") || "");
      if (!/^[6-9]\d{9}$/.test(phone)) {
        const err = document.getElementById("phoneErr");
        err.textContent = "Enter a valid 10-digit Indian mobile.";
        err.classList.remove("hidden");
        return;
      }
      const existing = loadUsers().find((u) => u.phone === phone && u.method === "phone");
      const user = existing || {
        id: randomHex(8), method: "phone", name, email: "", phone,
        verified: false, optIn: true, pendingCode: otp6(), createdAt: Date.now()
      };
      if (existing) {
        user.name = name || existing.name;
        user.pendingCode = otp6();
        user.verified = false;
      }
      upsertUser(user);
      loginSession(user);
      go("/verify");
    });
  };

  const render = () => {
    const app = document.getElementById("app");
    const path = route();
    let user = currentUser();

    if (path === "/" || path === "/login") {
      app.replaceChildren($("div"));
      app.innerHTML = viewLogin("login");
      bindAuth("login");
    } else if (path === "/signup") {
      app.innerHTML = viewLogin("signup");
      bindAuth("signup");
    } else if (path === "/google") {
      app.innerHTML = viewGoogle();
      document.getElementById("googleForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const email = String(fd.get("email")).trim().toLowerCase();
        let user = loadUsers().find((u) => u.email === email && u.method === "google");
        if (!user) {
          user = {
            id: randomHex(8), method: "google", name: String(fd.get("name")), email, phone: "",
            verified: true, optIn: true, pendingCode: "", createdAt: Date.now()
          };
          upsertUser(user);
        }
        loginSession(user);
        go("/funnel");
      });
    } else if (path === "/verify") {
      user = currentUser();
      if (!user) return go("/login");
      if (user.verified) return go("/funnel");
      app.innerHTML = viewVerify(user);
      document.getElementById("verifyForm").addEventListener("submit", (e) => {
        e.preventDefault();
        const code = String(new FormData(e.target).get("code") || "");
        if (code !== user.pendingCode) {
          const err = document.getElementById("verErr");
          err.textContent = "That code does not match.";
          err.classList.remove("hidden");
          return;
        }
        user.verified = true;
        user.pendingCode = "";
        upsertUser(user);
        go("/funnel");
      });
    } else {
      user = requireUser();
      if (!user) return;
      const acc = ensureAccount(user);
      const map = {
        "/dashboard": () => viewDash(user, acc),
        "/funnel": () => {
          if (acc.funnelIndex >= QUESTIONS.length) { go("/report"); return "<p class='lead'>Opening report…</p>"; }
          return viewFunnel(user, acc);
        },
        "/report": () => {
          acc.stage = "report";
          saveAccount(acc);
          return viewReport(user, acc);
        },
        "/competitors": () => viewCompetitors(user, acc),
        "/compare": () => { acc.comparisonSeen = true; saveAccount(acc); return viewCompare(user, acc); },
        "/nurture": () => { armNurture(acc); acc.inbox[0].status = "sent"; saveAccount(acc); return viewNurture(user, acc); },
        "/onboarding": () => {
          if (!acc.approved) { go("/compare"); return "<p class='lead'>Approve the partner system first.</p>"; }
          return viewOnboarding(user, acc);
        },
        "/automation": () => viewAutomation(user, acc),
        "/reviews": () => viewReviews(user, acc),
        "/upsell-social": () => viewUpsell(user, acc, "social"),
        "/upsell-email": () => viewUpsell(user, acc, "email"),
        "/social-landing": () => viewSocialLanding(user),
        "/email-landing": () => viewEmailLanding(user),
        "/thanks": () => viewThanks(user, acc),
        "/inbox": () => viewInbox(user, acc),
        "/architecture": () => viewArch(user)
      };
      const view = map[path] || map["/dashboard"];
      app.innerHTML = view();
      if (path === "/funnel" && acc.funnelIndex >= QUESTIONS.length) return;

      document.getElementById("logoutBtn")?.addEventListener("click", () => { clearSession(); go("/login"); });

      document.querySelectorAll(".option").forEach((btn) => btn.addEventListener("click", () => {
        acc.answers[btn.dataset.qid] = btn.dataset.val;
        acc.funnelIndex += 1;
        if (acc.funnelIndex >= QUESTIONS.length) {
          acc.stage = "report";
          saveAccount(acc);
          go("/report");
        } else {
          saveAccount(acc);
          render();
        }
      }));

      document.getElementById("printReport")?.addEventListener("click", () => window.print());
      document.getElementById("emailReport")?.addEventListener("click", () => {
        acc.reportSent = true;
        armNurture(acc);
        acc.inbox[0].status = "sent";
        saveAccount(acc);
        go("/inbox");
      });
      document.getElementById("orderComp")?.addEventListener("click", () => go("/competitors"));
      document.getElementById("payComp")?.addEventListener("click", () => {
        acc.competitorOrder = { id: "WWD-CP-" + randomHex(3).toUpperCase(), at: today(), amount: PRICE.competitorPack };
        saveAccount(acc);
        render();
      });
      document.getElementById("approveBtn")?.addEventListener("click", () => {
        acc.approved = true;
        acc.comparisonSeen = true;
        acc.stage = "onboarding";
        saveAccount(acc);
        go("/onboarding");
      });
      document.getElementById("onboardForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        ["company","address","phone","email","metaNumber","altNumber","website","websiteType","designPref","refs","certs"].forEach((k) => {
          acc.onboarding[k] = String(fd.get(k) || "");
        });
        const logo = e.target.logo?.files?.[0];
        if (logo) acc.onboarding.logoName = logo.name;
        ["aadhaar","gst","utility"].forEach((k) => {
          const f = e.target[k]?.files?.[0];
          if (f) acc.onboarding.kyc[k] = f.name;
        });
        if (!acc.onboarding.kyc.aadhaar || !acc.onboarding.kyc.gst || !acc.onboarding.kyc.utility) {
          alert("Upload Aadhaar, GST/COI and utility bill to complete KYC.");
          return;
        }
        saveAccount(acc);
        go("/automation");
      });
      document.getElementById("submitMeta")?.addEventListener("click", () => {
        if (!/^https?:\/\//i.test(acc.onboarding.website || "")) return;
        acc.automation.submitted = true;
        acc.automation.websiteOk = true;
        acc.automation.metaStatus = "submitted — awaiting Meta";
        acc.stage = "reviews";
        saveAccount(acc);
        go("/reviews");
      });
      document.getElementById("revForm")?.addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        acc.reviewsMod.process = String(fd.get("process"));
        acc.reviewsMod.locations = String(fd.get("locations"));
        saveAccount(acc);
        go("/upsell-social");
      });
      document.querySelectorAll("[data-upsell]").forEach((btn) => btn.addEventListener("click", () => {
        const field = btn.dataset.upsell;
        const val = btn.dataset.val;
        acc.upsells[field] = val;
        saveAccount(acc);
        if (val === "yes") go(field === "social" ? "/social-landing" : "/email-landing");
        else go(field === "social" ? "/upsell-email" : "/thanks");
      }));
    }
  };

  window.addEventListener("hashchange", render);
  if (!location.hash) location.hash = "/signup";
  else render();
})();
