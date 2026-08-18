/** Адрес сайта и режим индексации — задаются окружением на каждом домене */

export const siteUrl = (
  process.env.SITE_URL ?? "http://localhost:3003"
).replace(/\/$/, "");

/** SITE_NOINDEX=1 закрывает сайт от поисковиков (технический домен) */
export const isIndexable = process.env.SITE_NOINDEX !== "1";
