import { getSession } from "@/lib/session";
import { flaggedAcrossTenants } from "@/lib/store";
import { EmptyState } from "@/components/states";
import { redirect } from "next/navigation";

export default async function FlagsPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const rows = flaggedAcrossTenants(user);
  return (
    <div className="grid gap-3">
      <h1 className="text-3xl font-semibold">Flagged AI</h1>
      {rows.length === 0 ? (
        <EmptyState title="No flags" body="When a client taps AI got this wrong, it lands here." />
      ) : rows.map((m) => (
        <article key={m.id} className="card p-4 text-sm">
          {m.tenantId} · {m.body}
        </article>
      ))}
    </div>
  );
}
