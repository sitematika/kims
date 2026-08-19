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
import { snapshot } from "@/lib/history";

export async function login(_state: string | null, formData: FormData) {
  const password = String(formData.get("password") ?? "");
  if (!(await checkPassword(password))) return "wrongPassword";

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
  if (!(await isAuthorized())) return "sessionExpired";

  const section = String(formData.get("__section") ?? "");
  if (!section) return "noSection";

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

  await snapshot(`Тексты: ${section}`);

  for (const [locale, fields] of updates) {
    const content = await getContent(locale);
    for (const [path, value] of fields) writePath(content, path, value);
    await saveContent(locale, content);
  }

  revalidatePath("/", "layout");
  return "saved";
}
