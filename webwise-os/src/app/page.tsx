import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";

export default async function Root() {
  const s = await getSession();
  if (!s) redirect("/login");
  if (s.role === "webwise_admin" && !s.impersonating) redirect("/agency");
  redirect("/home");
}
