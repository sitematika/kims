import type { MetadataRoute } from "next";
import { getIndexable, getSiteUrl } from "@/lib/site";

// Читаем окружение на каждом запросе: технический и основной домены
// собираются из одного репозитория и различаются только переменными
export const dynamic = "force-dynamic";

export default async function robots(): Promise<MetadataRoute.Robots> {
  // На техническом домене ставим SITE_NOINDEX=1 — иначе он попадёт в поиск
  // и будет конкурировать с основным сайтом
  const [indexable, siteUrl] = await Promise.all([getIndexable(), getSiteUrl()]);

  if (!indexable) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/api"] },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
