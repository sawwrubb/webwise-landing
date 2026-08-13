import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import type { SessionUser } from "./types";

const COOKIE = "ww_os_session";

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s) {
    if (process.env.DEMO_MODE === "false") {
      throw new Error("SESSION_SECRET is required");
    }
    return "demo-only-not-for-production";
  }
  return s;
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export async function setSession(user: SessionUser) {
  const payload = Buffer.from(JSON.stringify(user), "utf8").toString("base64url");
  const token = `${payload}.${sign(payload)}`;
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 12,
  });
}

export async function clearSession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSession(): Promise<SessionUser | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value;
  if (!raw) return null;
  const [payload, sig] = raw.split(".");
  if (!payload || !sig) return null;
  const expected = sign(payload);
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionUser;
  } catch {
    return null;
  }
}

export async function requireSession(): Promise<SessionUser> {
  const s = await getSession();
  if (!s) throw new Error("Unauthenticated");
  return s;
}
