import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { getSettings, hashPassword, saveSettings } from "./settings";
import { leadRecipients, sendMail } from "./notify";
import { getSiteUrl } from "./site";

/**
 * Восстановление доступа к админке.
 *
 * Ссылка одноразовая и живёт полчаса. На сервере лежит только её хеш —
 * из файла настроек рабочую ссылку не восстановить. Адрес получателя задан
 * заранее в настройках, поэтому вводить его на публичной странице не нужно:
 * подобрать чужую почту и запросить письмо себе нельзя.
 */

const TTL = 30 * 60 * 1000;
const COOLDOWN = 60 * 1000;

function digest(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

function equal(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  return bufA.length === bufB.length && timingSafeEqual(bufA, bufB);
}

/** Кому уходит ссылка: заданный адрес, иначе получатели заявок */
export async function recoveryRecipients(): Promise<string[]> {
  const { recoveryEmail } = await getSettings();
  if (recoveryEmail) return [recoveryEmail];
  return leadRecipients();
}

/** «egorova@kims.com.ua» → «e******a@kims.com.ua» */
export function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  if (name.length <= 2) return `${name[0]}*@${domain}`;
  return `${name[0]}${"*".repeat(name.length - 2)}${name.at(-1)}@${domain}`;
}

export type ResetRequest =
  | { ok: true; sentTo: string[] }
  | { ok: false; reason: "noRecipients" | "tooOften" | "mailFailed" };

export async function requestReset(): Promise<ResetRequest> {
  const settings = await getSettings();
  const to = await recoveryRecipients();
  if (!to.length) return { ok: false, reason: "noRecipients" };

  const since = Date.now() - (settings.resetRequestedAt ?? 0);
  if (since < COOLDOWN) return { ok: false, reason: "tooOften" };

  const token = randomBytes(32).toString("hex");
  const siteUrl = await getSiteUrl();
  const link = `${siteUrl}/admin/reset?token=${token}`;

  try {
    const sent = await sendMail({
      to,
      subject: "KIMS — відновлення доступу до панелі",
      text: [
        "Хтось запросив зміну пароля до панелі керування сайтом KIMS.",
        "",
        "Посилання дійсне 30 хвилин і спрацює один раз:",
        link,
        "",
        "Якщо запит не від вас — просто видаліть цей лист.",
        "Поки посиланням не скористалися, старий пароль продовжує діяти.",
      ].join("\n"),
    });
    if (!sent) return { ok: false, reason: "noRecipients" };
  } catch (error) {
    console.error("[reset] письмо не ушло:", error);
    return { ok: false, reason: "mailFailed" };
  }

  await saveSettings({
    resetHash: digest(token),
    resetExpires: Date.now() + TTL,
    resetRequestedAt: Date.now(),
  });

  return { ok: true, sentTo: to };
}

export async function isResetTokenValid(token: string) {
  if (!token) return false;
  const { resetHash, resetExpires } = await getSettings();
  if (!resetHash || !resetExpires) return false;
  if (resetExpires < Date.now()) return false;
  return equal(digest(token), resetHash);
}

export type ResetResult = "ok" | "badToken" | "passwordShort" | "passwordMismatch";

export async function completeReset(
  token: string,
  password: string,
  repeat: string,
): Promise<ResetResult> {
  if (!(await isResetTokenValid(token))) return "badToken";
  if (password.length < 10) return "passwordShort";
  if (password !== repeat) return "passwordMismatch";

  // ссылка гасится вместе с паролем: второй раз ею не воспользоваться
  await saveSettings({
    ...(await hashPassword(password)),
    resetHash: undefined,
    resetExpires: undefined,
  });

  return "ok";
}

/** Погасить ссылку — например, когда пароль сменили обычным способом */
export async function clearReset() {
  await saveSettings({ resetHash: undefined, resetExpires: undefined });
}
