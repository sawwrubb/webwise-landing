import { getSession } from "@/lib/session";
import { listRules, tenantOf } from "@/lib/store";
import { killAiAction, saveRuleAction } from "@/lib/actions";
import { redirect } from "next/navigation";
import { runScript } from "@/lib/ai/script-layer";

export default async function AiPage() {
  const user = await getSession();
  if (!user?.tenantId) redirect("/login");
  const tenant = tenantOf(user.tenantId)!;
  const rules = listRules(user);
  const preview = await runScript({
    tenantId: tenant.id,
    system: "Preview only. Never shown to a patient until approved.",
    user: "Simulate: implant consult Saturday",
  });

  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">AI Control</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Trust comes from the brake pedal, not the engine.</p>
        </div>
        <form action={killAiAction}>
          <input type="hidden" name="paused" value={tenant.aiPaused ? "0" : "1"} />
          <button className={tenant.aiPaused ? "btn btn-teal" : "btn btn-danger"} type="submit">
            {tenant.aiPaused ? "Resume AI" : "Pause AI — route to humans"}
          </button>
        </form>
      </div>
      <section className="card p-4">
        <h2 className="font-semibold">Preview simulator</h2>
        <p className="mt-2 text-sm">{preview.text}</p>
        <p className="mt-2 text-xs" style={{ color: "var(--muted)" }}>Provider: {preview.provider}. Reversible. Never called from the browser.</p>
      </section>
      <section className="card p-4">
        <h2 className="font-semibold">Approved rules</h2>
        {rules.map((r) => (
          <form key={r.id} action={saveRuleAction} className="mt-4 grid gap-2 border-t pt-4" style={{ borderColor: "var(--line)" }}>
            <input type="hidden" name="id" value={r.id} />
            <input name="trigger" defaultValue={r.trigger} className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
            <input name="condition" defaultValue={r.condition} className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
            <textarea name="response" defaultValue={r.response} className="min-h-24 rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
            <label className="text-sm"><input type="checkbox" name="active" defaultChecked={r.active} /> Active · v{r.version}</label>
            <button className="btn btn-primary w-fit" type="submit">Save new version</button>
          </form>
        ))}
        <form action={saveRuleAction} className="mt-6 grid gap-2">
          <h3 className="font-semibold">New rule</h3>
          <input name="trigger" placeholder="trigger" required className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
          <input name="condition" placeholder="condition" required className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
          <textarea name="response" placeholder="response" required className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
          <label className="text-sm"><input type="checkbox" name="active" defaultChecked /> Active</label>
          <button className="btn btn-primary w-fit" type="submit">Create rule</button>
        </form>
      </section>
    </div>
  );
}
