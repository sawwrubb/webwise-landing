import { listTenants, healthFor, listActions } from "@/lib/store";
import { getSession } from "@/lib/session";
import { impersonateAction, provisionAction } from "@/lib/actions";
import { inr } from "@/lib/revenue";
import { niches } from "@/niches";
import { redirect } from "next/navigation";

export default async function AgencyHome() {
  const user = await getSession();
  if (!user) redirect("/login");
  const tenants = listTenants(user);
  const tasks = listActions(user);
  return (
    <div className="grid gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Tenants</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>See who is at risk, why, and what to do — under 60 seconds.</p>
        </div>
        <form action={provisionAction} className="flex gap-2">
          <input name="name" required placeholder="New tenant name" className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
          <select name="niche" className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }}>
            {niches.map((n) => <option key={n.id} value={n.id}>{n.name}</option>)}
          </select>
          <button className="btn btn-primary" type="submit">Provision</button>
        </form>
      </div>
      <div className="overflow-x-auto card">
        <table className="w-full text-left text-sm">
          <thead>
            <tr style={{ color: "var(--muted)" }}>
              <th className="p-3">Name</th>
              <th>Niche</th>
              <th>Plan</th>
              <th>MRR</th>
              <th>Days live</th>
              <th>Health</th>
              <th>Actions</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {tenants.map((t) => {
              const h = healthFor(t);
              const open = tasks.filter((a) => a.tenantId === t.id).length;
              return (
                <tr key={t.id} className="border-t" style={{ borderColor: "var(--line)" }}>
                  <td className="p-3 font-medium">{t.name}</td>
                  <td>{t.niche}</td>
                  <td>{t.plan}</td>
                  <td>{inr(t.mrrInr)}</td>
                  <td>{t.daysLive}</td>
                  <td>
                    <span style={{ color: h.band === "green" ? "var(--teal)" : h.band === "amber" ? "var(--warn)" : "var(--danger)" }}>
                      {h.band} {h.score}{h.churnRisk ? " · churn risk" : ""}
                    </span>
                  </td>
                  <td>{open}</td>
                  <td className="p-3">
                    <form action={impersonateAction} className="flex flex-wrap items-center gap-2">
                      <input type="hidden" name="tenantId" value={t.id} />
                      <input name="reason" placeholder="Reason if write" className="rounded border px-2 py-1 text-xs" style={{ background: "transparent", borderColor: "var(--line)" }} />
                      <label className="text-xs"><input type="checkbox" name="write" /> write</label>
                      <button className="btn btn-primary btn-sm" type="submit">Open as client</button>
                    </form>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
