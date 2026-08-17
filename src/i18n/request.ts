import { getRequestConfig } from "next-intl/server";
import { hasLocale } from "next-intl";
import { getContent } from "@/lib/content";
import { routing } from "./routing";

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  // Тексты берутся из content/ — того же хранилища, которое правит админка
  return { locale, messages: await getContent(locale) };
});
