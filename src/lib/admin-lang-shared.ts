/**
 * Константы языка панели без серверных зависимостей.
 *
 * Лежат отдельно от словаря: тот читает cookie через next/headers и в
 * клиентские компоненты не импортируется, а переключателю нужны только
 * имя метки и список языков.
 */

export const ADMIN_LANG_COOKIE = "kims_admin_lang";

export const adminLangs = ["uk", "ru"] as const;
export type AdminLang = (typeof adminLangs)[number];

export const adminLangLabels: Record<AdminLang, string> = {
  uk: "UA",
  ru: "RU",
};
