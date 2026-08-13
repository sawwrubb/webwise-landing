window.WEBWISE_OS = {
  brand: {
    name: "Webwise OS",
    agency: "Webwise Digital",
    tagline: "India's AI automation operating system",
    promise: "Once you log in, you should feel an AI agency running your acquisition — not a vendor sending updates."
  },

  demoUsers: {
    "client@webwise": {
      password: "demo123",
      role: "client",
      name: "Dr. Meera Kapoor",
      business: "Kapoor Dental Studio",
      niche: "clinics",
      city: "Dwarka, New Delhi",
      onboardingComplete: true
    },
    "new@webwise": {
      password: "demo123",
      role: "client",
      name: "Rahul Sharma",
      business: "Sharma Travels",
      niche: "travel",
      city: "Jaipur",
      onboardingComplete: false
    },
    "agency@webwise": {
      password: "demo123",
      role: "agency",
      name: "Saurabh Chugh",
      business: "Webwise Digital",
      niche: "agency",
      city: "New Delhi",
      onboardingComplete: true
    }
  },

  services: {
    core: [
      {
        id: "landing",
        name: "AI Smart Site / Landing Pages",
        module: "landing",
        status: "live",
        summary: "Niche landing systems that talk, capture, and route every visitor into WhatsApp, call, or booking.",
        automation: "Generate, launch, and iterate pages from approved niche templates with UTM-to-lead tracking.",
        conversion: "Every CTA opens a qualified conversation, not a dead form.",
        retention: "Clients see live page analytics and A/B winners inside the same login they use for WhatsApp.",
        deliverables: ["Niche landing system", "AI site chat", "UTM capture", "Mobile-first speed", "Booking / enquiry CTAs"]
      },
      {
        id: "whatsapp",
        name: "WhatsApp Automation",
        module: "whatsapp",
        status: "live",
        summary: "White-label WhatsApp engine: instant replies, qualification, booking, and lead records.",
        automation: "AI replies in seconds from approved rules, then logs need, timing, and next step.",
        conversion: "Night and weekend enquiries become appointments before staff start work.",
        retention: "Shared inbox + weekly conversion report makes the system feel owned, not rented.",
        deliverables: ["White-label WhatsApp workspace", "AI agent + human handoff", "Broadcasts & templates", "Lead record", "Ad-to-chat attribution"]
      },
      {
        id: "reviews",
        name: "Review & Reputation",
        module: "reviews",
        status: "live",
        summary: "Ask at the moment of satisfaction, recover detractors privately, grow Google proof.",
        automation: "Post-visit / post-stay triggers fire automatically from booking or POS events.",
        conversion: "Fresh 5-star density lifts local pack trust and ad conversion.",
        retention: "Monthly reputation score + recovered complaints keep owners watching the OS.",
        deliverables: ["Review ask flows", "Private recovery path", "Google listing hygiene", "Review widgets", "Staff alert on 1–3 stars"]
      }
    ],
    upsell: [
      {
        id: "seo",
        name: "SEO, AEO & GEO",
        module: "seo",
        status: "available",
        summary: "Get found in Google, AI answers, and maps — not just on a keyword spreadsheet.",
        automation: "Technical fixes, entity pages, schema, and citation tracking run on a weekly agent loop.",
        conversion: "High-intent local and AI-referred traffic lands on pages that already convert to WhatsApp.",
        retention: "Rank + citation dashboards replace opaque SEO PDFs.",
        deliverables: ["Local SEO", "Answer Engine Optimization", "Generative Engine Optimization", "Schema & entities", "AI-search citations"]
      },
      {
        id: "social",
        name: "Social Media Management",
        module: "social",
        status: "available",
        summary: "Content that proves the system, plus DMs that join the same AI agent.",
        automation: "Calendar, captions, and creative drafts generated from niche playbooks; DMs route to WhatsApp OS.",
        conversion: "Instagram and Facebook stop being a graveyard — they become enquiry channels.",
        retention: "One inbox for comments + DMs + WhatsApp reduces 'another social vendor' churn.",
        deliverables: ["Content calendar", "Creative system", "DM automation", "Ad creative support", "Proof-of-work posts"]
      },
      {
        id: "voice",
        name: "Voice AI & Calling",
        module: "voice",
        status: "available",
        summary: "Missed calls answered, qualified, booked — then summarised on WhatsApp.",
        automation: "IVR + voice agent handles FAQs, hours, and booking intent 24/7.",
        conversion: "Google Maps and ads that generate calls no longer leak after two rings.",
        retention: "Call recordings + transcripts sit next to chat history, so owners trust the full loop.",
        deliverables: ["AI voice / IVR", "Missed-call recovery", "Appointment booking", "Call-to-WhatsApp summary", "After-hours coverage"]
      }
    ]
  },

  levers: [
    { service: "Landing Pages", line: "Ship niche pages that speak, capture intent, and hand every click to WhatsApp with UTM intact." },
    { service: "WhatsApp Automation", line: "Reply in under five seconds, qualify, book, and log — so night enquiries never die." },
    { service: "Reviews & Reputation", line: "Ask at peak satisfaction, recover detractors in private, and compound Google proof weekly." },
    { service: "SEO / AEO / GEO", line: "Rank for local intent and get cited in AI answers, then drop that traffic onto converting pages." },
    { service: "Social Media", line: "Treat every DM as an enquiry channel and every post as public proof the system is working." },
    { service: "Voice AI & Calling", line: "Answer the call the owner missed, book it, and drop a WhatsApp summary so no ring is a dead end." }
  ],

  niches: {
    current: [
      {
        id: "clinics",
        name: "Clinics & Doctors",
        code: "CL",
        outcome: "Enquiry → qualification → appointment → reminder → review.",
        playbook: "Capture implant, cosmetic, and general queries 24/7. Confirm slots, cut no-shows, and ask for Google reviews after successful visits.",
        kpis: ["Appointments booked", "No-show rate", "Review velocity", "After-hours capture"]
      },
      {
        id: "hospitality",
        name: "Hotels & Restaurants",
        code: "RH",
        outcome: "Interest → reservation / event enquiry → upsell → review.",
        playbook: "Handle table, banquet, and stay questions instantly. Recover abandoned reservations and push reviews post-dining.",
        kpis: ["Reservations", "Event leads", "Avg response time", "Repeat visits"]
      },
      {
        id: "spas",
        name: "Spas & Salons",
        code: "SA",
        outcome: "Empty slot → booking → rebooking → membership.",
        playbook: "Fill chairs with instant booking, waitlist recovery, and package upsells. Rebook before the client leaves the chat.",
        kpis: ["Utilisation", "Rebook rate", "Package attach", "Review score"]
      },
      {
        id: "realestate",
        name: "Real Estate & Architects",
        code: "RE",
        outcome: "Listing click → site visit → consult.",
        playbook: "Qualify budget, timeline, and location. Book site visits automatically and keep every project enquiry in one record.",
        kpis: ["Qualified leads", "Site visits", "Consult bookings", "Speed-to-lead"]
      },
      {
        id: "d2c",
        name: "D2C Brands",
        code: "D2",
        outcome: "Product question → purchase → repeat.",
        playbook: "Answer catalog, shipping, and size questions. Recover carts on WhatsApp and trigger post-purchase reviews.",
        kpis: ["Conversations to order", "Repeat rate", "Cart recovery", "CSAT"]
      },
      {
        id: "services",
        name: "Service-based Businesses",
        code: "SV",
        outcome: "Enquiry → quote → job booked → review.",
        playbook: "Capture scope, urgency, and location. Auto-qualify, assign, and follow up until the job is booked.",
        kpis: ["Quoted jobs", "Win rate", "Follow-up SLA", "Review asks"]
      }
    ],
    expansion: [
      {
        id: "travel",
        name: "Travel & Tourism",
        code: "TR",
        ripe: "High message volume, seasonal spikes, and quote-heavy sales that die in inboxes.",
        playbook: "Package enquiry bot, itinerary qualifier, deposit reminders, and post-trip reviews. Voice AI for last-minute changes.",
        wedge: "Start with WhatsApp quote desk + landing pages for top packages."
      },
      {
        id: "ca",
        name: "Chartered Accountants",
        code: "CA",
        ripe: "Deadline-driven, document-heavy, and still run on missed calls and Excel.",
        playbook: "Intake for ITR, GST, and company work. Document collection on WhatsApp, reminder cadences, and review engine after filing.",
        wedge: "Seasonal ITR landing + WhatsApp document vault + voice overflow in July–September."
      },
      {
        id: "diagnostics",
        name: "Diagnostic Labs & Pharmacies",
        code: "DX",
        ripe: "Walk-in and phone-first, huge repeat volume, almost no structured follow-up.",
        playbook: "Home collection booking, report-ready WhatsApp, refill reminders, and Maps review velocity.",
        wedge: "Missed-call recovery + report WhatsApp + Google reviews."
      },
      {
        id: "education",
        name: "Coaching & Education",
        code: "ED",
        ripe: "Admission spikes, counsellor bottlenecks, and parents messaging after hours.",
        playbook: "Course qualifier, demo class booking, fee follow-up, and parent-broadcast templates.",
        wedge: "Landing + counsellor AI + Voice AI for counselling overflow."
      },
      {
        id: "auto",
        name: "Auto Dealers & Workshops",
        code: "AU",
        ripe: "Test-drive and service bookings still live on reception desks.",
        playbook: "Model enquiry, test-drive slots, service reminders, and review asks after delivery.",
        wedge: "WhatsApp desk + service reminder Voice AI."
      },
      {
        id: "legal",
        name: "Legal & Compliance Firms",
        code: "LG",
        ripe: "Intake is manual, confidentiality-sensitive, and slow to first response.",
        playbook: "Matter intake, conflict check questions, appointment booking, and document collection with human-only legal advice.",
        wedge: "Smart site + guarded WhatsApp intake + review engine."
      }
    ]
  },

  competitors: [
    {
      name: "Ryze.ai",
      type: "AI marketing OS / agency-in-a-box",
      scale: "Positioned as autonomous ads + SEO + site agents with white-label agency dashboards.",
      effective: [
        "Sells 'AI agents' not retainers — clients feel software running, not people chasing.",
        "White-label reports and multi-account command center for agencies.",
        "Onboarding speed and month-to-month commercial posture vs 6–12 month lock-in.",
        "Premium, futuristic product UI that signals category leadership."
      ],
      takeaway: "Webwise OS must present every service as a live agent with a dashboard, not a PDF update. Premium visual language is part of the sale."
    },
    {
      name: "Hyperleap.ai",
      type: "India-first omnichannel AI infrastructure",
      scale: "SMB-focused, one agent across web, WhatsApp, Instagram, and Messenger.",
      effective: [
        "One knowledge base, many channels — multi-service feel without tool sprawl.",
        "Clear India/SMB positioning: enterprise-grade without enterprise theatre.",
        "Document-grounded answers plus human handoff.",
        "Industry stories (hospitality, real estate, tourism) that match Webwise niches."
      ],
      takeaway: "Package Webwise as one operating system with modules, not six vendors. Lead with India operator credibility and niche playbooks Hyperleap cannot deliver as done-for-you."
    },
    {
      name: "Wati",
      type: "WhatsApp growth platform",
      scale: "16,000+ customers, unified inbox across WhatsApp and adjacent channels.",
      effective: [
        "Inbox-first UX: marketing, sales, and support in one conversation workspace.",
        "AI agents for qualify / support with explicit deflection metrics.",
        "Ad-to-chat attribution and campaign tooling.",
        "Social proof at SaaS scale (G2, logos, message volume)."
      ],
      takeaway: "Steal the inbox + campaign + AI agent pattern. Differentiate by wrapping landing, reviews, SEO, social, and voice around WhatsApp so Webwise is the agency OS, not another BSP."
    },
    {
      name: "Interakt",
      type: "WhatsApp CRM & commerce (India)",
      scale: "Strong India SMB/D2C footprint with catalogs, journeys, and retargeting.",
      effective: [
        "CRM objects on WhatsApp (contacts, journeys, catalogs).",
        "Commerce and recovery flows native to chat.",
        "India pricing and onboarding language."
      ],
      takeaway: "For D2C and service niches, ship journeys (cart, appointment, document) not just chat. Keep Webwise brand on the client portal even when WhatsApp is white-label underneath."
    },
    {
      name: "WebinarKit",
      type: "Automated engagement & onboarding",
      scale: "Always-on webinars, AI chat that sells, white-label for agencies.",
      effective: [
        "Onboarding is a product: just-in-time education while motivation is high.",
        "Engagement scoring and follow-up from behaviour, not calendars.",
        "White-label stickiness — clients live inside 'your' branded room."
      ],
      takeaway: "Webwise onboarding must be a guided, branded flow (brief → connect → go-live → first win), with replayable OS walkthroughs instead of a kickoff call graveyard."
    }
  ],

  blueprint: {
    principle: "Clients should recognise an AI automation agency in the first five seconds after login: live agents, live numbers, live conversations.",
    modules: [
      { name: "Command Center", purpose: "Cross-service KPIs, leak score, live activity, and AI agent status." },
      { name: "Landing Studio", purpose: "Pages, variants, conversion paths, and publish status." },
      { name: "Conversation OS", purpose: "WhatsApp / IG / Messenger inbox, flows, broadcasts, attribution." },
      { name: "Reputation Engine", purpose: "Ask, recover, publish, and score reviews." },
      { name: "Discover Agent", purpose: "SEO + AEO + GEO tasks, rankings, and AI citations." },
      { name: "Social Desk", purpose: "Calendar, creatives, and DMs merged into Conversation OS." },
      { name: "Voice Bridge", purpose: "Calls, transcripts, bookings, WhatsApp summaries." },
      { name: "Billing & Reports", purpose: "Invoices, retainers, module usage, white-label PDFs." },
      { name: "Onboarding Rail", purpose: "14-day go-live checklist with auto-nudges." },
      { name: "Niche Switcher", purpose: "Playbooks and KPIs swap by industry without a new product." }
    ],
    flows: [
      { name: "Acquire", steps: "Ad / Maps / SEO → Landing → WhatsApp or Voice → Qualified record." },
      { name: "Convert", steps: "AI qualify → book / quote → human handoff if needed → confirmation." },
      { name: "Compound", steps: "Service delivered → review ask → social proof → SEO entity boost." },
      { name: "Expand", steps: "In-OS upsell of SEO, Social, Voice based on leak score, not a sales email." },
      { name: "Onboard", steps: "Invite → profile → connect channels → approve scripts → first live conversation → first report." }
    ],
    ux: [
      "Dark, dense, cyan-lit command UI (Ryze signal) with Satoshi + Webwise cyan/teal.",
      "Left rail of modules like a SaaS product (Hyperleap multi-service), not a WordPress client area.",
      "WhatsApp inbox as a first-class room (Wati / Interakt), extended with landing, reviews, SEO, voice.",
      "First-run onboarding overlay with progress, not a Google Doc (WebinarKit).",
      "Live pulse feed so the OS feels awake at 11:47 PM."
    ]
  },

  onboardingSteps: [
    { id: 1, title: "Business profile", hint: "Name, niche, city, hours, languages." },
    { id: 2, title: "Connect WhatsApp", hint: "White-label number or existing WABA." },
    { id: 3, title: "Approve AI rules", hint: "Services, prices, fallback to human." },
    { id: 4, title: "Landing brief", hint: "Offer, proof, primary CTA." },
    { id: 5, title: "Review listing", hint: "Google Business Profile + ask timing." },
    { id: 6, title: "Go live", hint: "Test enquiry, staff handoff, first dashboard." }
  ],

  clients: {
    clinics: {
      kpis: [
        { label: "Leads captured", value: "186", delta: "+23%", tone: "up" },
        { label: "AI reply time", value: "4.2s", delta: "24/7", tone: "up" },
        { label: "Appointments", value: "74", delta: "+18%", tone: "up" },
        { label: "Leak score", value: "82", delta: "was 54", tone: "up" }
      ],
      landing: {
        url: "kapoordental.webwise.site",
        status: "Live",
        visitors: 2418,
        conv: "9.4%",
        variants: [
          { name: "Implant consult", visitors: 1104, conv: "11.2%", status: "Winner" },
          { name: "Whitening offer", visitors: 812, conv: "8.1%", status: "Testing" },
          { name: "Maps night page", visitors: 502, conv: "7.6%", status: "Live" }
        ]
      },
      chats: [
        { from: "Ananya S.", channel: "WhatsApp", time: "2m", preview: "Is implant consultation available this Saturday?", state: "AI qualified", unread: true },
        { from: "Rohit M.", channel: "Instagram", time: "18m", preview: "Price for teeth whitening?", state: "Waiting human", unread: true },
        { from: "Neha K.", channel: "WhatsApp", time: "1h", preview: "Confirmed 11:00 AM Saturday", state: "Booked", unread: false },
        { from: "Vikram D.", channel: "Site chat", time: "3h", preview: "Need second opinion on RCT", state: "Follow-up queued", unread: false }
      ],
      reviews: { asked: 48, submitted: 31, avg: 4.8, recovered: 3, pending: 6 },
      seo: [
        { q: "dental clinic Dwarka", pos: 3, change: "+2", type: "SEO" },
        { q: "implant consultation near me", pos: 5, change: "+4", type: "SEO" },
        { q: "best dentist Dwarka for implants", pos: "AI cited", change: "new", type: "AEO" },
        { q: "Kapoor Dental Studio maps", pos: "Local 3-pack", change: "held", type: "GEO" }
      ],
      social: [
        { when: "Today 11:00", channel: "Instagram", title: "Night enquiry recap — 3 bookings while closed", status: "Scheduled" },
        { when: "Tomorrow", channel: "Google", title: "Patient review montage", status: "Draft" },
        { when: "Fri", channel: "Facebook", title: "Implant FAQ reel from approved script", status: "In review" }
      ],
      calls: [
        { who: "+91 98•••1203", when: "Yesterday 21:14", result: "Booked Saturday 11:00", dur: "1:42" },
        { who: "+91 99•••8841", when: "Yesterday 19:02", result: "FAQ: hours + parking", dur: "0:48" },
        { who: "+91 88•••4410", when: "Mon 13:11", result: "Handoff to receptionist", dur: "2:05" }
      ],
      invoices: [
        { id: "WDS-2408", period: "Aug 2026", amount: "₹42,000", status: "Paid", items: "Core OS (Site + WhatsApp + Reviews)" },
        { id: "WDS-2407", period: "Jul 2026", amount: "₹42,000", status: "Paid", items: "Core OS" },
        { id: "WDS-VO-08", period: "Aug 2026", amount: "₹12,000", status: "Due 18 Aug", items: "Voice AI add-on" }
      ],
      activity: [
        { t: "11:47 PM", title: "New enquiry", detail: "Implant consultation — WhatsApp" },
        { t: "11:47 PM", title: "AI replied in 4s", detail: "Saturday 11:00 offered from approved rules" },
        { t: "11:49 PM", title: "Lead qualified", detail: "New implant · Saturday · Dwarka" },
        { t: "11:51 PM", title: "Appointment saved", detail: "Staff will see it at 9:00 AM" },
        { t: "9:02 AM", title: "Digest ready", detail: "3 overnight enquiries in Command Center" }
      ]
    }
  }
};
