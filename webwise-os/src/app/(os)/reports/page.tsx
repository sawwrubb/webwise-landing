import { getSession } from "@/lib/session";
import { commandMetrics } from "@/lib/store";
import { inr } from "@/lib/revenue";
import { redirect } from "next/navigation";

export default async function ReportsPage() {
  const user = await getSession();
  if (!user?.tenantId) redirect("/login");
  const m = commandMetrics(user, "30d");
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Result Card</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>Last 30 days vs previous 30. Share this. You should not need to log in to know it works — digest at 9am.</p>
      <article className="card p-6">
        <div className="text-sm tracking-[0.2em]">WEBWISE OS</div>
        <div className="mt-4 text-4xl font-semibold">{m.revenue.amount != null ? inr(m.revenue.amount) : "Set case value"}</div>
        <p className="mt-2 text-sm">Leads {m.leads.current} · Appointments {m.appointments.current} · Leak Score {m.leak}</p>
        <div className="mt-4 flex gap-2">
          <a className="btn btn-primary" href={`https://wa.me/?text=${encodeURIComponent("Our Leak Score is " + m.leak + " this month.")}`}>Share on WhatsApp</a>
          <button className="btn btn-ghost" type="button">Download PDF</button>
        </div>
      </article>
    </div>
  );
}
