import type { MetadataRoute } from "next";
import { locales, localeHtmlLang } from "@/i18n/routing";
import { getSiteUrl } from "@/lib/site";

// Адрес сайта берётся из окружения на каждом запросе, а не из сборки
export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = await getSiteUrl();

  return locales.map((locale) => ({
    url: `${siteUrl}/${locale}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: locale === "uk" ? 1 : 0.8,
    alternates: {
      languages: {
        ...Object.fromEntries(
          locales.map((l) => [localeHtmlLang[l], `${siteUrl}/${l}`]),
        ),
        // куда вести тех, чей язык мы не поддерживаем
        "x-default": `${siteUrl}/uk`,
      },
    },
  }));
}
