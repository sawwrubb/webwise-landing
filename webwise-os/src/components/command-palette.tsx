"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const ITEMS = [
  { href: "/home", label: "Command Center" },
  { href: "/leads", label: "Leads" },
  { href: "/ai", label: "AI Control" },
  { href: "/whatsapp", label: "WhatsApp" },
  { href: "/pages", label: "Landing pages" },
  { href: "/reviews", label: "Reviews" },
  { href: "/discover", label: "SEO / AEO / GEO" },
  { href: "/social", label: "Social" },
  { href: "/voice", label: "Voice AI" },
  { href: "/reports", label: "Reports" },
  { href: "/billing", label: "Billing" },
  { href: "/settings", label: "Settings" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const router = useRouter();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  if (!open) return null;
  const hits = ITEMS.filter((i) => i.label.toLowerCase().includes(q.toLowerCase()));
  return (
    <div className="fixed inset-0 z-50 bg-black/50 p-4" onClick={() => setOpen(false)}>
      <div className="card mx-auto mt-24 max-w-lg p-3" onClick={(e) => e.stopPropagation()}>
        <input
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Go to…"
          className="w-full rounded-lg border px-3 py-2"
          style={{ background: "var(--navy)", borderColor: "var(--line)", color: "var(--text)" }}
        />
        <ul className="mt-2">
          {hits.map((i) => (
            <li key={i.href}>
              <button
                className="w-full rounded-md px-3 py-2 text-left text-sm hover:bg-white/5"
                onClick={() => {
                  router.push(i.href);
                  setOpen(false);
                }}
              >
                {i.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
