import { getSettings } from "./settings";

const fallbackUrl = process.env.SITE_URL ?? "http://localhost:3003";

/** Адрес сайта: сначала то, что задано в админке, затем окружение */
export async function getSiteUrl() {
  const { siteUrl } = await getSettings();
  return (siteUrl || fallbackUrl).replace(/\/$/, "");
}

/**
 * Открыт ли сайт поисковикам. SITE_NOINDEX=1 в окружении закрывает его
 * принудительно — это режим технического домена, переключателем в админке
 * его не открыть.
 */
export async function getIndexable() {
  if (process.env.SITE_NOINDEX === "1") return false;
  const { indexing } = await getSettings();
  return indexing;
}
