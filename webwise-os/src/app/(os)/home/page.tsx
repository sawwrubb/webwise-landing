import Link from "next/link";
import { getSession } from "@/lib/session";
import { commandMetrics, listActions, listOnboarding, tenantOf, upsellAllowed } from "@/lib/store";
import { rangeLabel } from "@/lib/date-range";
import { inr } from "@/lib/revenue";
import { LEAK_SCORE_DEFINITION } from "@/lib/leak-score";
import { Delta } from "@/components/states";
import {
  caseValueAction,
  confirmApptAction,
  onboardingAction,
  upsellAction,
} from "@/lib/actions";
import { redirect } from "next/navigation";
import type { DateRangeKey } from "@/lib/types";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ range?: string }>;
}) {
  const user = await getSession();
  if (!user?.tenantId) redirect("/login");
  const sp = await searchParams;
  const range = (["7d", "30d", "90d"].includes(sp.range || "") ? sp.range : "30d") as DateRangeKey;
  const m = commandMetrics(user, range);
  const tenant = tenantOf(user.tenantId)!;
  const actions = listActions(user);
  const steps = listOnboarding(user);
  const showUpsell = upsellAllowed(user) && m.missedUnanswered >= 20;

  return (
    <div className="grid gap-4">
      {tenant.status === "activation" ? (
        <section className="card p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Activation — system not live yet</h2>
              <p className="text-sm" style={{ color: "var(--muted)" }}>Sample data is watermarked until these steps are done.</p>
            </div>
            <div className="text-sm">{steps.filter((s) => s.done).length}/{steps.length}</div>
          </div>
          <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: "var(--line)" }}>
            <div className="h-full" style={{ width: `${(steps.filter((s) => s.done).length / Math.max(steps.length, 1)) * 100}%`, background: "var(--blue)" }} />
          </div>
          <ul className="mt-3 grid gap-2">
            {steps.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-2 text-sm">
                <span>{s.title} · {s.owner} · due {new Date(s.dueAt).toLocaleDateString("en-IN")}</span>
                {s.done ? <span style={{ color: "var(--teal)" }}>Done</span> : (
                  <form action={onboardingAction}>
                    <input type="hidden" name="stepId" value={s.id} />
                    <button className="btn btn-primary btn-sm" type="submit">Mark done</button>
                  </form>
                )}
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="card p-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Action queue</h2>
          <span className="text-sm" style={{ color: "var(--muted)" }}>{actions.length} need you</span>
        </div>
        {actions.length === 0 ? (
          <p className="mt-2 text-sm" style={{ color: "var(--muted)" }}>Nothing waiting. Overnight capture is clean.</p>
        ) : (
          <ul className="mt-3 grid gap-2">
            {actions.map((a) => (
              <li key={a.id} className="flex items-center justify-between gap-3 border-b py-2" style={{ borderColor: "var(--line)" }}>
                <Link href={a.href} className="text-sm">{a.title}</Link>
                {a.title.includes("Ananya") ? (
                  <form action={confirmApptAction}>
                    <input type="hidden" name="appointmentId" value="ap_ananya" />
                    <button className="btn btn-primary btn-sm" type="submit">Confirm slot</button>
                  </form>
                ) : (
                  <Link href={a.href} className="btn btn-ghost btn-sm">Open</Link>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Command Center</h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>{rangeLabel(range)}</p>
        </div>
        <div className="flex gap-2">
          {(["7d", "30d", "90d"] as const).map((k) => (
            <Link key={k} href={`/home?range=${k}`} className={`btn btn-sm ${k === range ? "btn-primary" : "btn-ghost"}`}>{k}</Link>
          ))}
        </div>
      </div>

      {m.revenue.needsCaseValue ? (
        <form action={caseValueAction} className="card flex flex-wrap items-end gap-3 p-4">
          <div>
            <h3 className="font-semibold">Set average case value</h3>
            <p className="text-sm" style={{ color: "var(--muted)" }}>Revenue recovered cannot calculate until this is set.</p>
          </div>
          <input name="value" type="number" min={1} required className="rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
          <button className="btn btn-primary" type="submit">Save INR</button>
        </form>
      ) : (
        <Link href="/leads?stage=showed" className="card p-5 block">
          <div className="text-sm" style={{ color: "var(--muted)" }}>Revenue recovered</div>
          <div className="mt-1 text-4xl font-semibold">{inr(m.revenue.amount || 0)}</div>
          <p className="mt-2 text-sm" style={{ color: "var(--teal)" }}>The number to repeat this month. (showed + recovered no-shows) × avg case value.</p>
        </Link>
      )}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Link href="/leads" className="card p-4">
          <div className="text-sm" style={{ color: "var(--muted)" }}>Leads captured</div>
          <div className="text-3xl font-semibold">{m.leads.current}</div>
          <Delta current={m.leads.current} prior={m.leads.prior} />
        </Link>
        <Link href="/whatsapp" className="card p-4">
          <div className="text-sm" style={{ color: "var(--muted)" }}>Median AI reply</div>
          <div className="text-3xl font-semibold">{(m.replyMs.current / 1000).toFixed(1)}s</div>
          <Delta current={m.replyMs.prior} prior={m.replyMs.current} />
        </Link>
        <Link href="/leads?stage=booked" className="card p-4">
          <div className="text-sm" style={{ color: "var(--muted)" }}>Appointments booked</div>
          <div className="text-3xl font-semibold">{m.appointments.current}</div>
          <Delta current={m.appointments.current} prior={m.appointments.prior} />
        </Link>
        <Link href="/leads?stage=showed" className="card p-4">
          <div className="text-sm" style={{ color: "var(--muted)" }}>Leak Score</div>
          <div className="text-3xl font-semibold">{m.leak}</div>
          <span className="text-xs" title={LEAK_SCORE_DEFINITION} style={{ color: "var(--muted)" }}>What this is</span>
        </Link>
      </div>

      <section className="card p-4">
        <h2 className="font-semibold">Leak Score breakdown</h2>
        <p className="text-sm" style={{ color: "var(--muted)" }}>{LEAK_SCORE_DEFINITION}</p>
        <ul className="mt-3 grid gap-3">
          {m.leakComponents.map((c) => (
            <li key={c.id} className="grid gap-1 sm:grid-cols-[1fr_auto] sm:items-center">
              <div>
                <div className="flex justify-between text-sm">
                  <span>{c.label} · weight {c.weight}</span>
                  <span>now {c.current} / target {c.target}</span>
                </div>
                <div className="mt-1 h-1.5 rounded-full" style={{ background: "var(--line)" }}>
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (c.current / c.target) * 100)}%`, background: "var(--blue)" }} />
                </div>
              </div>
              <Link href={c.actionHref} className="btn btn-primary btn-sm">{c.actionLabel}</Link>
            </li>
          ))}
        </ul>
      </section>

      {showUpsell ? (
        <form action={upsellAction} className="card p-4">
          <input type="hidden" name="title" value={`${m.missedUnanswered} calls went unanswered last month. Voice AI answers them.`} />
          <p className="font-semibold">{m.missedUnanswered} calls went unanswered last month. Voice AI answers them.</p>
          <p className="text-sm" style={{ color: "var(--muted)" }}>₹12,000 / month · Talk to Webwise raises a task. Card data never collected here.</p>
          <button className="btn btn-primary mt-3" type="submit">Talk to Webwise</button>
        </form>
      ) : null}

      <section className="card p-4">
        <h2 className="font-semibold">Overnight activity</h2>
        <Link href="/leads/ld_ananya" className="mt-2 block text-sm">11:47 PM · Ananya · implant consult · AI replied in 4.2s</Link>
        <Link href="/leads/ld_rohit" className="mt-2 block text-sm">12:11 AM · Rohit · whitening price · needs takeover</Link>
        <Link href="/leads/ld_yesterday" className="mt-2 block text-sm">Yesterday · Sana showed · capture outcome</Link>
      </section>
    </div>
  );
}
