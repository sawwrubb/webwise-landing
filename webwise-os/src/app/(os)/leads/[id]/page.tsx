import { notFound, redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { getLead } from "@/lib/store";
import { flagAction, outcomeAction, takeoverAction } from "@/lib/actions";
import Link from "next/link";

export default async function LeadDetail({ params }: { params: Promise<{ id: string }> }) {
  const user = await getSession();
  if (!user) redirect("/login");
  const { id } = await params;
  const row = getLead(user, id);
  if (!row) notFound();
  const { lead, messages, appointments, outcomes, conversations } = row;
  const conv = conversations[0];

  return (
    <div className="grid gap-4 lg:grid-cols-[1.2fr_.8fr]">
      <section className="card p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href="/leads" className="text-sm" style={{ color: "var(--muted)" }}>← Leads</Link>
            <h1 className="text-2xl font-semibold">{lead.name}</h1>
            <p className="text-sm" style={{ color: "var(--muted)" }}>{lead.phone} · {lead.channel} · {lead.source}</p>
          </div>
          <div className="text-right text-sm">Score {lead.score}<div style={{ color: "var(--muted)" }}>{lead.scoreReasons.join(" · ")}</div></div>
        </div>
        <div className="mt-4 grid gap-3">
          {messages.map((m) => (
            <div key={m.id} className="rounded-lg p-3" style={{ background: m.sentBy === "ai" ? "rgba(41,121,255,.12)" : "rgba(255,255,255,.04)" }}>
              <div className="flex justify-between text-xs" style={{ color: "var(--muted)" }}>
                <span>{m.sentBy} · {m.direction}{m.latencyMs ? ` · ${m.latencyMs}ms` : ""}</span>
                {m.sentBy === "ai" ? (
                  <form action={flagAction}>
                    <input type="hidden" name="messageId" value={m.id} />
                    <button className="btn btn-ghost btn-sm" type="submit">{m.flaggedWrong ? "Flagged" : "AI got this wrong"}</button>
                  </form>
                ) : null}
              </div>
              <p className="mt-1 text-sm">{m.body}</p>
            </div>
          ))}
        </div>
        {conv ? (
          <form action={takeoverAction} className="mt-4">
            <input type="hidden" name="conversationId" value={conv.id} />
            <input type="hidden" name="on" value={conv.humanTakeover ? "0" : "1"} />
            <button className="btn btn-primary" type="submit">{conv.humanTakeover ? "Hand back to AI" : "Take over now"}</button>
          </form>
        ) : null}
      </section>
      <aside className="grid gap-4">
        <section className="card p-4">
          <h2 className="font-semibold">Appointments</h2>
          {appointments.map((a) => (
            <p key={a.id} className="mt-2 text-sm">{new Date(a.slot).toLocaleString("en-IN")} · {a.status}</p>
          ))}
        </section>
        <section className="card p-4">
          <h2 className="font-semibold">Capture outcome</h2>
          <p className="text-sm" style={{ color: "var(--muted)" }}>Two taps. This feeds Leak Score and Revenue recovered.</p>
          <form action={outcomeAction} className="mt-3 grid gap-2">
            <input type="hidden" name="leadId" value={lead.id} />
            <select name="attendance" className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }}>
              <option value="showed">Showed</option>
              <option value="no_show">No-show</option>
            </select>
            <select name="result" className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }}>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
            <input name="valueInr" type="number" placeholder="Value INR" className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
            <input name="note" placeholder="Note (write rebook if recovered)" className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
            <button className="btn btn-primary" type="submit">Save outcome</button>
          </form>
          {outcomes.map((o) => (
            <p key={o.id} className="mt-2 text-sm">{o.result} · ₹{o.valueInr} · {o.note}</p>
          ))}
        </section>
      </aside>
    </div>
  );
}
