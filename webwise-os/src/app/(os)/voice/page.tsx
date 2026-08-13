import Link from "next/link";
import { getSession } from "@/lib/session";
import { listCalls } from "@/lib/store";
import { EmptyState } from "@/components/states";
import { redirect } from "next/navigation";

export default async function VoicePage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const calls = listCalls(user);
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Voice AI</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>Every missed call becomes a lead record.</p>
      {calls.length === 0 ? (
        <EmptyState title="No calls in this period" body="Connect Voice AI when missed-call recovery is the gap." action={<Link className="btn btn-primary" href="/home">See Leak Score</Link>} />
      ) : calls.map((c) => (
        <Link key={c.id} href={c.leadId ? `/leads/${c.leadId}` : "/leads"} className="card p-4">
          <div className="font-semibold">{c.who} · {c.outcome}</div>
          <p className="text-sm" style={{ color: "var(--muted)" }}>{c.transcript}</p>
        </Link>
      ))}
    </div>
  );
}
