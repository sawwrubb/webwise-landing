import Link from "next/link";
import { getSession } from "@/lib/session";
import { listLeads } from "@/lib/store";
import { EmptyState } from "@/components/states";
import { redirect } from "next/navigation";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string; q?: string }>;
}) {
  const user = await getSession();
  if (!user) redirect("/login");
  const sp = await searchParams;
  let rows = listLeads(user);
  if (sp.stage) rows = rows.filter((l) => l.stage === sp.stage);
  if (sp.q) {
    const q = sp.q.toLowerCase();
    rows = rows.filter((l) => `${l.name} ${l.phone} ${l.intent}`.toLowerCase().includes(q));
  }

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Leads</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>No enquiry closes without an outcome.</p>
        </div>
        <form className="flex gap-2">
          <input name="q" defaultValue={sp.q} placeholder="Search name, phone, intent" className="rounded-lg border px-3 py-2 text-sm" style={{ background: "transparent", borderColor: "var(--line)" }} />
          <button className="btn btn-primary btn-sm" type="submit">Search</button>
        </form>
      </div>
      <div className="flex flex-wrap gap-2 text-sm">
        {["", "new", "qualified", "booked", "showed", "no_show", "won", "lost"].map((s) => (
          <Link key={s || "all"} href={s ? `/leads?stage=${s}` : "/leads"} className="btn btn-ghost btn-sm">{s || "all"}</Link>
        ))}
      </div>
      {rows.length === 0 ? (
        <EmptyState title="No leads in this filter" body="Widen the filter or wait for the next enquiry." action={<Link className="btn btn-primary" href="/whatsapp">Open inbox</Link>} />
      ) : (
        <div className="grid gap-2">
          {rows.map((l) => (
            <Link key={l.id} href={`/leads/${l.id}`} className="card flex flex-wrap items-center justify-between gap-3 p-4">
              <div>
                <div className="font-semibold">{l.name}</div>
                <div className="text-sm" style={{ color: "var(--muted)" }}>{l.intent} · {l.channel} · {l.source}</div>
              </div>
              <div className="text-right text-sm">
                <div>Score {l.score}</div>
                <div style={{ color: "var(--muted)" }}>{l.stage}</div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
