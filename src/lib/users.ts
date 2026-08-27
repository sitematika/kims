import { mkdir, readFile, writeFile } from "node:fs/promises";
import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";
import path from "node:path";
import { contentDir } from "./paths";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: string,
  keylen: number,
) => Promise<Buffer>;

/**
 * Учётные записи панели.
 *
 * Лежат рядом с текстами, поэтому переживают редеплой. Пока ни одной записи
 * нет, работает прежний вход по одному общему паролю — так обновление кода
 * не запирает никого снаружи. Как только появилась первая учётка, общий
 * пароль перестаёт действовать.
 */

export type User = {
  id: string;
  email: string;
  name: string;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt?: string;
};

const file = path.join(contentDir, "users.json");

export async function getUsers(): Promise<User[]> {
  try {
    const raw = JSON.parse(await readFile(file, "utf8")) as { users?: User[] };
    return Array.isArray(raw.users) ? raw.users : [];
  } catch {
    return [];
  }
}

async function saveUsers(users: User[]) {
  await mkdir(contentDir, { recursive: true });
  await writeFile(file, `${JSON.stringify({ users }, null, 2)}\n`, "utf8");
}

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function hashSecret(password: string) {
  const passwordSalt = randomBytes(16).toString("hex");
  const key = await scrypt(password, passwordSalt, 64);
  return { passwordSalt, passwordHash: key.toString("hex") };
}

async function matches(password: string, user: User) {
  const key = await scrypt(password, user.passwordSalt, 64);
  const stored = Buffer.from(user.passwordHash, "hex");
  return key.length === stored.length && timingSafeEqual(key, stored);
}

export async function findByEmail(email: string) {
  const target = normalizeEmail(email);
  return (await getUsers()).find((u) => u.email === target) ?? null;
}

export async function findById(id: string) {
  return (await getUsers()).find((u) => u.id === id) ?? null;
}

export type SignInResult =
  | { ok: true; user: User }
  | { ok: false; reason: "wrongPassword" };

export async function verifyUser(
  email: string,
  password: string,
): Promise<SignInResult> {
  const user = await findByEmail(email);

  // сравниваем всегда, даже когда почты нет: иначе по времени ответа
  // можно перебрать существующие адреса
  const probe: User = user ?? {
    id: "",
    email: "",
    name: "",
    passwordSalt: "0".repeat(32),
    passwordHash: "0".repeat(128),
    createdAt: "",
  };
  const ok = await matches(password, probe);

  if (!user || !ok) return { ok: false, reason: "wrongPassword" };
  return { ok: true, user };
}

export type CreateResult = "ok" | "emailTaken" | "badEmail" | "passwordShort";

export async function createUser(input: {
  email: string;
  name: string;
  password: string;
}): Promise<CreateResult> {
  const email = normalizeEmail(input.email);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return "badEmail";
  if (input.password.length < 10) return "passwordShort";

  const users = await getUsers();
  if (users.some((u) => u.email === email)) return "emailTaken";

  users.push({
    id: randomBytes(9).toString("hex"),
    email,
    name: input.name.trim() || email,
    ...(await hashSecret(input.password)),
    createdAt: new Date().toISOString(),
  });

  await saveUsers(users);
  return "ok";
}

export async function removeUser(id: string) {
  const users = await getUsers();
  // последнюю учётку не отдаём удалить: иначе войти будет некому
  if (users.length < 2) return false;

  const rest = users.filter((u) => u.id !== id);
  if (rest.length === users.length) return false;

  await saveUsers(rest);
  return true;
}

export async function setUserPassword(id: string, password: string) {
  const users = await getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return false;

  Object.assign(user, await hashSecret(password));
  await saveUsers(users);
  return true;
}

export async function markLogin(id: string) {
  const users = await getUsers();
  const user = users.find((u) => u.id === id);
  if (!user) return;

  user.lastLoginAt = new Date().toISOString();
  await saveUsers(users);
}
