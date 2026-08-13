"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { clearSession, getSession, requireSession, setSession } from "./session";
import * as store from "./store";
import type { SessionUser } from "./types";

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") || "").trim().toLowerCase();
  const password = String(formData.get("password") || "");
  const user = store.findUserByEmail(email);
  if (!user || user.password !== password) {
    redirect("/login?e=1");
  }
  const session: SessionUser = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    tenantId: user.tenantId,
    locationScope: user.locationScope,
    impersonating: false,
    impersonateWrite: false,
    demoMode: process.env.DEMO_MODE !== "false",
  };
  await setSession(session);
  if (user.role === "webwise_admin") redirect("/agency");
  redirect("/home");
}

export async function logoutAction() {
  await clearSession();
  redirect("/login");
}

export async function outcomeAction(formData: FormData) {
  const user = await requireSession();
  store.captureOutcome(
    user,
    String(formData.get("leadId")),
    String(formData.get("attendance")) as "showed" | "no_show",
    String(formData.get("result")) as "won" | "lost",
    Number(formData.get("valueInr") || 0),
    String(formData.get("note") || ""),
  );
  redirect(`/leads/${formData.get("leadId")}`);
}

export async function flagAction(formData: FormData) {
  const user = await requireSession();
  store.flagMessage(user, String(formData.get("messageId")));
  revalidatePath("/leads");
}

export async function takeoverAction(formData: FormData) {
  const user = await requireSession();
  store.takeover(user, String(formData.get("conversationId")), formData.get("on") === "1");
  revalidatePath("/whatsapp");
  revalidatePath("/leads");
}

export async function killAiAction(formData: FormData) {
  const user = await requireSession();
  store.killAi(user, formData.get("paused") === "1");
  revalidatePath("/ai");
}

export async function saveRuleAction(formData: FormData) {
  const user = await requireSession();
  store.saveRule(user, {
    id: String(formData.get("id") || "") || undefined,
    trigger: String(formData.get("trigger")),
    condition: String(formData.get("condition")),
    response: String(formData.get("response")),
    approvedBy: user.userId,
    active: formData.get("active") === "on",
  });
  revalidatePath("/ai");
}

export async function confirmApptAction(formData: FormData) {
  const user = await requireSession();
  store.confirmAppointment(user, String(formData.get("appointmentId")));
}

export async function approveReviewAction(formData: FormData) {
  const user = await requireSession();
  store.approveReview(user, String(formData.get("reviewId")));
}

export async function caseValueAction(formData: FormData) {
  const user = await requireSession();
  store.setCaseValue(user, Number(formData.get("value")));
}

export async function onboardingAction(formData: FormData) {
  const user = await requireSession();
  store.completeOnboardingStep(user, String(formData.get("stepId")));
  revalidatePath("/home");
}

export async function pageEditAction(formData: FormData) {
  const user = await requireSession();
  store.requestPageEdit(user, String(formData.get("assetId")));
}

export async function pageToggleAction(formData: FormData) {
  const user = await requireSession();
  store.togglePage(user, String(formData.get("assetId")));
}

export async function upsellAction(formData: FormData) {
  const user = await requireSession();
  store.raiseUpsellTask(user, String(formData.get("title")));
  revalidatePath("/home");
}

export async function replyAction(formData: FormData) {
  const user = await requireSession();
  store.sendHumanReply(user, String(formData.get("conversationId")), String(formData.get("body")));
  revalidatePath("/whatsapp");
}

export async function locationAction(formData: FormData) {
  const user = await requireSession();
  store.setLocationFilter(user, String(formData.get("locationId")));
  revalidatePath("/", "layout");
}

export async function impersonateAction(formData: FormData) {
  const user = await requireSession();
  const tenantId = String(formData.get("tenantId"));
  const write = formData.get("write") === "on";
  const reason = String(formData.get("reason") || "");
  const t = store.impersonateTarget(user, tenantId, write, reason);
  await setSession({
    ...user,
    tenantId: t.id,
    impersonating: true,
    impersonateWrite: write,
  });
  redirect("/home");
}

export async function stopImpersonateAction() {
  const user = await getSession();
  if (!user) redirect("/login");
  const admin = store.findUserByEmail(user.email);
  await setSession({
    ...user,
    tenantId: admin?.tenantId ?? null,
    role: admin?.role ?? user.role,
    impersonating: false,
    impersonateWrite: false,
  });
  redirect("/agency");
}

export async function provisionAction(formData: FormData) {
  const user = await requireSession();
  store.provisionTenant(user, String(formData.get("name")), String(formData.get("niche")));
  revalidatePath("/agency");
}
