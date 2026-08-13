import { getSession } from "@/lib/session";
import { niches } from "@/niches";
import { redirect } from "next/navigation";

export default async function RulesLibPage() {
  const user = await getSession();
  if (!user) redirect("/login");
  return (
    <div className="grid gap-4">
      <h1 className="text-3xl font-semibold">Rules library</h1>
      <p className="text-sm" style={{ color: "var(--muted)" }}>New niche = config file in src/niches. Never a code fork.</p>
      {niches.map((n) => (
        <article key={n.id} className="card p-4">
          <h2 className="font-semibold">{n.name}</h2>
          {n.rules.map((r) => (
            <p key={r.trigger} className="mt-2 text-sm">{r.trigger}: {r.response}</p>
          ))}
        </article>
      ))}
    </div>
  );
}
