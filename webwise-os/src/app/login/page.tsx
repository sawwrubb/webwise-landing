import { loginAction } from "@/lib/actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ e?: string }>;
}) {
  const sp = await searchParams;
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <section className="hidden flex-col justify-between p-10 md:flex" style={{ background: "var(--navy)" }}>
        <div className="text-sm tracking-[0.2em]">WEBWISE OS</div>
        <div>
          <h1 className="text-5xl font-semibold leading-tight">Run the system that makes you money.</h1>
          <p className="mt-4 max-w-md" style={{ color: "var(--muted)" }}>
            See overnight enquiries, correct the AI, confirm the slot, mark yesterday converted, and read revenue recovered.
          </p>
        </div>
        <p className="text-sm" style={{ color: "var(--muted)" }}>Webwise Digital · India</p>
      </section>
      <section className="flex items-center justify-center p-6">
        <form action={loginAction} className="card w-full max-w-md p-6">
          <h2 className="text-2xl font-semibold">Sign in</h2>
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>Magic link in production. Demo uses password.</p>
          {sp.e ? <p className="mt-3 text-sm" style={{ color: "var(--danger)" }}>Those credentials are not recognised.</p> : null}
          <label className="mt-5 block text-xs" style={{ color: "var(--muted)" }}>Email</label>
          <input name="email" type="email" required className="mt-1 w-full rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
          <label className="mt-4 block text-xs" style={{ color: "var(--muted)" }}>Password</label>
          <input name="password" type="password" required className="mt-1 w-full rounded-lg border px-3 py-2" style={{ background: "transparent", borderColor: "var(--line)" }} />
          <button className="btn btn-primary mt-5 w-full" type="submit">Enter OS</button>
          <div className="mt-4 text-xs leading-6" style={{ color: "var(--muted)" }}>
            Demo password <b>demo123</b><br />
            meera@kapoordental.in — clinic owner<br />
            rahul@sharmatravels.in — activation<br />
            saurabh@webwisedigital.net — agency
          </div>
        </form>
      </section>
    </div>
  );
}
