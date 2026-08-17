"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { locales, type Locale } from "@/i18n/routing";
import {
  checkPassword,
  createSession,
  destroySession,
  isAuthorized,
} from "@/lib/auth";
import { getContent, saveContent, writePath } from "@/lib/content";

export async function login(_state: string | null, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!checkPassword(password)) return "Неверный пароль";

  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

export async function saveSection(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "Сессия истекла, войдите заново";

  const section = String(formData.get("__section") ?? "");
  if (!section) return "Не указан раздел";

  // Поля приходят как "<locale>::<путь.в.json>"
  const updates = new Map<Locale, [string, string][]>();
  for (const [name, value] of formData.entries()) {
    if (name.startsWith("__") || typeof value !== "string") continue;
    const [locale, path] = name.split("::");
    if (!locales.includes(locale as Locale) || !path) continue;
    const list = updates.get(locale as Locale) ?? [];
    list.push([path, value]);
    updates.set(locale as Locale, list);
  }

  for (const [locale, fields] of updates) {
    const content = await getContent(locale);
    for (const [path, value] of fields) writePath(content, path, value);
    await saveContent(locale, content);
  }

  revalidatePath("/", "layout");
  return "Сохранено";
}
