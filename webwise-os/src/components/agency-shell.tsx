import Link from "next/link";
import { logoutAction } from "@/lib/actions";
import type { SessionUser } from "@/lib/types";

const NAV = [
  { href: "/agency", label: "Tenants" },
  { href: "/agency/delivery", label: "Delivery" },
  { href: "/agency/flags", label: "Flagged AI" },
  { href: "/agency/tasks", label: "Tasks" },
  { href: "/agency/revenue", label: "Revenue" },
  { href: "/agency/rules", label: "Rules library" },
];

export function AgencyShell({ user, children }: { user: SessionUser; children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <header className="border-b px-6 py-4" style={{ borderColor: "var(--line)", background: "var(--navy)" }}>
        <div className="flex items-center gap-6">
          <div className="font-semibold">WEBWISE · AGENCY</div>
          <nav className="flex gap-3 text-sm">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="opacity-80 hover:opacity-100">{n.label}</Link>
            ))}
          </nav>
          <div className="ml-auto flex items-center gap-3 text-sm">
            <span style={{ color: "var(--muted)" }}>{user.email}</span>
            <form action={logoutAction}>
              <button className="btn btn-ghost btn-sm" type="submit">Sign out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="px-6 py-6">{children}</main>
    </div>
  );
}
