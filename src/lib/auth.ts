import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "kims_admin";
const MAX_AGE = 60 * 60 * 12; // 12 часов

function secret() {
  const value = process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!value) throw new Error("ADMIN_PASSWORD не задан в окружении");
  return value;
}

function sign(expiresAt: number) {
  return createHmac("sha256", secret()).update(String(expiresAt)).digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

export function checkPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return safeEqual(input, expected);
}

export async function createSession() {
  const expiresAt = Date.now() + MAX_AGE * 1000;
  const store = await cookies();
  store.set(COOKIE, `${expiresAt}.${sign(expiresAt)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete({ name: COOKIE, path: "/admin" });
}

export async function isAuthorized() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return false;

  const [expiresAt, signature] = raw.split(".");
  if (!expiresAt || !signature) return false;
  if (Number(expiresAt) < Date.now()) return false;

  try {
    return safeEqual(signature, sign(Number(expiresAt)));
  } catch {
    return false;
  }
}
