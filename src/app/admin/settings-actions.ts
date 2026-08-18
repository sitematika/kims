"use server";

import { revalidatePath } from "next/cache";
import { isAuthorized, destroySession } from "@/lib/auth";
import {
  getSettings,
  hashPassword,
  saveSettings,
  verifyPassword,
} from "@/lib/settings";

export async function updateSite(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "Сессия истекла, войдите заново";

  const siteUrl = String(formData.get("siteUrl") ?? "").trim();
  const indexing = formData.get("indexing") === "on";

  if (siteUrl && !/^https?:\/\/.+/.test(siteUrl)) {
    return "Адрес должен начинаться с http:// или https://";
  }

  await saveSettings({ siteUrl, indexing });
  revalidatePath("/", "layout");
  revalidatePath("/admin/settings");

  return indexing
    ? "Сохранено. Сайт открыт для поисковиков"
    : "Сохранено. Сайт закрыт от поисковиков";
}

export async function changePassword(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "Сессия истекла, войдите заново";

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const repeat = String(formData.get("repeat") ?? "");

  const settings = await getSettings();
  if (!(await verifyPassword(current, settings))) {
    return "Текущий пароль неверный";
  }
  if (next.length < 10) return "Новый пароль должен быть от 10 символов";
  if (next !== repeat) return "Пароли не совпадают";
  if (next === current) return "Новый пароль совпадает со старым";

  await saveSettings(await hashPassword(next));

  // ключ подписи сессии завязан на пароль, поэтому текущий вход больше
  // недействителен — выходим явно, чтобы не оставлять битую сессию
  await destroySession();
  return "Пароль изменён. Войдите заново";
}
