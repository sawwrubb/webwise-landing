import type { Role, SessionUser } from "./types";

const matrix: Record<Role, string[]> = {
  owner: ["read", "write", "billing", "export", "team", "ai_approve", "kill_ai"],
  manager: ["read", "write", "export", "ai_approve"],
  staff: ["read", "write_own"],
  webwise_admin: ["read", "write", "billing", "export", "team", "ai_approve", "kill_ai", "impersonate", "provision"],
};

export function can(user: SessionUser, perm: string): boolean {
  if (user.impersonating && !user.impersonateWrite) {
    return perm === "read";
  }
  return matrix[user.role]?.includes(perm) ?? false;
}

export function assertCan(user: SessionUser, perm: string): void {
  if (!can(user, perm)) {
    throw new Error("Forbidden");
  }
}

export function assertTenant(user: SessionUser, tenantId: string): void {
  if (user.role === "webwise_admin" && !user.impersonating) return;
  if (user.tenantId !== tenantId) throw new Error("Forbidden tenant");
}
