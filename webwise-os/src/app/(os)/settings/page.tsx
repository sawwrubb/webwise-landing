import { getSession } from "@/lib/session";
import { caseValueAction } from "@/lib/actions";
import { tenantOf } from "@/lib/store";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const user = await getSession();
  if (!user?.tenantId) redirect("/login");
  const t = tenantOf(user.tenantId)!;
  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <section className="card p-4">
        <h2 className="font-semibold">Average case value</h2>
        <form action={caseValueAction} className="mt-3 flex gap-2">
          <input name="value" type="number" defaultValue={t.avgCaseValueInr ?? ""} className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
          <button className="btn btn-primary" type="submit">Save</button>
        </form>
      </section>
      <section className="card p-4">
        <h2 className="font-semibold">Security</h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>TOTP and device revoke ship with production auth. Demo session is 12 hours, httpOnly cookie.</p>
        <button className="btn btn-ghost mt-3" type="button">Revoke this device (demo)</button>
      </section>
      <section className="card p-4">
        <h2 className="font-semibold">Your data (DPDP)</h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>Consent is captured per lead at enquiry. Export and erasure are forced re-auth in production.</p>
        <div className="mt-3 flex gap-2">
          <button className="btn btn-primary" type="button">Request export</button>
          <button className="btn btn-danger" type="button">Request deletion</button>
        </div>
      </section>
    </div>
  );
}
