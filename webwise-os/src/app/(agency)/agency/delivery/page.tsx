import { getSession } from "@/lib/session";
import { db } from "@/lib/store";
import { redirect } from "next/navigation";

export default async function DeliveryPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  const steps = db().onboarding;
  return (
    <div className="grid gap-3">
      <h1 className="text-3xl font-semibold">Delivery board</h1>
      {steps.map((s) => (
        <article key={s.id} className="card flex justify-between p-4 text-sm">
          <span>{s.tenantId} · {s.title} · {s.owner}</span>
          <span>{s.done ? "done" : `overdue ${new Date(s.dueAt).toLocaleDateString("en-IN")}`}</span>
        </article>
      ))}
    </div>
  );
}
