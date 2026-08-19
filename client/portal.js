(() => {
  const emptyAccount = (user) => ({
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
    nurtureArmed: false,
    reportUnlocked: false
  });

  const mapUser = (session, profile) => {
    if (!session?.user) return null;
    const u = session.user;
    const meta = u.user_metadata || {};
    const method = meta.method || (u.app_metadata?.provider === "azure" ? "microsoft" : u.app_metadata?.provider) || "email";
    return {
      id: u.id,
      email: u.email || "",
      phone: u.phone || profile?.phone || meta.phone || "",
      name: profile?.name || meta.name || meta.full_name || (u.email || "").split("@")[0],
      method,
      verified: Boolean(u.email_confirmed_at || u.phone_confirmed_at || method === "google" || method === "microsoft" || method === "azure"),
      optIn: true
    };
  };

  window.WebwisePortal = {
    enabled: false,
    cfg: {},
    sb: null,
    session: null,
    profile: null,

    async init() {
      try {
        const res = await fetch("/api/public-config");
        this.cfg = await res.json();
      } catch {
        this.cfg = { cloud: false };
      }
      this.enabled = Boolean(this.cfg.cloud && window.supabase && this.cfg.supabaseUrl);
      if (!this.enabled) return;
      this.sb = window.supabase.createClient(this.cfg.supabaseUrl, this.cfg.supabaseAnon);
      const { data } = await this.sb.auth.getSession();
      this.session = data.session;
      if (this.session) await this.refreshProfile();
      this.sb.auth.onAuthStateChange((_event, session) => {
        this.session = session;
      });
    },

    token() {
      return this.session?.access_token || "";
    },

    async refreshProfile() {
      if (!this.session) { this.profile = null; return; }
      const { data } = await this.sb.from("profiles").select("*").eq("id", this.session.user.id).maybeSingle();
      this.profile = data;
    },

    currentUser() {
      return mapUser(this.session, this.profile);
    },

    async signUpEmail({ name, email, password, phone }) {
      const redirectTo = `${location.origin}/client/`;
      const { data, error } = await this.sb.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectTo,
          data: { name, phone, method: "email" }
        }
      });
      if (error) throw error;
      this.session = data.session;
      return { needsEmailConfirm: !data.session };
    },

    async signInEmail({ email, password }) {
      const { data, error } = await this.sb.auth.signInWithPassword({ email, password });
      if (error) throw error;
      this.session = data.session;
      await this.refreshProfile();
      return mapUser(this.session, this.profile);
    },

    async oauth(provider) {
      const supabaseProvider = provider === "microsoft" ? "azure" : "google";
      const { error } = await this.sb.auth.signInWithOAuth({
        provider: supabaseProvider,
        options: {
          redirectTo: `${location.origin}/client/#/funnel`,
          skipBrowserRedirect: false,
          queryParams: { prompt: "select_account" }
        }
      });
      if (error) throw error;
    },

    async signInPhone(phone) {
      const formatted = phone.startsWith("+") ? phone : `+91${phone}`;
      const { error } = await this.sb.auth.signInWithOtp({ phone: formatted });
      if (error) throw error;
      return formatted;
    },

    async verifyPhone(phone, token) {
      const { data, error } = await this.sb.auth.verifyOtp({ phone, token, type: "sms" });
      if (error) throw error;
      this.session = data.session;
      await this.refreshProfile();
      return mapUser(this.session, this.profile);
    },

    async forgotPassword(email) {
      const { error } = await this.sb.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/client/#/login`
      });
      if (error) throw error;
    },

    async logout() {
      if (this.sb) await this.sb.auth.signOut();
      this.session = null;
      this.profile = null;
    },

    async loadAccount(user) {
      const { data, error } = await this.sb.from("portal_accounts").select("state").eq("user_id", user.id).maybeSingle();
      if (error) throw error;
      if (!data?.state || !data.state.userId) {
        const acc = emptyAccount(user);
        await this.saveAccount(acc);
        return acc;
      }
      return { ...emptyAccount(user), ...data.state, userId: user.id };
    },

    async saveAccount(acc) {
      const { error } = await this.sb.from("portal_accounts").upsert({
        user_id: acc.userId,
        state: acc,
        updated_at: new Date().toISOString()
      });
      if (error) throw error;
    },

    async uploadKyc(kind, file) {
      const user = this.currentUser();
      const path = `${user.id}/${kind}-${Date.now()}-${file.name}`;
      const { error } = await this.sb.storage.from("kyc").upload(path, file, { upsert: true });
      if (error) throw error;
      return path;
    },

    async api(path, body) {
      const res = await fetch(path, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token()}`
        },
        body: JSON.stringify(body || {})
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || "Request failed");
      return data;
    },

    async sendReportEmail(subject, text) {
      return this.api("/api/send-email", { template: "report", subject, text });
    },

    async armNurture() {
      return this.api("/api/nurture-arm", {});
    },

    async payCompetitorPack() {
      if (!window.Razorpay) throw new Error("Razorpay checkout failed to load");
      const order = await this.api("/api/razorpay-order", {});
      return new Promise((resolve, reject) => {
        const rzp = new window.Razorpay({
          key: order.keyId,
          amount: order.amount,
          currency: order.currency,
          name: "Webwise Digital",
          description: "Competitor pack — 2 domestic + 1 global",
          order_id: order.orderId,
          handler: async (response) => {
            try {
              const verified = await this.api("/api/razorpay-verify", response);
              resolve(verified.order);
            } catch (err) { reject(err); }
          },
          modal: { ondismiss: () => reject(new Error("Payment cancelled")) }
        });
        rzp.open();
      });
    }
  };
})();
