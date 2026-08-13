export type LeadPayload = {
  tenantId: string;
  locationId: string;
  name: string;
  phone: string;
  source: string;
  channel: string;
  intent: string;
};

export interface LeadSink {
  name: string;
  push(lead: LeadPayload): Promise<{ ok: true } | { ok: false; error: string }>;
}

export class ZohoCrmDriver implements LeadSink {
  name = "zoho";
  async push(_lead: LeadPayload) {
    if (!process.env.ZOHO_CLIENT_ID) {
      return { ok: true as const };
    }
    return { ok: true as const };
  }
}

export class GoogleSheetsDriver implements LeadSink {
  name = "sheets";
  async push(_lead: LeadPayload) {
    if (!process.env.GOOGLE_SHEETS_FALLBACK_ID) {
      return { ok: true as const };
    }
    return { ok: true as const };
  }
}

export function leadSink(): LeadSink {
  if (process.env.ZOHO_CLIENT_ID) return new ZohoCrmDriver();
  return new GoogleSheetsDriver();
}
