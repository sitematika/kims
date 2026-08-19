import { getSettings } from "./settings";

// боевой адрес по умолчанию: карта сайта и canonical корректны сразу
// после деплоя, без настройки. Переопределяется в админке и через SITE_URL
const productionUrl = "https://kims-franchise.com";

const fallbackUrl =
  process.env.SITE_URL ??
  (process.env.NODE_ENV === "production"
    ? productionUrl
    : "http://localhost:3003");

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
