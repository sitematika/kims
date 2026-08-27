import createMiddleware from "next-intl/middleware";
import { NextRequest } from "next/server";
import { routing } from "./i18n/routing";

const intl = createMiddleware(routing);

/**
 * Боты предпросмотра ссылок присылают язык того, кто ссылку отправил, —
 * из-за этого в мессенджер прилетала английская карточка, хотя основная
 * версия сайта украинская. Живым посетителям язык подбираем как раньше,
 * а роботам всегда отдаём версию по умолчанию: карточка ссылки не должна
 * зависеть от настроек случайного человека.
 */
const crawlers =
  /bot|crawl|spider|preview|embed|facebookexternalhit|telegram|whatsapp|viber|slack|discord|twitter|linkedin|skype|vkshare|pinterest/i;

export default function proxy(request: NextRequest) {
  const agent = request.headers.get("user-agent") ?? "";

  if (crawlers.test(agent) && request.headers.has("accept-language")) {
    const headers = new Headers(request.headers);
    headers.delete("accept-language");
    return intl(new NextRequest(request, { headers }));
  }

  return intl(request);
}

export const config = {
  // Всё, кроме api, статики Next, админки и файлов с расширением.
  matcher: "/((?!api|admin|_next|_vercel|.*\\..*).*)",
};
