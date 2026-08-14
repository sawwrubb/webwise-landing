#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const kitsDir = path.join(root, "kits");
const outDir = path.join(root, "..", "preview");
const css = fs.readFileSync(path.join(root, "assets", "kit.css"), "utf8");

const REQUIRED = [
  "id", "status", "niche", "pill", "businessName", "title", "description",
  "hero", "guardrails", "strip", "chat", "problem", "system", "workflow",
  "safety", "niches", "control", "faq", "form", "whatsapp", "resultCard", "rules", "leakQuiz"
];

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function loadKits() {
  return fs.readdirSync(kitsDir)
    .filter((name) => name.endsWith(".json"))
    .map((name) => {
      const kit = JSON.parse(fs.readFileSync(path.join(kitsDir, name), "utf8"));
      const missing = REQUIRED.filter((key) => kit[key] == null);
      if (missing.length) throw new Error(`${name} missing: ${missing.join(", ")}`);
      return kit;
    })
    .sort((a, b) => Number(a.status !== "dogfood") - Number(b.status !== "dogfood") || a.id.localeCompare(b.id));
}

function waLink(phone, text) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

function monthlyLeak(card) {
  const missed = card.enquiriesPerMonth * card.missRate;
  return Math.round(missed * card.arpuInr * card.closeRate);
}

function renderPage(kit) {
  const phone = kit.whatsapp.phone;
  const primary = waLink(phone, kit.whatsapp.demoText);
  const leak = monthlyLeak(kit.resultCard);
  const banner = kit.status === "dogfood"
    ? "DOGFOOD · Webwise running Webwise · not a public marketing page yet"
    : "TEMPLATE · cloned from the Webwise kit · not sold as a live client page yet";
  const chat = kit.chat.messages.map((msg, i) => {
    const delay = `m${Math.min(i + 1, 5)}`;
    if (msg.type === "typing") return `<div class="bubble system ${delay}">…</div>`;
    return `<div class="bubble ${escapeHtml(msg.type)} ${delay}">${escapeHtml(msg.text)}</div>`;
  }).join("");
  const faqs = kit.faq.map((item) => `
    <div class="faq-item"><button type="button" onclick="this.parentElement.classList.toggle('open')">${escapeHtml(item.q)}<span class="plus">+</span></button><div class="faq-a">${escapeHtml(item.a)}</div></div>`).join("");
  const types = kit.form.types.map((t) => `<option>${escapeHtml(t)}</option>`).join("");
  const issues = kit.form.issues.map((t) => `<option>${escapeHtml(t)}</option>`).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex,nofollow" />
<title>${escapeHtml(kit.title)}</title>
<meta name="description" content="${escapeHtml(kit.description)}" />
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
<style>${css}</style>
</head>
<body>
<div class="lab-banner"><span>${escapeHtml(banner)}</span><a href="/preview/">All kits</a></div>
<nav class="nav"><div class="wrap nav-inner">
  <a class="brand" href="/">WEBWISE<em>DIGITAL</em></a>
  <div class="nav-links">
    <a href="#result">Result Card</a>
    <a href="#system">System</a>
    <a href="#demo" class="nav-cta">Build demo</a>
  </div>
</div></nav>
<main>
<section class="hero">
  <div class="wrap hero-grid">
    <div>
      <div class="hero-pill">${escapeHtml(kit.pill)}</div>
      <h1>${escapeHtml(kit.hero.headline)}</h1>
      <p class="hero-copy">${escapeHtml(kit.hero.copy)}</p>
      <div class="btn-row">
        <a class="btn-primary" href="#result">${escapeHtml(kit.hero.primaryCta)}</a>
        <a class="btn-secondary" href="${primary}">${escapeHtml(kit.hero.secondaryCta)}</a>
      </div>
      <div class="guardrails">${kit.guardrails.map((g) => `<span>${escapeHtml(g)}</span>`).join("")}</div>
      <div class="kit-meta"><span>Kit: ${escapeHtml(kit.id)}</span><span>${escapeHtml(kit.niche)}</span><span>${escapeHtml(kit.status)}</span></div>
    </div>
    <div class="phone">
      <div class="phone-head"><span>${escapeHtml(kit.chat.title)}</span><span class="phone-status">${escapeHtml(kit.chat.status)}</span></div>
      <div class="chat">${chat}</div>
    </div>
  </div>
</section>
<div class="strip"><div class="wrap strip-inner"><b>${escapeHtml(kit.strip.label)}</b><div class="strip-items">${kit.strip.items.map((i) => `<span>${escapeHtml(i)}</span>`).join("")}</div></div></div>
<section id="result">
  <div class="wrap split">
    <div>
      <div class="eyebrow">Result Card</div>
      <h2>If this leak stays open, the month already has a cost.</h2>
      <p class="copy">${escapeHtml(kit.resultCard.story)}</p>
      <p class="copy">This card uses honest ranges, not fake case studies. Change the quiz answers on the right to see the number move.</p>
    </div>
    <div class="result-card">
      <div class="tag">Estimated monthly leak</div>
      <div class="leak-inr" id="leakInr">₹${leak.toLocaleString("en-IN")}</div>
      <p class="copy" id="leakStory">${escapeHtml(kit.resultCard.leakLabel)}</p>
      <div id="quizBox"></div>
    </div>
  </div>
</section>
<section id="problem">
  <div class="wrap split">
    <div>
      <div class="eyebrow">${escapeHtml(kit.problem.eyebrow)}</div>
      <h2>${escapeHtml(kit.problem.title)}</h2>
      ${kit.problem.copy.map((p) => `<p class="copy">${escapeHtml(p)}</p>`).join("")}
    </div>
    <div class="panel">
      <h3>${escapeHtml(kit.problem.fixTitle)}</h3>
      <div class="problem-lines">${kit.problem.fixes.map((f) => `<div class="line-card"><b>${escapeHtml(f.title)}</b><span class="copy">${escapeHtml(f.copy)}</span></div>`).join("")}</div>
    </div>
  </div>
</section>
<section id="system">
  <div class="wrap">
    <div class="eyebrow">${escapeHtml(kit.system.eyebrow)}</div>
    <h2>${escapeHtml(kit.system.title)}</h2>
    <div class="grid3">${kit.system.cards.map((c) => `<article class="card"><div class="num">${escapeHtml(c.num)}</div><div class="tag">${escapeHtml(c.tag)}</div><h3>${escapeHtml(c.title)}</h3><p>${escapeHtml(c.copy)}</p></article>`).join("")}</div>
  </div>
</section>
<section id="workflow">
  <div class="wrap split">
    <div>
      <div class="eyebrow">${escapeHtml(kit.workflow.eyebrow)}</div>
      <h2>${escapeHtml(kit.workflow.title)}</h2>
      <p class="copy">${escapeHtml(kit.workflow.copy)}</p>
    </div>
    <div class="workflow">${kit.workflow.steps.map((s) => `<div class="flow-step"><div><b>${escapeHtml(s.title)}</b><p>${escapeHtml(s.copy)}</p></div></div>`).join("")}</div>
  </div>
</section>
<section id="safety">
  <div class="wrap grid2">
    <div class="panel">
      <div class="eyebrow">Allowed</div>
      <h2>${escapeHtml(kit.safety.allowTitle)}</h2>
      <div class="safe-list">${kit.safety.allow.map((x) => `<div class="safe-item"><i>+</i><div>${escapeHtml(x)}</div></div>`).join("")}</div>
    </div>
    <div class="panel">
      <div class="eyebrow">Hard stop</div>
      <h2>${escapeHtml(kit.safety.stopTitle)}</h2>
      <div class="safe-list">${kit.safety.stop.map((x) => `<div class="safe-item stop"><i>x</i><div>${escapeHtml(x)}</div></div>`).join("")}</div>
    </div>
  </div>
</section>
<section>
  <div class="wrap split">
    <div>
      <div class="eyebrow">Fits this work</div>
      <h2>${escapeHtml(kit.niches.title)}</h2>
      <p class="copy">${escapeHtml(kit.niches.copy)}</p>
      <div class="niche-list">${kit.niches.tags.map((t) => `<span>${escapeHtml(t)}</span>`).join("")}</div>
    </div>
    <div>
      <div class="eyebrow">You keep control</div>
      <h2>${escapeHtml(kit.control.title)}</h2>
      <p class="copy">${escapeHtml(kit.control.copy)}</p>
      <div class="control-grid">${kit.control.items.map((i) => `<div>${escapeHtml(i)}</div>`).join("")}</div>
    </div>
  </div>
</section>
<section class="cta" id="demo">
  <div class="wrap split">
    <div>
      <div class="eyebrow">${escapeHtml(kit.form.eyebrow)}</div>
      <h2>${escapeHtml(kit.form.title)}</h2>
      <p class="copy">${escapeHtml(kit.form.copy)}</p>
    </div>
    <div class="form-card" id="formCard">
      <h3>${escapeHtml(kit.form.button)}</h3>
      <div class="field"><label>Business name</label><input id="f-name" type="text" placeholder="${escapeHtml(kit.form.namePlaceholder)}" /></div>
      <div class="field"><label>WhatsApp number</label><input id="f-wa" type="tel" placeholder="+91 98765 43210" /></div>
      <div class="field"><label>${escapeHtml(kit.form.typeLabel)}</label><select id="f-type"><option value="">Select</option>${types}</select></div>
      <div class="field"><label>Biggest leak</label><select id="f-issue"><option value="">Select</option>${issues}</select></div>
      <button class="form-btn" id="formBtn" type="button">${escapeHtml(kit.form.button)}</button>
      <div class="form-error" id="formError"></div>
      <p class="form-note">Kit lab form. Same n8n capture Webwise already uses. Preview pages are noindex.</p>
    </div>
  </div>
</section>
<section id="faq">
  <div class="wrap">
    <div class="eyebrow">FAQ</div>
    <h2>Questions before anyone trusts the system.</h2>
    <div class="faq-grid">${faqs}</div>
  </div>
</section>
</main>
<footer><div class="wrap">Webwise Digital Solutions · Kit lab · +91 8796504200 · Preview only</div></footer>
<script>
const KIT = ${JSON.stringify(kit)};
const quiz = { index: 0, answers: [] };
function inr(n){ return "₹" + Math.round(n).toLocaleString("en-IN"); }
function leakFromAnswers(){
  const card = KIT.resultCard;
  let miss = card.missRate;
  const after = quiz.answers.find((a) => a.q.includes("after hours") || a.q.includes("reply"));
  if (after && /next|not tracked|next day/i.test(after.a)) miss = Math.min(0.55, miss + 0.15);
  if (after && /under 5|5 minutes/i.test(after.a)) miss = Math.max(0.12, miss - 0.12);
  const recorded = quiz.answers.find((a) => /record|sheet|saved/i.test(a.q));
  if (recorded && /^no$/i.test(recorded.a)) miss = Math.min(0.6, miss + 0.1);
  const missed = card.enquiriesPerMonth * miss;
  return Math.round(missed * card.arpuInr * card.closeRate);
}
function renderQuiz(){
  const box = document.getElementById("quizBox");
  const q = KIT.leakQuiz[quiz.index];
  if (!q) {
    const n = leakFromAnswers();
    document.getElementById("leakInr").textContent = inr(n);
    document.getElementById("leakStory").textContent = "Your answers moved the card. This is still a range until real enquiry data is connected.";
    box.innerHTML = "<p class='copy'>Score mapped. Send the form or WhatsApp to walk the live flow.</p>";
    return;
  }
  box.innerHTML = "<div class='quiz-q'><b>" + q.q + "</b>" + q.a.map((opt) => "<button type='button' data-a='" + opt.replace(/'/g, "&#39;") + "'>" + opt + "</button>").join("") + "</div>";
  box.querySelectorAll("button").forEach((btn) => btn.addEventListener("click", () => {
    quiz.answers.push({ q: q.q, a: btn.getAttribute("data-a") });
    quiz.index += 1;
    document.getElementById("leakInr").textContent = inr(leakFromAnswers());
    renderQuiz();
  }));
}
renderQuiz();
document.getElementById("formBtn").addEventListener("click", () => {
  const fields = ["f-name","f-wa","f-type","f-issue"].map((id) => document.getElementById(id));
  const error = document.getElementById("formError");
  if (fields.some((el) => !el.value.trim())) { error.style.display = "block"; error.textContent = "Fill every field."; return; }
  const data = {
    business_name: fields[0].value.trim(),
    whatsapp: fields[1].value.trim(),
    business_type: fields[2].value,
    biggest_issue: fields[3].value,
    source: "Kit lab " + KIT.id,
    page_type: "kit_preview_" + KIT.id,
    kit_status: KIT.status,
    submitted_at: new Date().toISOString()
  };
  const waText = encodeURIComponent("Hi Webwise, kit " + KIT.id + "\\nBusiness: " + data.business_name + "\\nType: " + data.business_type + "\\nLeak: " + data.biggest_issue);
  fetch("https://wwds.app.n8n.cloud/webhook/webwise-lead-capture", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) })
    .then((res) => { if (!res.ok) throw new Error("fail"); document.getElementById("formCard").innerHTML = "<div class='success'><b>Request in.</b><p>Message WhatsApp if you want this kit walked live.</p><a class='btn-primary' href='https://wa.me/${phone}?text=" + waText + "'>WhatsApp</a></div>"; })
    .catch(() => { error.style.display = "block"; error.innerHTML = "Form did not confirm. <a href='https://wa.me/${phone}?text=" + waText + "'>Message WhatsApp</a>"; });
});
</script>
</body></html>`;
}

function renderGallery(kits) {
  const cards = kits.map((kit) => `
    <a class="card" href="/preview/${escapeHtml(kit.id)}/">
      <div class="status">${escapeHtml(kit.status)}</div>
      <h3>${escapeHtml(kit.businessName)}</h3>
      <p>${escapeHtml(kit.niche)}</p>
      <p class="copy" style="margin-top:12px">${escapeHtml(kit.hero.headline)}</p>
    </a>`).join("");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="robots" content="noindex,nofollow" />
<title>Webwise Kit Lab</title>
<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700;900&display=swap" rel="stylesheet" />
<style>${css}</style>
</head>
<body>
<div class="lab-banner"><span>KIT LAB · dogfood first · templates second · sell later</span><a href="/">Live site</a></div>
<section>
  <div class="wrap">
    <div class="eyebrow">Step 1 then 2 then 3</div>
    <h1>Run it on Webwise. Then copy the recipe.</h1>
    <p class="copy">The Webwise kit is client zero. Other kits are the same page with a different filling. Live homepage, clinic, and real-estate pages are not generated from here yet.</p>
    <div class="gallery" style="margin-top:32px">${cards}</div>
  </div>
</section>
</body></html>`;
}

const kits = loadKits();
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "index.html"), renderGallery(kits));
for (const kit of kits) {
  const dir = path.join(outDir, kit.id);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.html"), renderPage(kit));
  fs.writeFileSync(path.join(dir, "rules.json"), JSON.stringify(kit.rules, null, 2));
  fs.writeFileSync(path.join(dir, "result-card.json"), JSON.stringify({
    ...kit.resultCard,
    estimatedMonthlyLeakInr: monthlyLeak(kit.resultCard)
  }, null, 2));
}
console.log(`Generated ${kits.length} kits → preview/`);
