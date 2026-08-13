import Link from "next/link";
import { logoutAction, locationAction, stopImpersonateAction } from "@/lib/actions";
import type { Location, SessionUser } from "@/lib/types";
import { CommandPalette } from "./command-palette";

const NAV = [
  { href: "/home", label: "Home" },
  { href: "/leads", label: "Leads" },
  { href: "/ai", label: "AI Control" },
  { href: "/whatsapp", label: "WhatsApp" },
  { href: "/pages", label: "Pages" },
  { href: "/reviews", label: "Reviews" },
  { href: "/discover", label: "Discover" },
  { href: "/social", label: "Social" },
  { href: "/voice", label: "Voice" },
  { href: "/reports", label: "Reports" },
  { href: "/billing", label: "Billing" },
  { href: "/settings", label: "Settings" },
];

export function ClientShell({
  user,
  locations,
  locationId,
  actionCount,
  children,
  watermark,
}: {
  user: SessionUser;
  locations: Location[];
  locationId: string;
  actionCount: number;
  children: React.ReactNode;
  watermark?: boolean;
}) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      {watermark ? <div className="watermark">Sample data</div> : null}
      <CommandPalette />
      <header className="sticky top-0 z-20 border-b px-4 py-3" style={{ background: "var(--navy)", borderColor: "var(--line)" }}>
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Link href="/home" className="font-semibold tracking-wide">WEBWISE OS</Link>
          <form action={locationAction} className="hidden items-center gap-2 sm:flex">
            <select
              name="locationId"
              defaultValue={locationId}
              className="rounded-md border bg-transparent px-2 py-1 text-sm"
              style={{ borderColor: "var(--line)" }}
            >
              <option value="all">All locations</option>
              {locations.map((l) => (
                <option key={l.id} value={l.id}>{l.name}</option>
              ))}
            </select>
            <button className="btn btn-ghost btn-sm" type="submit">Switch</button>
          </form>
          <div className="ml-auto flex items-center gap-2 text-sm">
            {user.impersonating ? (
              <form action={stopImpersonateAction}>
                <button className="btn btn-sm btn-danger" type="submit">Stop impersonation</button>
              </form>
            ) : null}
            <Link href="/leads" className="relative btn btn-ghost btn-sm">
              Queue
              {actionCount > 0 ? (
                <span className="ml-1 rounded-full px-1.5 text-xs" style={{ background: "var(--blue)" }}>{actionCount}</span>
              ) : null}
            </Link>
            <span style={{ color: "var(--muted)" }}>{user.name}</span>
            <form action={logoutAction}>
              <button className="btn btn-ghost btn-sm" type="submit">Sign out</button>
            </form>
          </div>
        </div>
        <nav className="mx-auto mt-3 flex max-w-6xl gap-1 overflow-x-auto text-sm">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="whitespace-nowrap rounded-md px-3 py-1.5 hover:bg-white/5">
              {n.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="relative z-10 mx-auto max-w-6xl px-4 py-5">{children}</main>
    </div>
  );
}
