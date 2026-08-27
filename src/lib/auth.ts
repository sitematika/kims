import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { getSettings, verifyPassword } from "./settings";
import { findById, getUsers, markLogin, verifyUser, type User } from "./users";

const COOKIE = "kims_admin";
const MAX_AGE = 60 * 60 * 12; // 12 часов
const LEGACY = "legacy";

/**
 * Вход в панель.
 *
 * Пока учётных записей нет, работает прежний общий пароль — обновление кода
 * не должно запирать никого снаружи. Как только заведена первая учётка,
 * общий пароль перестаёт действовать и вход идёт по почте.
 *
 * Ключ подписи сессии включает хеш пароля владельца записи: сменил пароль —
 * его открытые сессии отваливаются, чужие продолжают работать.
 */

export type Actor = { id: string; name: string; email: string };

export async function usersConfigured() {
  return (await getUsers()).length > 0;
}

async function secretFor(userId: string) {
  if (userId === LEGACY) {
    const settings = await getSettings();
    const base =
      settings.passwordHash ??
      process.env.ADMIN_SECRET ??
      process.env.ADMIN_PASSWORD;
    if (!base) throw new Error("Пароль администратора не задан");
    return base;
  }

  const user = await findById(userId);
  if (!user) throw new Error("Учётная запись не найдена");
  return user.passwordHash;
}

async function sign(userId: string, expiresAt: number) {
  return createHmac("sha256", await secretFor(userId))
    .update(`${userId}.${expiresAt}`)
    .digest("hex");
}

function safeEqual(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Проверка общего пароля — только пока учётных записей нет */
export async function checkPassword(input: string) {
  if (await usersConfigured()) return false;
  return verifyPassword(input, await getSettings());
}

export async function checkUser(email: string, password: string) {
  const result = await verifyUser(email, password);
  return result.ok ? result.user : null;
}

async function issue(userId: string) {
  const expiresAt = Date.now() + MAX_AGE * 1000;
  const store = await cookies();
  store.set(COOKIE, `${userId}.${expiresAt}.${await sign(userId, expiresAt)}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/admin",
    maxAge: MAX_AGE,
  });
}

/** Сессия по общему паролю, пока учёток нет */
export async function createSession() {
  await issue(LEGACY);
}

export async function createUserSession(user: User) {
  await issue(user.id);
  await markLogin(user.id);
}

export async function destroySession() {
  const store = await cookies();
  store.delete({ name: COOKIE, path: "/admin" });
}

async function readSession() {
  const raw = (await cookies()).get(COOKIE)?.value;
  if (!raw) return null;

  const [userId, expiresAt, signature] = raw.split(".");
  if (!userId || !expiresAt || !signature) return null;
  if (Number(expiresAt) < Date.now()) return null;

  try {
    if (!safeEqual(signature, await sign(userId, Number(expiresAt)))) {
      return null;
    }
  } catch {
    return null;
  }

  return { userId };
}

export async function isAuthorized() {
  const session = await readSession();
  if (!session) return false;

  // общая сессия действует, только пока учёток нет: завели первую —
  // прежние входы по общему паролю закрываются
  if (session.userId === LEGACY) return !(await usersConfigured());
  return Boolean(await findById(session.userId));
}

/** Кто сейчас работает в панели — для истории правок и шапки */
export async function currentActor(): Promise<Actor | null> {
  const session = await readSession();
  if (!session) return null;

  if (session.userId === LEGACY) {
    if (await usersConfigured()) return null;
    return { id: LEGACY, name: "Спільний доступ", email: "" };
  }

  const user = await findById(session.userId);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email };
}
