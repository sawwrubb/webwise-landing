import { getSession } from "@/lib/session";
import { listInvoices, listUsage } from "@/lib/store";
import { inr } from "@/lib/revenue";
import { redirect } from "next/navigation";

export default async function BillingPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const invoices = listInvoices(user);
  const usage = listUsage(user);
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>Card data never lives here. Updates go to Razorpay.</p>
      {usage.map((u) => {
        const pct = u.included ? Math.round((u.consumed / u.included) * 100) : 0;
        return (
          <div key={u.meter} className="card p-4">
            <div className="flex justify-between text-sm"><span>{u.meter}</span><span>{u.consumed}/{u.included} · {pct}%</span></div>
            <div className="mt-2 h-2 rounded-full" style={{ background: "var(--line)" }}>
              <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: pct >= 80 ? "var(--warn)" : "var(--blue)" }} />
            </div>
            {pct >= 80 ? <p className="mt-2 text-sm">Overage warning at 80/100%.</p> : null}
          </div>
        );
      })}
      {invoices.map((i) => (
        <article key={i.id} className="card flex items-center justify-between p-4">
          <div>{i.period} · {inr(i.amountInr)} · {i.status}</div>
          <a className="btn btn-ghost btn-sm" href="https://razorpay.com" target="_blank" rel="noreferrer">Update payment method</a>
        </article>
      ))}
    </div>
  );
}
