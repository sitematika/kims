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
 * Настройки сайта, которыми управляет админка: адрес, индексация, пароль.
 *
 * Лежат рядом с текстами, поэтому переживают редеплой и не требуют правки
 * переменных на хостинге.
 */

export type Settings = {
  /** Адрес сайта для canonical, og:url и карты сайта */
  siteUrl: string;
  /** Открыт ли сайт поисковикам */
  indexing: boolean;
  /** Пароль администратора: соль и хеш. Пусто — используется ADMIN_PASSWORD */
  passwordSalt?: string;
  passwordHash?: string;
  /** Кому приходят заявки. Пусто — берётся LEADS_EMAIL_TO из окружения */
  leadEmails?: string[];
  /** Контейнер Google Tag Manager, вид GTM-XXXXXXX. Пусто — счётчиков нет */
  gtmId?: string;
  /** Код подтверждения прав в Search Console (метод «HTML-тег») */
  googleVerification?: string;
  /** Куда слать ссылку на сброс пароля. Пусто — на адреса для заявок */
  recoveryEmail?: string;
  /** Хеш одноразовой ссылки сброса, срок её жизни и время последнего запроса */
  resetHash?: string;
  resetExpires?: number;
  resetRequestedAt?: number;
};

const file = path.join(contentDir, "settings.json");

const defaults: Settings = {
  siteUrl: "",
  leadEmails: [],
  gtmId: "",
  googleVerification: "",
  // по умолчанию закрыто: свежий сайт не должен попасть в поиск раньше времени
  indexing: false,
};

export async function getSettings(): Promise<Settings> {
  try {
    const raw = JSON.parse(await readFile(file, "utf8")) as Partial<Settings>;
    return { ...defaults, ...raw };
  } catch {
    return { ...defaults };
  }
}

export async function saveSettings(next: Partial<Settings>) {
  const current = await getSettings();
  await mkdir(contentDir, { recursive: true });
  await writeFile(
    file,
    `${JSON.stringify({ ...current, ...next }, null, 2)}\n`,
    "utf8",
  );
}

export async function hashPassword(password: string) {
  const passwordSalt = randomBytes(16).toString("hex");
  const key = await scrypt(password, passwordSalt, 64);
  return { passwordSalt, passwordHash: key.toString("hex") };
}

export async function verifyPassword(password: string, settings: Settings) {
  // пока свой пароль не задан, работает тот, что задан в окружении
  if (!settings.passwordHash || !settings.passwordSalt) {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected) return false;
    const a = Buffer.from(password);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  }

  const key = await scrypt(password, settings.passwordSalt, 64);
  const stored = Buffer.from(settings.passwordHash, "hex");
  return key.length === stored.length && timingSafeEqual(key, stored);
}
