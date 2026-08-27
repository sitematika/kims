"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { ADMIN_LANG_COOKIE, adminLangs, type AdminLang } from "@/lib/admin-lang";
import { currentActor, isAuthorized, destroySession } from "@/lib/auth";
import { setUserPassword, verifyUser } from "@/lib/users";
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
  const gtmId = String(formData.get("gtmId") ?? "")
    .trim()
    .toUpperCase();
  const googleVerification = String(formData.get("googleVerification") ?? "")
    .trim()
    // из Search Console копируют весь тег — достаём content, если он есть
    .replace(/^[\s\S]*content=["']([^"']+)["'][\s\S]*$/, "$1")
    .trim();

  if (siteUrl && !/^https?:\/\/.+/.test(siteUrl)) {
    return "badUrl";
  }
  if (gtmId && !/^GTM-[A-Z0-9]{4,10}$/.test(gtmId)) {
    return "badGtm";
  }

  await saveSettings({ siteUrl, indexing, gtmId, googleVerification });
  revalidatePath("/", "layout");
  revalidatePath("/admin/seo");

  return indexing ? "indexingOn" : "indexingOff";
}

export async function updateRecoveryEmail(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const recoveryEmail = String(formData.get("recoveryEmail") ?? "").trim();
  if (recoveryEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(recoveryEmail)) {
    return "badEmail";
  }

  await saveSettings({ recoveryEmail });
  revalidatePath("/admin/access");
  return "saved";
}

export async function changePassword(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const repeat = String(formData.get("repeat") ?? "");

  const actor = await currentActor();

  if (actor && actor.email) {
    // у человека своя учётка — меняем пароль именно ей
    if (!(await verifyUser(actor.email, current)).ok) return "passwordWrong";
    if (next.length < 10) return "passwordShort";
    if (next !== repeat) return "passwordMismatch";
    if (next === current) return "passwordSame";

    await setUserPassword(actor.id, next);
    await destroySession();
    return "passwordChanged";
  }

  const settings = await getSettings();
  if (!(await verifyPassword(current, settings))) {
    return "passwordWrong";
  }
  if (next.length < 10) return "passwordShort";
  if (next !== repeat) return "passwordMismatch";
  if (next === current) return "passwordSame";

  await saveSettings({
    ...(await hashPassword(next)),
    // выданная ранее ссылка на сброс больше не должна работать
    resetHash: undefined,
    resetExpires: undefined,
  });

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
