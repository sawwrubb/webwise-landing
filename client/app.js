(() => {
  const STORE_USERS = "ww_users_v1";
  const STORE_SESSION = "ww_session_v1";
  const storeKey = (id) => `ww_account_${id}`;
  const DAY = 86400000;
  const PRICE = { list: 20000, partner: 10000, gst: 0.18 };
  const PARTNER_GST = Math.round(PRICE.partner * (1 + PRICE.gst));
  const SECTIONS = [
    { id: "health", label: "Health Check", path: "/health" },
    { id: "proposal", label: "Proposal", path: "/proposal" },
    { id: "payment", label: "Payment", path: "/payment" },
    { id: "onboarding", label: "Onboarding", path: "/onboarding" },
    { id: "approvals", label: "Approvals", path: "/approvals" },
    { id: "automation", label: "Automation", path: "/automation" },
    { id: "reviews", label: "Review", path: "/reviews" }
  ];
  const CATEGORIES = ["Clinic or doctor", "Salon or spa", "Real estate", "Restaurant", "Wedding & events", "Local brand / D2C", "Other"];
  const WA_TEMPLATES = [
    { id: "afterhours", name: "After-hours reply", d: "Greet the person, ask what they need, offer the next open slot." },
    { id: "booking", name: "Appointment booking", d: "Collect date, time and location, then confirm." },
    { id: "faq", name: "Common questions", d: "Price, timing, parking, insurance — answered instantly." },
    { id: "review", name: "Review request", d: "After a visit, send the Google review link." }
  ];
  const SCORE_LABELS = {
    design: "Design",
    reviews: "Reviews",
    automation: "Automation",
    rankings: "Organic rankings",
    website: "Website analysis",
    seo: "SEO / AEO",
    social: "Social media",
    overall: "Overall feedback"
  };

  const esc = (v) => String(v ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const today = () => new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
  const rupee = (n) => `₹${Number(n).toLocaleString("en-IN")}`;
  const route = () => (location.hash.replace(/^#/, "") || "/").split("?")[0];
  const go = (path) => { location.hash = path; };
  const cloudOn = () => Boolean(window.WebwisePortal && WebwisePortal.enabled);

  const loadUsers = () => JSON.parse(localStorage.getItem(STORE_USERS) || "[]");
  const saveUsers = (u) => localStorage.setItem(STORE_USERS, JSON.stringify(u));
  const session = () => JSON.parse(localStorage.getItem(STORE_SESSION) || "null");
  const setSession = (s) => localStorage.setItem(STORE_SESSION, JSON.stringify(s));
  const clearSession = () => localStorage.removeItem(STORE_SESSION);
  const account = (id) => JSON.parse(localStorage.getItem(storeKey(id)) || "null");
  const saveAccount = async (acc) => {
    if (cloudOn()) return WebwisePortal.saveAccount(acc);
    localStorage.setItem(storeKey(acc.userId), JSON.stringify(acc));
  };
  const bufToHex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
  const randomHex = (n = 16) => bufToHex(crypto.getRandomValues(new Uint8Array(n)));
  const hashPass = async (pass, salt) => bufToHex(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${salt}:${pass}`)));
  const otp6 = () => String(Math.floor(100000 + Math.random() * 900000));

  const emptyAccount = (user) => ({
    userId: user.id,
    createdAt: Date.now(),
    stage: "health",
    health: {
      businessName: "", website: "", maps: "", category: "", ownerName: user.name || "",
      seoInterest: false, includeSocial: false, scored: false, scores: null, at: ""
    },
    proposal: { viewed: false, at: "" },
    payment: { status: "awaiting", method: "", paidAt: "", reminderAt: "", orderId: "" },
    docs: { gst: null, aadhaar: null, website: "", privacy: null, metaAccess: "", at: "" },
    tat: { startedAt: 0 },
    design: { inspiration: "", guidelines: "", palette: "", logo: "", refs: "", submitted: false },
    whatsapp: { templates: [], extraLogic: "", submitted: false },
    reviews: { process: "", locations: "", gbp: "", submitted: false },
    upsells: { seo: false, social: false, email: false, ivr: false }
  });

  const migrate = (user, acc) => {
    const base = emptyAccount(user);
    if (!acc) return base;
    const payment = { ...base.payment, ...(acc.payment || {}) };
    if (acc.approved && payment.status !== "paid") payment.status = "paid";
    return {
      ...base,
      ...acc,
      health: { ...base.health, ...(acc.health || {}) },
      proposal: { ...base.proposal, ...(acc.proposal || {}) },
      payment,
      docs: { ...base.docs, ...(acc.docs || {}) },
      tat: { ...base.tat, ...(acc.tat || {}) },
      design: { ...base.design, ...(acc.design || {}) },
      whatsapp: { ...base.whatsapp, ...(acc.whatsapp || {}) },
      reviews: { ...base.reviews, ...(acc.reviews || {}) },
      upsells: { ...base.upsells, ...(acc.upsells || {}) }
    };
  };

  const currentUser = () => {
    if (cloudOn()) return WebwisePortal.currentUser();
    const s = session();
    if (!s || s.expires < Date.now()) { clearSession(); return null; }
    return loadUsers().find((u) => u.id === s.userId) || null;
  };

  const ensureAccount = async (user) => {
    let acc = cloudOn() ? await WebwisePortal.loadAccount(user) : account(user.id);
    const next = migrate(user, acc);
    if (!acc || !acc.health) await saveAccount(next);
    return next;
  };

  const clamp5 = (n) => Math.max(1, Math.min(5, n));
  const scoreHealth = (h) => {
    const hasWeb = /^https?:\/\//i.test(h.website || "");
    const hasMaps = (h.maps || "").length > 10;
    const scores = {
      design: hasWeb ? 3 : 1,
      website: hasWeb ? 3 : 1,
      reviews: hasMaps ? 3 : 2,
      automation: 2,
      rankings: hasWeb && hasMaps ? 3 : hasWeb ? 2 : 1
    };
    if (h.seoInterest) scores.seo = hasWeb ? 2 : 1;
    if (h.includeSocial) scores.social = 2;
    const vals = Object.values(scores);
    scores.overall = clamp5(Math.round(vals.reduce((a, b) => a + b, 0) / vals.length));
    return scores;
  };

  const whyScore = (key, n, h) => {
    const name = h.businessName || "This business";
    const map = {
      design: n >= 4 ? "The look is already strong. We would tighten conversion, not start over." : n === 3 ? "The site exists but does not feel as sharp as the local leaders." : "There is no clear brand look online. First impressions are being lost.",
      website: n >= 4 ? "The site is live and usable. Next step is capturing every visitor." : n === 3 ? "A website is live, but it is not built to convert after-hours visitors." : `${name} is hard to find as a proper website. People bounce to a competitor.`,
      reviews: n >= 4 ? "Reviews are compounding. Keep the ask automatic." : n === 3 ? "Maps is present, but reviews are not requested as a habit." : "Google Maps is thin. Trust is being decided without you.",
      automation: n >= 4 ? "Someone (or a system) replies fast. Keep it." : "Night and lunch messages wait. That is where bookings leak.",
      rankings: n >= 4 ? "Search and Maps already work in your favour." : n === 3 ? "You appear, but not first. SEO/AEO can close that gap." : "People searching your category rarely land on you first.",
      seo: n >= 3 ? "There is a base to rank. We would deepen pages and answers Google now prefers." : "Search and answer engines have almost nothing to rank. This is the first leak if you want inbound.",
      social: n >= 3 ? "Profiles exist. DMs and posting still need a system." : "Social is quiet. Competitors own the scroll and the inbox.",
      overall: n >= 4 ? "Solid base. The win is systems, not more ads." : n === 3 ? "Average online. A competitor who replies at 11pm will take the lead." : "The cost of waiting is lost enquiries every week. Fix the basics first."
    };
    return map[key] || "";
  };

  const paid = (acc) => acc.payment.status === "paid";
  const docsReady = (acc) => Boolean(acc.docs.gst && acc.docs.aadhaar && acc.docs.website && acc.docs.privacy && acc.docs.metaAccess);
  const tatDaysLeft = (startedAt, total) => {
    if (!startedAt) return total;
    return Math.max(0, Math.ceil((startedAt + total * DAY - Date.now()) / DAY));
  };
  const tatPct = (startedAt, total) => {
    if (!startedAt) return 0;
    return Math.min(100, Math.round(((Date.now() - startedAt) / (total * DAY)) * 100));
  };

  const unlocked = (acc, id) => {
    if (id === "health") return true;
    if (id === "proposal") return acc.health.scored;
    if (id === "payment") return acc.proposal.viewed;
    if (id === "onboarding") return paid(acc);
    if (id === "approvals" || id === "automation" || id === "reviews") return paid(acc);
    return true;
  };

  const completion = (acc) => {
    const checks = [
      acc.health.scored,
      acc.proposal.viewed,
      paid(acc),
      docsReady(acc),
      acc.design.submitted,
      acc.whatsapp.submitted,
      acc.reviews.submitted
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };

  const startTat = (acc) => {
    if (!docsReady(acc) || acc.tat.startedAt) return;
    acc.tat.startedAt = Date.now();
    acc.stage = "approvals";
  };

  const iconMail = '<svg class="ico" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" stroke-width="2"/><path d="m4 7 8 6 8-6" stroke="currentColor" stroke-width="2"/></svg>';
  const iconLock = '<svg class="ico" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/><path d="M8 10V8a4 4 0 0 1 8 0v2" stroke="currentColor" stroke-width="2"/></svg>';
  const googleMark = '<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.4h6.5c-.3 1.5-1.2 2.8-2.5 3.6v3h4c2.4-2.2 3.5-5.4 3.5-8.7z"/><path fill="#34A853" d="M12 24c3.2 0 6-1 7.9-2.9l-4-3.1c-1.1.7-2.5 1.2-3.9 1.2-3 0-5.6-2-6.5-4.8H1.3v3.1C3.2 21.3 7.3 24 12 24z"/><path fill="#FBBC05" d="M5.5 14.4A7.2 7.2 0 0 1 5.1 12c0-.8.1-1.6.4-2.4V6.5H1.3A12 12 0 0 0 0 12c0 1.9.5 3.8 1.3 5.5l4.2-3.1z"/><path fill="#EA4335" d="M12 4.8c1.8 0 3.4.6 4.6 1.8l3.5-3.5C18 1.1 15.2 0 12 0 7.3 0 3.2 2.7 1.3 6.5l4.2 3.1C6.4 6.8 9 4.8 12 4.8z"/></svg>';

  const loginChrome = (cardInner) => `
    <div class="login-page">
      <header class="login-head">
        <a class="login-brand" href="/">
          <img src="/webwise-logo.png" alt="Webwise Digital" />
          <span><b>WEBWISE DIGITAL</b><small>Systems that scale businesses</small></span>
        </a>
        <a class="help-btn" href="https://wa.me/918796504200?text=Hi%20Webwise%2C%20I%20need%20help%20with%20client%20login." target="_blank" rel="noopener">Need help?</a>
      </header>
      <div class="login-body">
        <div class="login-copy">
          <h1>Your Business. <span>Clearly Analyzed. Intelligently Optimized.</span></h1>
          <p class="sub">A simple client portal: health check, proposal, payment, then we build the system with you.</p>
          <ul class="feat">
            <li><i>✓</i><div><b>100% Secure &amp; Private</b><span>Your data stays protected.</span></div></li>
            <li><i>1–5</i><div><b>Clear scores, not jargon</b><span>A one-page health check you can actually read.</span></div></li>
            <li><i>→</i><div><b>Then a simple path</b><span>Proposal → payment → onboarding. One stage at a time.</span></div></li>
          </ul>
        </div>
        <div class="preview-stage" aria-hidden="true">
          <div class="preview-card">
            <h3>Business Health Check</h3>
            <p class="hint">Sample format — 1 to 5, one page.</p>
            <div class="bars">
              <div class="bar">Design<i><em style="width:60%"></em></i>3</div>
              <div class="bar">Reviews<i><em style="width:40%"></em></i>2</div>
              <div class="bar">Automation<i><em style="width:40%"></em></i>2</div>
              <div class="bar">Rankings<i><em style="width:40%"></em></i>2</div>
            </div>
            <div class="preview-cta"><span>Build. Automate. Scale.</span><span>→</span></div>
          </div>
        </div>
        ${cardInner}
      </div>
      <footer class="login-foot"><span>Trusted by 100+ businesses</span><span>© Webwise Digital</span></footer>
    </div>`;

  const googleSetupHint = () => {
    const origin = location.origin.replace(/\/$/, "");
    const back = `${origin}/client/index.html`;
    return `<div class="note">
      <b>Google 404 = two locks. Open both.</b>
      <ol style="margin:8px 0 0;padding-left:18px">
        <li><b>Vercel</b> → project <b>webwise-landing</b> → Settings → Deployment Protection → turn Preview protection <b>off</b> (Only Production, or Disabled).</li>
        <li><b>Supabase</b> → Authentication → URL Configuration → set <b>Site URL</b> to:<br><code>${esc(back)}</code></li>
        <li>Same page, Redirect URLs, add <b>exactly</b>:<br><code>${esc(back)}</code><br>and<br><code>${esc(origin)}/**</code></li>
      </ol>
    </div>`;
  };

  const viewLogin = (mode = "login") => {
    const isLogin = mode === "login";
    return loginChrome(`
      <aside class="login-card">
        <div class="login-card-head">
          <div class="shield">${googleMark}</div>
          <div>
            <h2>${isLogin ? "Welcome back" : "Get your Health Check"}</h2>
            <p>${isLogin ? "Log in to your portal." : "Create an account. We email the report after you confirm this address."}</p>
          </div>
        </div>
        <form id="emailForm">
          ${isLogin ? "" : `<div class="field"><label>Full name <span class="req">*</span></label><div class="ico-field"><input name="name" required placeholder="Your name" /></div></div>`}
          <div class="field"><label>Work email</label><div class="ico-field">${iconMail}<input name="email" type="email" required placeholder="you@business.com" /></div></div>
          <div class="field"><label>Password</label><div class="ico-field">${iconLock}<input id="passInput" name="password" type="password" minlength="8" required /><button class="eye" type="button" id="togglePass" aria-label="Show password">◉</button></div></div>
          ${isLogin ? `<div class="forgot"><a href="#/forgot">Forgot password?</a></div>` : `<p class="hint">By continuing you agree to the <a href="/terms-of-service/" target="_blank" rel="noopener">Terms of Service</a>.</p>`}
          <p class="error hidden" id="authErr"></p>
          <button class="btn-login" type="submit">${isLogin ? "Log in" : "Yes, give me my Business Health Check Report"}</button>
        </form>
        <div class="or">or continue with</div>
        <div class="sso"><button type="button" id="googleBtn">${googleMark} Continue with Google</button></div>
        ${googleSetupHint()}
        ${isLogin ? `<p class="hint" style="margin-top:12px">By continuing you agree to the <a href="/terms-of-service/" target="_blank" rel="noopener">Terms of Service</a>.</p>` : ""}
        <p class="switch">${isLogin ? `New here? <a href="#/signup">Get your Health Check →</a>` : `Already have an account? <a href="#/login">Log in</a>`}</p>
      </aside>`);
  };

  const viewSso = () => loginChrome(`
    <aside class="login-card">
      <h2>Continue with Google</h2>
      <p class="hint">Opening Google so you can choose an account.</p>
      ${googleSetupHint()}
      <p class="error hidden" id="authErr"></p>
      <button class="btn-login" type="button" id="startGoogle">Continue to Google</button>
      <p class="switch"><a href="#/login">Back to login</a></p>
    </aside>`);

  const viewForgot = () => loginChrome(`
    <aside class="login-card">
      <h2>Reset password</h2>
      <form id="forgotForm">
        <div class="field"><label>Work email</label><input name="email" type="email" required /></div>
        <p class="error hidden" id="authErr"></p>
        <button class="btn-login" type="submit">Send reset code</button>
      </form>
      <p class="switch"><a href="#/login">Back to login</a></p>
    </aside>`);

  const viewVerify = (user) => loginChrome(`
    <aside class="login-card">
      <h2>Confirm it's you</h2>
      <p class="hint">Code sent to ${esc(user.email)}. Demo code: <b>${esc(user.pendingCode)}</b></p>
      <form id="verifyForm">
        <div class="field"><label>Code</label><input name="code" maxlength="6" required /></div>
        <p class="error hidden" id="verErr"></p>
        <button class="btn-login" type="submit">Verify</button>
      </form>
    </aside>`);

  const viewCheckInbox = (email) => loginChrome(`
    <aside class="login-card">
      <h2>Check your email</h2>
      <p>We sent a confirmation link to ${esc(email)}.</p>
      <p class="switch"><a href="#/login">Back to login</a></p>
    </aside>`);

  const nav = (user) => `
    <header class="topbar"><div class="nav">
      <a class="brand" href="/"><img src="/webwise-logo.png" alt="" /><span class="brand-word">WEBWISE <span>DIGITAL</span></span></a>
      <div class="nav-right">
        <a class="hide-sm" href="/">Website</a>
        <span class="live">Portal</span>
        <a href="#/dashboard">${esc(user.name || user.email)}</a>
        <button class="btn btn-secondary" type="button" id="logoutBtn">Log out</button>
      </div>
    </div></header>`;

  const progressBar = (acc, nowId) => {
    const pct = completion(acc);
    const reached = SECTIONS.findIndex((s) => s.id === nowId);
    return `<div class="progress-shell">
      <div class="progress-meta"><span>Your progress</span><b>${pct}%</b></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="steps">${SECTIONS.map((s, i) => `<span class="step-chip ${i < reached ? "done" : i === reached ? "now" : ""}">${esc(s.label)}</span>`).join("")}</div>
    </div>`;
  };

  const side = (acc, now) => `
    <aside class="side">
      <p class="live">Your workspace</p>
      <a href="#/dashboard" class="${now === "dashboard" ? "on" : ""}">Dashboard</a>
      ${SECTIONS.map((s) => {
        const open = unlocked(acc, s.id);
        return `<a href="#${s.path}" class="${now === s.id ? "on" : ""} ${open ? "" : "locked"}">${esc(s.label)}</a>`;
      }).join("")}
    </aside>`;

  const shell = (user, acc, now, inner) => `${nav(user)}<main class="wrap"><div class="dash">${side(acc, now)}<div>${progressBar(acc, now)}${inner}</div></div></main><p class="footer-mini">Webwise Digital — Calm inside. Systems outside.</p>`;

  const lockView = (user, acc, now, title, need) => shell(user, acc, now, `
    <p class="eyebrow">${esc(title)}</p>
    <h1>This step opens next.</h1>
    <p class="lock-note">${esc(need)}</p>
    <div class="actions"><a class="btn btn-primary" href="#/dashboard">Back to dashboard</a></div>`);

  const pips = (n) => `<span class="pips">${[1, 2, 3, 4, 5].map((i) => {
    const on = i <= n ? (n <= 2 ? "low" : n <= 3 ? "mid" : "on") : "";
    return `<i class="pip ${on}"></i>`;
  }).join("")}</span>`;

  const viewDash = (user, acc) => {
    const start = acc.tat.startedAt;
    return shell(user, acc, "dashboard", `
      <p class="eyebrow">Dashboard</p>
      <h1>Where things <span>stand.</span></h1>
      <p class="lead">One screen. No maze. Finish the open item, then the next section unlocks.</p>
      <div class="metric-grid">
        <div class="metric"><div class="k">Health check</div><div class="v ${acc.health.scored ? "good" : "warn"}">${acc.health.scored ? "Ready" : "Open"}</div></div>
        <div class="metric"><div class="k">Proposal</div><div class="v">${acc.proposal.viewed ? "Seen" : "—"}</div></div>
        <div class="metric"><div class="k">Payment</div><div class="v ${paid(acc) ? "good" : "warn"}">${paid(acc) ? "Paid" : "Waiting"}</div></div>
        <div class="metric"><div class="k">Documents</div><div class="v">${docsReady(acc) ? "In" : "Needed"}</div></div>
        <div class="metric"><div class="k">Build clock</div><div class="v">${start ? "Running" : "—"}</div></div>
      </div>
      ${start ? `<div class="tat-grid" style="margin-top:16px">
        <div class="tat-card"><h3>Smart Site</h3><div class="days">${tatDaysLeft(start, 14)}d</div><p class="hint">14-day TAT · ${tatPct(start, 14)}%</p><div class="progress-track"><div class="progress-fill" style="width:${tatPct(start, 14)}%"></div></div></div>
        <div class="tat-card"><h3>WhatsApp Automation</h3><div class="days">${tatDaysLeft(start, 21)}d</div><p class="hint">21-day TAT · ${tatPct(start, 21)}%</p><div class="progress-track"><div class="progress-fill" style="width:${tatPct(start, 21)}%"></div></div></div>
        <div class="tat-card"><h3>Other services</h3><div class="days">${tatDaysLeft(start, 14)}d</div><p class="hint">14-day TAT · ${tatPct(start, 14)}%</p><div class="progress-track"><div class="progress-fill" style="width:${tatPct(start, 14)}%"></div></div></div>
      </div>` : ""}
      <div class="actions">
        <a class="btn btn-primary" href="#/${!acc.health.scored ? "health" : !acc.proposal.viewed ? "proposal" : !paid(acc) ? "payment" : !docsReady(acc) ? "onboarding" : !acc.design.submitted ? "approvals" : !acc.whatsapp.submitted ? "automation" : "reviews"}">Continue →</a>
      </div>`);
  };

  const viewHealth = (user, acc) => {
    const h = acc.health;
    if (h.scored) return viewReport(user, acc);
    return shell(user, acc, "health", `
      <p class="eyebrow">Health Check · before we meet</p>
      <h1>Five facts. <span>One page.</span></h1>
      <p class="lead">Business name, website, Google Maps, category, owner. We score 1–5. No long quiz.</p>
      <div class="card">
        <form id="healthForm">
          <div class="field"><label>Business name <span class="req">*</span></label><input name="businessName" required value="${esc(h.businessName)}" /></div>
          <div class="field"><label>Owner name <span class="req">*</span></label><input name="ownerName" required value="${esc(h.ownerName)}" /></div>
          <div class="field"><label>Website</label><input name="website" type="url" placeholder="https://" value="${esc(h.website)}" /></div>
          <div class="field"><label>Google Maps link</label><input name="maps" placeholder="https://maps.google.com/..." value="${esc(h.maps)}" /></div>
          <div class="field"><label>Category <span class="req">*</span></label>
            <select name="category" required>${CATEGORIES.map((c) => `<option ${h.category === c ? "selected" : ""}>${c}</option>`).join("")}</select>
          </div>
          <label class="check"><input type="checkbox" name="seoInterest" ${h.seoInterest ? "checked" : ""} /><span>I also care about showing up on Google / AI answers (SEO &amp; AEO)</span></label>
          <label class="check"><input type="checkbox" name="includeSocial" ${h.includeSocial ? "checked" : ""} /><span>Include social media presence in this report</span></label>
          <div class="actions"><button class="btn btn-primary" type="submit">Build my one-pager →</button></div>
        </form>
      </div>`);
  };

  const scoreRows = (h) => {
    const keys = ["design", "reviews", "automation", "rankings", "website"];
    if (h.seoInterest) keys.push("seo");
    if (h.includeSocial) keys.push("social");
    keys.push("overall");
    return `<div class="score-5">${keys.map((k) => {
      const n = h.scores[k];
      return `<div class="score-row"><b>${SCORE_LABELS[k]}</b>${pips(n)}<span class="score-n">${n}/5</span><p class="score-why">${esc(whyScore(k, n, h))}</p></div>`;
    }).join("")}</div>`;
  };

  const viewReport = (user, acc) => {
    const h = acc.health;
    return shell(user, acc, "health", `
      <p class="eyebrow">Health Check Report</p>
      <h1>${esc(h.businessName)} · <span>one page</span></h1>
      <p class="lead">Prepared for ${esc(h.ownerName)} · ${esc(h.category)} · ${esc(h.at || today())}. Scores are 1 (weak) to 5 (strong).</p>
      <article class="ww-report" id="healthReport">
        <div class="ww-r-top">
          <div class="ww-r-brand"><img src="/webwise-logo.png" alt="" /><b>WEBWISE</b>&nbsp;<span>DIGITAL</span></div>
          <div class="ww-r-from"><strong>Saurabh Chugh</strong>Founder, Webwise Digital</div>
        </div>
        <div class="ww-r-banner">
          <div class="kicker">Pre-meeting Health Check</div>
          <h1>${esc(h.businessName)}</h1>
          <p>${esc(h.website || "No website listed")} · ${esc(h.category)}</p>
        </div>
        <div class="ww-r-body">${scoreRows(h)}</div>
        <div class="ww-r-foot"><span>Calm inside. Systems outside.</span><span>Email copy of record</span></div>
      </article>
      <div class="actions">
        <button class="btn btn-secondary" type="button" id="editHealth">Update details</button>
        <a class="btn btn-primary" href="#/proposal">I’m interested — show me the proposal →</a>
      </div>`);
  };

  const viewProposal = (user, acc) => {
    if (!unlocked(acc, "proposal")) return lockView(user, acc, "proposal", "Proposal", "Finish the health check first.");
    const name = acc.health.businessName || "your business";
    return shell(user, acc, "proposal", `
      <p class="eyebrow">Proposal</p>
      <h1>What we would <span>run for you.</span></h1>
      <p class="lead">Plain language. What you get, what it costs, what you lose by waiting.</p>
      <div class="result-cards">
        <div class="result-card"><p class="before">Before</p><p>Night messages sit until morning. Reviews asked “when we remember”. Site looks live but does not convert.</p></div>
        <div class="result-card"><p class="after">After</p><p>Reply in seconds. Review link after every visit. Smart Site that talks to the visitor. Same system we run on our own work.</p></div>
      </div>
      <div class="card" style="margin-top:16px">
        <h2>Included</h2>
        <ul>
          <li>High-converting Smart Site</li>
          <li>WhatsApp Automation</li>
          <li>Review &amp; Reputation (GBP included)</li>
        </ul>
        <h2>Bonuses</h2>
        <p>Google Business Profile, social profile tidy-up, message positioning — no extra fee.</p>
        <h2>Optional add-ons</h2>
        <p>SEO / AEO · Social media automation · Email automation · IVR / voice calling</p>
        <p class="strike">${rupee(PRICE.list)} / month list</p>
        <p class="price">${rupee(PRICE.partner)} + GST / month</p>
        <p class="hint">First year at partner rate ≈ ${rupee(PARTNER_GST * 12)} including GST. Doing this with two hires and vendors typically crosses ₹2L.</p>
        <div class="note"><b>Cost of waiting:</b> every unanswered night lead is a booking ${esc(name)} does not get. Ads cannot fix a closed inbox.</div>
      </div>
      <div class="actions">
        <a class="btn btn-primary" href="#/payment">Yes, I want this — go to payment →</a>
        <a class="btn btn-secondary" href="#/health">Back to report</a>
      </div>`);
  };

  const viewPayment = (user, acc) => {
    if (!unlocked(acc, "payment")) return lockView(user, acc, "payment", "Payment", "Open the proposal first.");
    if (paid(acc)) {
      return shell(user, acc, "payment", `
        <p class="eyebrow">Payment</p>
        <h1>Payment <span>received.</span></h1>
        <p class="lead">Onboarding is open. Upload documents so the build clock can start.</p>
        <div class="actions"><a class="btn btn-primary" href="#/onboarding">Go to onboarding →</a></div>`);
    }
    return shell(user, acc, "payment", `
      <p class="eyebrow">Payment</p>
      <h1>Confirm and we <span>start.</span></h1>
      <p class="lead">${rupee(PRICE.partner)} + GST / month (${rupee(PARTNER_GST)} this invoice). UPI, card or net banking.</p>
      <div class="pay-opts">
        <div class="pay-opt on">UPI</div>
        <div class="pay-opt on">Card</div>
        <div class="pay-opt on">Net banking</div>
      </div>
      ${acc.payment.reminderAt ? `<p class="note">Reminder marked ${esc(acc.payment.reminderAt)}. We’ll nudge this inbox if payment is still open.</p>` : ""}
      <div class="actions">
        <button class="btn btn-primary" type="button" id="payNow">Pay ${rupee(PARTNER_GST)} →</button>
        <button class="btn btn-secondary" type="button" id="payRemind">Remind me tomorrow</button>
      </div>`);
  };

  const viewOnboarding = (user, acc) => {
    if (!unlocked(acc, "onboarding")) return lockView(user, acc, "onboarding", "Onboarding", "Payment comes first.");
    const d = acc.docs;
    return shell(user, acc, "onboarding", `
      <p class="eyebrow">Onboarding</p>
      <h1>Documents we <span>need.</span></h1>
      <p class="lead">GST, Aadhaar, live website, privacy policy, Meta access. When these are in, the 14 / 21 day clocks start.</p>
      <div class="card">
        <form id="docsForm">
          <div class="field"><label>Website URL <span class="req">*</span></label><input name="website" required placeholder="https://" value="${esc(d.website || acc.health.website)}" /></div>
          <div class="field"><label>Meta / WhatsApp Business access note</label><input name="metaAccess" placeholder="Number or Business Manager ID" value="${esc(d.metaAccess)}" /></div>
          <div class="kyc">
            <label class="file-row">GST certificate <input name="gst" type="file" accept=".pdf,image/*" /> <span class="ok">${d.gst ? esc(d.gst) : "Required"}</span></label>
            <label class="file-row">Aadhaar <input name="aadhaar" type="file" accept=".pdf,image/*" /> <span class="ok">${d.aadhaar ? esc(d.aadhaar) : "Required"}</span></label>
            <label class="file-row">Privacy policy (PDF or link) <input name="privacy" type="file" accept=".pdf,image/*" /> <span class="ok">${d.privacy ? esc(d.privacy) : "Required"}</span></label>
          </div>
          <p class="hint">Core work: Smart Site, WhatsApp Automation, Review &amp; Reputation. Add-ons below are optional.</p>
          <label class="check"><input type="checkbox" name="seo" ${acc.upsells.seo ? "checked" : ""} /> SEO / AEO</label>
          <label class="check"><input type="checkbox" name="social" ${acc.upsells.social ? "checked" : ""} /> Social media automation</label>
          <label class="check"><input type="checkbox" name="email" ${acc.upsells.email ? "checked" : ""} /> Email automation</label>
          <label class="check"><input type="checkbox" name="ivr" ${acc.upsells.ivr ? "checked" : ""} /> IVR / voice calling</label>
          <div class="actions"><button class="btn btn-primary" type="submit">Save documents →</button></div>
        </form>
      </div>`);
  };

  const viewApprovals = (user, acc) => {
    if (!unlocked(acc, "approvals")) return lockView(user, acc, "approvals", "Approvals", "Pay first, then this section opens.");
    const d = acc.design;
    return shell(user, acc, "approvals", `
      <p class="eyebrow">Web design approval</p>
      <h1>How should it <span>look?</span></h1>
      <p class="lead">Short form. Links and files — not a long brief.</p>
      <div class="card">
        <form id="designForm">
          <div class="field"><label>Inspiration links</label><textarea name="inspiration" placeholder="Sites you like">${esc(d.inspiration)}</textarea></div>
          <div class="field"><label>Brand guidelines (or “none”)</label><input name="guidelines" value="${esc(d.guidelines)}" /></div>
          <div class="field"><label>Colour palette</label><input name="palette" placeholder="e.g. navy + gold" value="${esc(d.palette)}" /></div>
          <div class="field"><label>Old logo / files</label><input name="logo" type="file" accept="image/*,.pdf" /></div>
          <div class="field"><label>Anything else we should match</label><textarea name="refs">${esc(d.refs)}</textarea></div>
          <div class="actions"><button class="btn btn-primary" type="submit">${d.submitted ? "Update approval" : "Submit design notes →"}</button></div>
        </form>
      </div>`);
  };

  const viewAutomation = (user, acc) => {
    if (!unlocked(acc, "automation")) return lockView(user, acc, "automation", "Automation", "Pay first, then pick WhatsApp flows.");
    const w = acc.whatsapp;
    const selected = new Set(w.templates || []);
    return shell(user, acc, "automation", `
      <p class="eyebrow">WhatsApp Automation approval</p>
      <h1>Pick the flows. <span>We wire the logic.</span></h1>
      <p class="lead">Start from templates. Add extra rules in one box.</p>
      <form id="waForm" class="card">
        <div class="tpl">
          ${WA_TEMPLATES.map((t) => `<label class="${selected.has(t.id) ? "on" : ""}"><input type="checkbox" name="tpl" value="${t.id}" ${selected.has(t.id) ? "checked" : ""} /><span><b>${esc(t.name)}</b><br><span class="hint">${esc(t.d)}</span></span></label>`).join("")}
        </div>
        <div class="field" style="margin-top:14px"><label>Extra logic (optional)</label><textarea name="extraLogic" placeholder="e.g. implant leads always go to Dr. Mehta">${esc(w.extraLogic)}</textarea></div>
        <div class="actions"><button class="btn btn-primary" type="submit">${w.submitted ? "Update flows" : "Approve these flows →"}</button></div>
      </form>`);
  };

  const viewReviews = (user, acc) => {
    if (!unlocked(acc, "reviews")) return lockView(user, acc, "reviews", "Review", "Pay first, then we set reviews.");
    const r = acc.reviews;
    return shell(user, acc, "reviews", `
      <p class="eyebrow">Review &amp; Reputation</p>
      <h1>How do you ask <span>today?</span></h1>
      <p class="lead">We turn that into an automatic ask. Google Business Profile can be connected for listing cleanup.</p>
      <form id="revForm" class="card">
        <div class="field"><label>Current process</label>
          <select name="process">
            ${[["none", "We rarely ask"], ["staff", "Staff ask in person"], ["sms", "SMS / WhatsApp sometimes"], ["auto", "Already automatic"]].map(([v, l]) => `<option value="${v}" ${r.process === v ? "selected" : ""}>${l}</option>`).join("")}
          </select>
        </div>
        <div class="field"><label>Number of locations</label>
          <select name="locations">${["1", "2", "3–5", "6+"].map((v) => `<option ${r.locations === v ? "selected" : ""}>${v}</option>`).join("")}</select>
        </div>
        <div class="field"><label>Google Business Profile link (optional, for instant cleanup)</label><input name="gbp" placeholder="https://business.google.com/..." value="${esc(r.gbp)}" /></div>
        <div class="actions"><button class="btn btn-primary" type="submit">${r.submitted ? "Update" : "Save review setup →"}</button></div>
      </form>`);
  };

  const requireUser = () => {
    const user = currentUser();
    if (!user) { go("/login"); return null; }
    if (!user.verified && route() !== "/verify" && route() !== "/check-email") {
      go(cloudOn() ? "/check-email" : "/verify");
      return null;
    }
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
    const err = form.querySelector("#authErr");
    const show = (m) => { err.textContent = m; err.classList.remove("hidden"); };
    if (cloudOn()) {
      try {
        if (isLogin) {
          const user = await WebwisePortal.signInEmail({ email, password });
          go(user.verified ? "/dashboard" : "/check-email");
          return;
        }
        const result = await WebwisePortal.signUpEmail({ name, email, password, phone: "" });
        go(result.needsEmailConfirm ? "/check-email" : "/health");
      } catch (e) { show(e.message || "Could not sign in"); }
      return;
    }
    const users = loadUsers();
    const existing = users.find((u) => u.email === email && u.method === "email");
    if (isLogin) {
      if (!existing) return show("No account found. Sign up first.");
      const hash = await hashPass(password, existing.salt);
      if (hash !== existing.passHash) return show("Wrong password.");
      loginSession(existing);
      go(existing.verified ? "/dashboard" : "/verify");
      return;
    }
    if (existing) return show("That email already exists. Log in.");
    const salt = randomHex(8);
    const user = {
      id: randomHex(8), method: "email", name, email, phone: "", salt,
      passHash: await hashPass(password, salt), verified: false, optIn: true, pendingCode: otp6(), createdAt: Date.now()
    };
    upsertUser(user);
    loginSession(user);
    go("/verify");
  };

  const startGoogle = async (errEl) => {
    const show = (m) => { if (!errEl) return alert(m); errEl.textContent = m; errEl.classList.remove("hidden"); };
    if (!cloudOn()) return show("Google sign-in is not connected on this environment yet.");
    try { await WebwisePortal.oauth("google"); }
    catch (e) { show(e.message || "Google sign-in could not start."); }
  };

  const bindAuth = (mode) => {
    document.getElementById("googleBtn")?.addEventListener("click", () => startGoogle(document.getElementById("authErr")));
    document.getElementById("togglePass")?.addEventListener("click", () => {
      const input = document.getElementById("passInput");
      if (!input) return;
      input.type = input.type === "password" ? "text" : "password";
    });
    document.getElementById("emailForm")?.addEventListener("submit", (e) => { e.preventDefault(); startEmailSignup(e.target, mode === "login"); });
  };

  const fileName = async (input, kind) => {
    const f = input?.files?.[0];
    if (!f) return "";
    if (cloudOn()) return WebwisePortal.uploadKyc(kind, f);
    return f.name;
  };

  const render = async () => {
    const app = document.getElementById("app");
    const path = route();
    let user = currentUser();

    if (path === "/" || path === "/login") {
      if (cloudOn() && user?.verified) return go("/dashboard");
      app.innerHTML = viewLogin("login");
      bindAuth("login");
      return;
    }
    if (path === "/signup") { app.innerHTML = viewLogin("signup"); bindAuth("signup"); return; }
    if (path === "/check-email") { app.innerHTML = viewCheckInbox((user && user.email) || "your inbox"); return; }
    if (path === "/google") {
      app.innerHTML = viewSso();
      const err = document.getElementById("authErr");
      document.getElementById("startGoogle")?.addEventListener("click", () => startGoogle(err));
      startGoogle(err);
      return;
    }
    if (path === "/forgot") {
      app.innerHTML = viewForgot();
      document.getElementById("forgotForm").addEventListener("submit", async (e) => {
        e.preventDefault();
        const email = String(new FormData(e.target).get("email") || "").trim().toLowerCase();
        const err = document.getElementById("authErr");
        if (cloudOn()) {
          try {
            await WebwisePortal.forgotPassword(email);
            err.classList.remove("hidden");
            err.style.color = "var(--teal)";
            err.textContent = "Reset link sent if that email exists.";
          } catch (ex) { err.textContent = ex.message; err.classList.remove("hidden"); }
          return;
        }
        const existing = loadUsers().find((u) => u.email === email && u.method === "email");
        if (!existing) { err.textContent = "No portal account for that email."; err.classList.remove("hidden"); return; }
        existing.pendingCode = otp6();
        existing.verified = false;
        upsertUser(existing);
        loginSession(existing);
        go("/verify");
      });
      return;
    }
    if (path === "/verify") {
      user = currentUser();
      if (cloudOn()) return go("/check-email");
      if (!user) return go("/login");
      if (user.verified) return go("/health");
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
        go("/health");
      });
      return;
    }

    user = requireUser();
    if (!user) return;
    const acc = await ensureAccount(user);
    const persist = () => saveAccount(acc);
    const aliases = { "/funnel": "/health", "/sample": "/health", "/report": "/health", "/compare": "/proposal", "/nurture": "/proposal" };
    const viewPath = aliases[path] || path;
    const map = {
      "/dashboard": () => viewDash(user, acc),
      "/health": () => viewHealth(user, acc),
      "/proposal": () => { if (unlocked(acc, "proposal")) { acc.proposal.viewed = true; acc.proposal.at = today(); persist(); } return viewProposal(user, acc); },
      "/payment": () => viewPayment(user, acc),
      "/onboarding": () => viewOnboarding(user, acc),
      "/approvals": () => viewApprovals(user, acc),
      "/automation": () => viewAutomation(user, acc),
      "/reviews": () => viewReviews(user, acc)
    };
    app.innerHTML = (map[viewPath] || map["/dashboard"])();

    document.getElementById("logoutBtn")?.addEventListener("click", async () => {
      clearSession();
      if (cloudOn()) await WebwisePortal.logout();
      go("/login");
    });
    document.getElementById("healthForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      acc.health.businessName = String(fd.get("businessName") || "").trim();
      acc.health.ownerName = String(fd.get("ownerName") || "").trim();
      acc.health.website = String(fd.get("website") || "").trim();
      acc.health.maps = String(fd.get("maps") || "").trim();
      acc.health.category = String(fd.get("category") || "");
      acc.health.seoInterest = e.target.seoInterest.checked;
      acc.health.includeSocial = e.target.includeSocial.checked;
      acc.health.scores = scoreHealth(acc.health);
      acc.health.scored = true;
      acc.health.at = today();
      acc.stage = "proposal";
      await persist();
      if (cloudOn() && WebwisePortal.cfg.mail) {
        try {
          const lines = Object.entries(acc.health.scores).map(([k, n]) => `${SCORE_LABELS[k] || k}: ${n}/5 — ${whyScore(k, n, acc.health)}`).join("\n");
          await WebwisePortal.sendReportEmail("Your Webwise Digital Health Check", `${acc.health.businessName}\n\n${lines}`);
        } catch (ex) { console.warn(ex); }
      }
      render();
    });
    document.getElementById("editHealth")?.addEventListener("click", async () => {
      acc.health.scored = false;
      await persist();
      go("/health");
      render();
    });
    document.getElementById("payRemind")?.addEventListener("click", async () => {
      acc.payment.reminderAt = today();
      await persist();
      render();
    });
    document.getElementById("payNow")?.addEventListener("click", async () => {
      if (cloudOn() && WebwisePortal.cfg.payments) {
        try {
          const order = await WebwisePortal.pay("engagement");
          acc.payment = { status: "paid", method: "razorpay", paidAt: today(), reminderAt: acc.payment.reminderAt, orderId: order.id || "" };
          acc.stage = "onboarding";
          await persist();
          go("/onboarding");
        } catch (e) {
          if (e.message !== "Payment cancelled") alert(e.message);
        }
        return;
      }
      acc.payment = { status: "paid", method: "demo", paidAt: today(), reminderAt: acc.payment.reminderAt, orderId: "WWD-" + randomHex(3).toUpperCase() };
      acc.stage = "onboarding";
      await persist();
      go("/onboarding");
    });
    document.getElementById("docsForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      acc.docs.website = String(fd.get("website") || "").trim();
      acc.docs.metaAccess = String(fd.get("metaAccess") || "").trim();
      acc.upsells.seo = e.target.seo.checked;
      acc.upsells.social = e.target.social.checked;
      acc.upsells.email = e.target.email.checked;
      acc.upsells.ivr = e.target.ivr.checked;
      const gst = await fileName(e.target.gst, "gst");
      const aadhaar = await fileName(e.target.aadhaar, "aadhaar");
      const privacy = await fileName(e.target.privacy, "privacy");
      if (gst) acc.docs.gst = gst;
      if (aadhaar) acc.docs.aadhaar = aadhaar;
      if (privacy) acc.docs.privacy = privacy;
      if (!acc.docs.gst || !acc.docs.aadhaar || !acc.docs.website || !acc.docs.privacy || !acc.docs.metaAccess) {
        alert("Add GST, Aadhaar, website, privacy policy file and Meta access note.");
        return;
      }
      acc.docs.at = today();
      startTat(acc);
      await persist();
      go("/dashboard");
    });
    document.getElementById("designForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      acc.design.inspiration = String(fd.get("inspiration") || "");
      acc.design.guidelines = String(fd.get("guidelines") || "");
      acc.design.palette = String(fd.get("palette") || "");
      acc.design.refs = String(fd.get("refs") || "");
      const logo = e.target.logo?.files?.[0];
      if (logo) acc.design.logo = cloudOn() ? await WebwisePortal.uploadKyc("logo", logo) : logo.name;
      acc.design.submitted = true;
      await persist();
      go("/automation");
    });
    document.getElementById("waForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      acc.whatsapp.templates = [...e.target.querySelectorAll("input[name=tpl]:checked")].map((i) => i.value);
      acc.whatsapp.extraLogic = String(new FormData(e.target).get("extraLogic") || "");
      acc.whatsapp.submitted = true;
      await persist();
      go("/reviews");
    });
    document.getElementById("revForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      acc.reviews.process = String(fd.get("process") || "");
      acc.reviews.locations = String(fd.get("locations") || "");
      acc.reviews.gbp = String(fd.get("gbp") || "");
      acc.reviews.submitted = true;
      acc.stage = "live";
      await persist();
      go("/dashboard");
    });
  };

  window.addEventListener("hashchange", () => { render(); });
  const boot = async () => {
    if (window.WebwisePortal) await WebwisePortal.init();
    const next = new URLSearchParams(location.search).get("next");
    if (!location.hash) location.hash = next ? `/${next.replace(/^\//, "")}` : "/login";
    else await render();
  };
  boot();
})();
