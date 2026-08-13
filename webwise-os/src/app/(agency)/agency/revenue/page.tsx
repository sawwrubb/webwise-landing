import { getSession } from "@/lib/session";
import { listTenants } from "@/lib/store";
import { inr } from "@/lib/revenue";
import { redirect } from "next/navigation";

export default async function RevenuePage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const tenants = listTenants(user);
  const mrr = tenants.reduce((s, t) => s + t.mrrInr, 0);
  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-semibold">Revenue</h1>
      <div className="card p-6">
        <div className="text-sm" style={{ color: "var(--muted)" }}>MRR (INR) · current book vs last month book (demo prior = 0 churn)</div>
        <div className="text-4xl font-semibold">{inr(mrr)}</div>
      </div>
    </div>
  );
}
