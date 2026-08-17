import { defineRouting } from "next-intl/routing";

export const locales = ["uk", "en", "es", "ru"] as const;
export type Locale = (typeof locales)[number];

/** Ярлыки для переключателя языка в шапке. */
export const localeLabels: Record<Locale, string> = {
  uk: "UA",
  en: "EN",
  es: "ES",
  ru: "RU",
};

/** Значения для атрибута lang и hreflang. */
export const localeHtmlLang: Record<Locale, string> = {
  uk: "uk-UA",
  en: "en",
  es: "es",
  ru: "ru",
};

export const routing = defineRouting({
  locales,
  defaultLocale: "uk",
  localePrefix: "always",
});
