const menuBtn = document.getElementById("menuBtn");
    const topbar = document.getElementById("topbar");
    const navLinks = document.getElementById("navLinks");
    const webwiseChat = document.getElementById("webwiseChat");
    const wwChatToggle = document.getElementById("wwChatToggle");
    const wwChatClose = document.getElementById("wwChatClose");
    const wwChatBody = document.getElementById("wwChatBody");
    const wwChatForm = document.getElementById("wwChatForm");
    const wwChatInput = document.getElementById("wwChatInput");
    const quizStage = document.getElementById("quizStage");
    const wwState = { mode: "normal", answers: [] };
    const quizQuestions = [
      { q: "What kind of business are we scoring?", h: "This helps us tailor the leak score to your industry.", a: ["Clinic or doctor", "Salon or spa", "Real estate or architect", "Restaurant or hospitality", "Wedding or catering", "D2C brand"] },
      { q: "How many enquiries did you get last week?", h: "Use your best estimate. We only need a working range.", a: ["0-10", "11-30", "31-75", "75+"] },
      { q: "How fast does someone reply after hours?", h: "This is where most hidden leakage starts.", a: ["Under 5 minutes", "Within 1 hour", "Next working day", "Not tracked"] },
      { q: "Where do enquiries come from?", h: "Pick the closest mix for your business.", a: ["Mostly website", "Calls + web forms", "Instagram + calls", "Many places"] },
      { q: "Are enquiries saved in a lead record or sheet?", h: "If it is not recorded, it is usually forgotten.", a: ["Always", "Sometimes", "Only hot ones", "No"] },
      { q: "Do staff ask the same qualifying questions every time?", h: "Consistent questions make follow-up easier.", a: ["Yes", "Mostly", "Depends who replies", "No"] },
      { q: "Are reviews requested after each visit or order?", h: "Reviews turn finished work into the next enquiry.", a: ["Always", "Sometimes", "Rarely", "No"] },
      { q: "What is the biggest gap today?", h: "Choose the pain you feel most often.", a: ["Slow replies", "Poor follow-up", "No lead visibility", "Not enough reviews"] }
    ];
    const quizState = { index: 0, answers: [] };
    const quizDefaultIcon = '<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    const quizOptionMeta = {
      "Clinic or doctor": { desc: "Hospitals, clinics, individual doctors", icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 3v5a6 6 0 0 0 12 0V3M9 3v5a3 3 0 0 0 6 0V3M18 8v4a5 5 0 0 1-10 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M8 17a4 4 0 0 0 8 0v-2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
      "Salon or spa": { desc: "Salons, barbers, spas, beauty clinics", icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 5l12 12M6 17 18 5M7 6a2 2 0 1 1-2-2 2 2 0 0 1 2 2zm0 12a2 2 0 1 1-2-2 2 2 0 0 1 2 2z" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M14 4h5v16h-5" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>' },
      "Real estate or architect": { desc: "Agents, builders, architects", icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20h16M6 20V9h6v11M14 20V4h6v16" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M8.5 12h1M8.5 15h1M16.5 8h1M16.5 11h1M16.5 14h1" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
      "Restaurant or hospitality": { desc: "Restaurants, cafes, hotels", icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 16h14M7 16a5 5 0 0 1 10 0M12 7v2M4 19h16" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M12 5h.01" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>' },
      "Wedding or catering": { desc: "Wedding planners, caterers, events", icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M8 8h8l-2 3h-4L8 8zM10 5h4l2 3H8l2-3z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><circle cx="12" cy="15" r="5" stroke="currentColor" stroke-width="2"/></svg>' },
      "D2C brand": { desc: "Online brands, eCommerce, retailers", icon: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 8h12l-1 12H7L6 8z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/><path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' },
      "0-10": { desc: "Small volume, still worth protecting" },
      "11-30": { desc: "Enough volume for leakage to hurt" },
      "31-75": { desc: "Follow-up discipline now matters" },
      "75+": { desc: "Automation should be visible every day" },
      "Under 5 minutes": { desc: "Strong response habit" },
      "Within 1 hour": { desc: "Good, but still beatable" },
      "Next working day": { desc: "High leakage risk" },
      "Not tracked": { desc: "The first gap to fix" },
      "Mostly website": { desc: "Smart Site can carry more of the load" },
      "Calls + web forms": { desc: "Needs clean capture and handoff" },
      "Instagram + calls": { desc: "Needs faster response routing" },
      "Many places": { desc: "Needs one connected flow" },
      "Always": { desc: "Good operating habit" },
      "Sometimes": { desc: "Leaks happen when volume rises" },
      "Only hot ones": { desc: "Warm leads may be missed" },
      "No": { desc: "Highest follow-up risk" },
      "Yes": { desc: "Strong front-desk standard" },
      "Mostly": { desc: "Close to system-ready" },
      "Depends who replies": { desc: "Process depends on memory" },
      "Rarely": { desc: "Review engine gap" },
      "Slow replies": { desc: "The buyer cools down" },
      "Poor follow-up": { desc: "Interest is not converted" },
      "No lead visibility": { desc: "Nobody sees what was missed" },
      "Not enough reviews": { desc: "Finished work is not compounding" }
    };

    menuBtn.addEventListener("click", () => {
      const open = topbar.classList.toggle("menu-open");
      menuBtn.setAttribute("aria-expanded", String(open));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        topbar.classList.remove("menu-open");
        menuBtn.setAttribute("aria-expanded", "false");
      });
    });

    window.addEventListener("scroll", () => {
      topbar.classList.remove("menu-open");
      menuBtn.setAttribute("aria-expanded", "false");
    }, { passive: true });

    const humanHandoffLink = (message) => `https://wa.me/918796504200?text=${encodeURIComponent(message)}`;
    const wwScroll = () => { wwChatBody.scrollTop = wwChatBody.scrollHeight; };
    const wwAddMsg = (text, type = "bot") => {
      const msg = document.createElement("div");
      msg.className = `ww-msg ${type}`;
      msg.textContent = text;
      wwChatBody.appendChild(msg);
      wwScroll();
    };
    const wwAddChips = (chips) => {
      const row = document.createElement("div");
      row.className = "ww-chips";
      chips.forEach(({ label, value }) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "ww-chip";
        chip.textContent = label;
        chip.addEventListener("click", () => wwHandleUser(value || label));
        row.appendChild(chip);
      });
      wwChatBody.appendChild(row);
      wwScroll();
    };
    const wwReply = (text, chips = []) => {
      window.setTimeout(() => {
        wwAddMsg(text);
        if (chips.length) wwAddChips(chips);
      }, 220);
    };
    const quizSafe = (value) => String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
    const renderQuizOption = (answer) => {
      const meta = quizOptionMeta[answer] || {};
      return `
        <button type="button" data-answer="${quizSafe(answer)}">
          <span class="quiz-option">
            <span class="quiz-option-icon" aria-hidden="true">${meta.icon || quizDefaultIcon}</span>
            <span class="quiz-option-copy"><b>${quizSafe(answer)}</b><span>${quizSafe(meta.desc || "Choose this if it is closest.")}</span></span>
            <span class="quiz-option-arrow" aria-hidden="true">→</span>
          </span>
        </button>
      `;
    };
    const renderQuiz = () => {
      const current = quizQuestions[quizState.index];
      if (!current) {
        const score = Math.max(42, 92 - quizState.answers.length * 5 - quizState.answers.filter((a) => /No|Not tracked|Next working day|Rarely|Poor|Slow/.test(a.value)).length * 7);
        quizStage.innerHTML = `
          <div class="quiz-progress">Result ready</div>
          <div class="quiz-question">Your follow-up leak score: ${score}/100</div>
          <p class="quiz-help">Likely gaps: response speed, lead visibility and review follow-up. Your numbers may differ once connected to real enquiry data.</p>
          <label for="quizEmail">Where should we send your custom gap report?</label>
          <div class="quiz-capture-row">
            <input id="quizEmail" type="email" placeholder="you@business.com" />
            <button class="quiz-submit" type="button" id="quizSend">Send report</button>
          </div>
        `;
        document.getElementById("quizSend").addEventListener("click", () => {
          const email = document.getElementById("quizEmail").value.trim();
          webwiseChat.classList.add("open");
          wwAddMsg(`Leak score: ${score}/100. Report email: ${email || "not shared yet"}`, "user");
          wwReply("Got it. Send this score to Webwise and we will map the gaps against your enquiry flow.", [
            { label: "Send to human", value: "handoff leak score" }
          ]);
        });
        return;
      }
      quizStage.innerHTML = `
        <div class="quiz-progress">Question ${quizState.index + 1} of ${quizQuestions.length}</div>
        <div class="quiz-question">${current.q}</div>
        <p class="quiz-help">${current.h}</p>
        <div class="quiz-options">
          ${current.a.map(renderQuizOption).join("")}
        </div>
        <div class="quiz-footnote"><i aria-hidden="true">✓</i><span>Takes 90 seconds</span><span>•</span><span>Free score</span><span>•</span><span>Instant result</span></div>
      `;
      quizStage.querySelectorAll("[data-answer]").forEach((button) => {
        button.addEventListener("click", () => {
          quizState.answers.push({ question: current.q, value: button.dataset.answer });
          quizState.index += 1;
          renderQuiz();
        });
      });
    };
    const wwStartQualify = () => {
      wwState.mode = "qualify_niche";
      wwState.answers = [];
      wwReply("Sure. Which business are we scoring first: clinic, salon, real estate, restaurant, wedding/catering, or D2C?");
    };
    const wwFinishLead = () => {
      const [niche, business, contact] = wwState.answers;
      const msg = `Hi Webwise, I want to discuss a customer acquisition system.\nBusiness: ${business || ""}\nNiche: ${niche || ""}\nContact: ${contact || ""}`;
      wwReply("I have the basics. Send this to Saurabh and the team can review your enquiry flow with context.", [
        { label: "Send to human", value: "handoff lead" },
        { label: "Ask another question", value: "what does webwise do" }
      ]);
      window.setTimeout(() => window.open(humanHandoffLink(msg), "_blank", "noopener"), 450);
      wwState.mode = "normal";
    };
    const wwHandleUser = (raw) => {
      const text = String(raw || "").trim();
      if (!text) return;
      wwAddMsg(text, "user");
      wwChatInput.value = "";

      if (wwState.mode === "qualify_niche") {
        wwState.answers.push(text);
        wwState.mode = "qualify_business";
        wwReply("Got it. What is the business name?");
        return;
      }
      if (wwState.mode === "qualify_business") {
        wwState.answers.push(text);
        wwState.mode = "qualify_contact";
        wwReply("Last step. Share the best phone number or email for follow-up.");
        return;
      }
      if (wwState.mode === "qualify_contact") {
        wwState.answers.push(text);
        wwFinishLead();
        return;
      }

      const q = text.toLowerCase();
      if (q.includes("qualify") || q.includes("audit") || q.includes("lead map") || q.includes("leak")) {
        wwStartQualify();
      } else if (q.includes("saturday")) {
        wwReply("Example: a patient asks after hours about Saturday availability. The assistant replies in seconds, asks the next useful question, saves the enquiry details and routes the request for human follow-up.", [
          { label: "Qualify my business", value: "qualify" },
          { label: "Talk to human", value: "handoff saturday booking" }
        ]);
      } else if (q.includes("book") || q.includes("call") || q.includes("calendar") || q.includes("meeting")) {
        wwReply("The fastest path is a strategy call. Send the request and Webwise will confirm the slot with you.", [
          { label: "Book strategy call", value: "handoff call" }
        ]);
      } else if (q.includes("price") || q.includes("pricing") || q.includes("cost")) {
        wwReply("We do not quote packages on the page. Book a strategy call and we will map the right system for your business.", [
          { label: "Book strategy call", value: "handoff strategy call" },
          { label: "Qualify my business", value: "qualify" }
        ]);
      } else if (q.includes("clinic") || q.includes("doctor") || q.includes("patient")) {
        wwReply("For clinics, Webwise focuses on admin-safe AI flows: enquiry replies, appointment requests, reminders, follow-up, review requests and human handoff. No medical advice.", [
          { label: "Clinic demo", value: "handoff clinic demo" },
          { label: "Qualify my clinic", value: "qualify clinic" }
        ]);
      } else if (q.includes("salon") || q.includes("spa")) {
        wwReply("For salons and spas, the system helps capture enquiries, reduce no-shows, recover missed chats, push rebooking and grow reviews.", [
          { label: "Qualify my salon", value: "qualify salon" }
        ]);
      } else if (q.includes("real estate") || q.includes("architect") || q.includes("property")) {
        wwReply("For real estate and architects, the system captures project intent, qualifies budget/location/timeline, routes hot leads and keeps follow-up visible.", [
          { label: "Qualify real estate", value: "qualify real estate" }
        ]);
      } else if (q.includes("handoff") || q.includes("human") || q.includes("saurabh")) {
        window.open(humanHandoffLink("Hi Webwise, I want to speak to a human about the customer acquisition system."), "_blank", "noopener");
        wwReply("Opening human handoff now. A human can take over there.");
      } else if (q.includes("what") || q.includes("service") || q.includes("webwise") || q.includes("automation")) {
        wwReply("Webwise builds the system behind the enquiry: Smart Site, AI Employees, business automation, reviews and handoff rules.", [
          { label: "Which niches?", value: "niches" },
          { label: "Score my follow-up leak", value: "leak" },
          { label: "Book strategy call", value: "book call" }
        ]);
      } else if (q.includes("niche") || q.includes("industry")) {
        wwReply("The six focus niches are Clinics & Doctors, Salons & Spas, Restaurants/Hospitality, Wedding Planners & Caterers, D2C Brands, and Real Estate & Architects.", [
          { label: "Qualify my business", value: "qualify" }
        ]);
      } else {
        wwReply("I can help you score your follow-up leak, show the 24/7 enquiry flow, or hand you over to Saurabh.", [
          { label: "Score my follow-up leak", value: "leak" },
          { label: "Show the 24/7 flow", value: "Ask me about Saturday bookings" },
          { label: "Talk to human", value: "handoff" }
        ]);
      }
    };

    wwChatToggle.addEventListener("click", () => {
      const opening = !webwiseChat.classList.contains("open");
      webwiseChat.classList.toggle("open", opening);
      if (opening && !wwChatBody.children.length) {
        wwReply("Your business should not stop when you do. Ask me how Webwise captures enquiries, replies in seconds, saves the details and hands off to a human.", [
          { label: "Score my follow-up leak", value: "leak" },
          { label: "Show the 24/7 flow", value: "Ask me about Saturday bookings" },
          { label: "Talk to Saurabh", value: "handoff" }
        ]);
      }
      if (opening) wwChatInput.focus();
    });
    wwChatClose.addEventListener("click", () => webwiseChat.classList.remove("open"));
    wwChatForm.addEventListener("submit", (event) => {
      event.preventDefault();
      wwHandleUser(wwChatInput.value);
    });
    renderQuiz();
