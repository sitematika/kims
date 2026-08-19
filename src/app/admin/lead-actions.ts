"use server";

import { isAuthorized } from "@/lib/auth";
import { notify } from "@/lib/notify";
import { getAdminDict } from "@/lib/admin-lang";

/** Отправляет тестовую заявку по всем настроенным каналам */
export async function sendTestLead(): Promise<string | null> {
  const dict = await getAdminDict();
  if (!(await isAuthorized())) return dict.msg.sessionExpired;

  const results = await notify({
    name: "Тестова заявка з панелі",
    phone: "+380000000000",
    city: "Перевірка каналів",
    locale: "uk",
    createdAt: new Date().toISOString(),
  });

  const lines = results
    .filter((result) => result.status !== "skipped")
    .map((result) =>
      result.status === "ok"
        ? `${result.channel === "telegram" ? dict.leads.telegram : dict.leads.email} ${dict.msg.sent}`
        : `${result.channel === "telegram" ? dict.leads.telegram : dict.leads.email} ${dict.msg.error} — ${result.detail}`,
    );

  return lines.length ? lines.join(" · ") : dict.msg.noChannels;
}
