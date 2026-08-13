import type { NichePreset } from "../lib/types";

export const niches: NichePreset[] = [
  {
    id: "clinics",
    name: "Clinics & Doctors",
    kpiDefaults: ["Leads captured", "Appointments booked", "No-show recovery", "Revenue recovered"],
    pageTemplate: "clinic-consult",
    reviewFlow: "post-visit-whatsapp",
    rules: [
      {
        trigger: "new_enquiry",
        condition: "mentions implant OR consultation",
        response: "Saturday morning slots are open. Is this a new implant or a second opinion?",
      },
      {
        trigger: "after_hours",
        condition: "hour >= 21 OR hour < 9",
        response: "We are closed but I can hold a slot and confirm with reception at 9am.",
      },
    ],
  },
  {
    id: "travel",
    name: "Travel & Tourism",
    kpiDefaults: ["Package enquiries", "Quotes sent", "Deposits", "Revenue recovered"],
    pageTemplate: "package-quote",
    reviewFlow: "post-trip",
    rules: [
      {
        trigger: "new_enquiry",
        condition: "mentions dates OR destination",
        response: "I can hold a package quote. How many travellers and which month?",
      },
    ],
  },
  {
    id: "ca",
    name: "Chartered Accountants",
    kpiDefaults: ["ITR intakes", "Documents collected", "Filings done", "Revenue recovered"],
    pageTemplate: "itr-intake",
    reviewFlow: "post-filing",
    rules: [
      {
        trigger: "new_enquiry",
        condition: "mentions ITR OR GST",
        response: "I can start intake. Is this ITR, GST, or company work? I will not give legal advice here.",
      },
    ],
  },
];

export function nicheById(id: string) {
  return niches.find((n) => n.id === id) ?? niches[0];
}
