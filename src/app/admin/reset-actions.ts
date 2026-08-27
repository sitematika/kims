"use server";

import { redirect } from "next/navigation";
import { destroySession } from "@/lib/auth";
import { completeReset, requestReset } from "@/lib/password-reset";

export async function askReset(): Promise<string> {
  const result = await requestReset();
  if (result.ok) return "resetSent";
  return {
    noRecipients: "resetNoRecipients",
    tooOften: "resetTooOften",
    mailFailed: "resetMailFailed",
  }[result.reason];
}

export async function setNewPassword(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const repeat = String(formData.get("repeat") ?? "");

  const result = await completeReset(token, password, repeat);
  if (result !== "ok") return result === "badToken" ? "resetBadToken" : result;

  // на всякий случай гасим сессию: дальше вход только с новым паролем
  await destroySession();
  // ссылка уже погашена, поэтому оставаться на этой странице некорректно —
  // она показала бы «ссылка устарела» вместо подтверждения
  redirect("/admin/login?changed=1");
}
