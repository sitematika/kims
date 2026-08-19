"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_LANG_COOKIE, adminLangs, type AdminLang } from "@/lib/admin-lang";
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
  if (!(await isAuthorized())) return "sessionExpired";

  const siteUrl = String(formData.get("siteUrl") ?? "").trim();
  const indexing = formData.get("indexing") === "on";

  if (siteUrl && !/^https?:\/\/.+/.test(siteUrl)) {
    return "badUrl";
  }

  await saveSettings({ siteUrl, indexing });
  revalidatePath("/", "layout");
  revalidatePath("/admin/seo");

  return indexing ? "indexingOn" : "indexingOff";
}

export async function changePassword(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const repeat = String(formData.get("repeat") ?? "");

  const settings = await getSettings();
  if (!(await verifyPassword(current, settings))) {
    return "passwordWrong";
  }
  if (next.length < 10) return "passwordShort";
  if (next !== repeat) return "passwordMismatch";
  if (next === current) return "passwordSame";

  await saveSettings(await hashPassword(next));

  // ключ подписи сессии завязан на пароль, поэтому текущий вход больше
  // недействителен — выходим явно, чтобы не оставлять битую сессию
  await destroySession();
  return "passwordChanged";
}

export async function setAdminLang(formData: FormData) {
  const lang = String(formData.get("lang") ?? "");
  if (!adminLangs.includes(lang as AdminLang)) return;

  const store = await cookies();
  store.set(ADMIN_LANG_COOKIE, lang, {
    path: "/admin",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });

  revalidatePath("/admin", "layout");
}

/** Добавить адрес, на который приходят заявки */
export async function addLeadEmail(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  if (!/^[^@\s]+@[^@\s.]+\.[^@\s]+$/.test(email)) return "badEmail";

  const { leadEmails = [] } = await getSettings();
  if (leadEmails.includes(email)) return "emailExists";

  await saveSettings({ leadEmails: [...leadEmails, email] });
  revalidatePath("/admin/leads");
  return "saved";
}

export async function removeLeadEmail(formData: FormData) {
  if (!(await isAuthorized())) return;

  const email = String(formData.get("email") ?? "");
  const { leadEmails = [] } = await getSettings();

  await saveSettings({ leadEmails: leadEmails.filter((e) => e !== email) });
  revalidatePath("/admin/leads");
}
