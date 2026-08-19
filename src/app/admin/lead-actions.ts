"use server";

import { isAuthorized } from "@/lib/auth";
import { notify } from "@/lib/notify";

const names: Record<string, string> = {
  telegram: "Telegram",
  email: "Почта",
};

/** Отправляет тестовую заявку по всем настроенным каналам */
export async function sendTestLead(): Promise<string | null> {
  if (!(await isAuthorized())) return "Сессия истекла, войдите заново";

  const results = await notify({
    name: "Тестова заявка з адмінки",
    phone: "+380000000000",
    city: "Перевірка каналів",
    locale: "uk",
    createdAt: new Date().toISOString(),
  });

  const lines = results
    .filter((result) => result.status !== "skipped")
    .map((result) =>
      result.status === "ok"
        ? `${names[result.channel]}: отправлено`
        : `${names[result.channel]}: ошибка — ${result.detail}`,
    );

  return lines.length ? lines.join(" · ") : "Ни один канал не настроен";
}
