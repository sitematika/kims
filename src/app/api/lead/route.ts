import { appendLead } from "@/lib/leads";
import { notify } from "@/lib/notify";

export const runtime = "nodejs";

type Lead = {
  name: string;
  phone: string;
  city: string;
  locale: string;
  /** Поле-приманка: человек его не видит, бот заполняет */
  website?: string;
};

/** Длиннее живых значений, но коротко настолько, чтобы не залить письмо */
const limits = { name: 80, phone: 24, city: 80 };

function isValid(body: Partial<Lead>): body is Lead {
  return (
    typeof body.name === "string" &&
    body.name.trim().length >= 2 &&
    body.name.length <= limits.name &&
    typeof body.phone === "string" &&
    body.phone.length <= limits.phone &&
    body.phone.replace(/\D/g, "").length >= 9 &&
    typeof body.city === "string" &&
    body.city.trim().length >= 2 &&
    body.city.length <= limits.city
  );
}

/**
 * Простое ограничение частоты по адресу.
 *
 * Память процесса, а не база: цель — остановить наивный поток, а не
 * выстроить защиту от распределённой атаки. Переживает до перезапуска,
 * этого достаточно.
 */
const recent = new Map<string, number[]>();
const WINDOW = 10 * 60 * 1000;
const MAX = 5;

function tooOften(ip: string) {
  const now = Date.now();
  const hits = (recent.get(ip) ?? []).filter((t) => now - t < WINDOW);
  hits.push(now);
  recent.set(ip, hits);

  // не даём карте расти бесконечно
  if (recent.size > 5000) recent.clear();

  return hits.length > MAX;
}

export async function POST(request: Request) {
  let body: Partial<Lead>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "bad_json" }, { status: 400 });
  }

  if (!isValid(body)) {
    return Response.json({ error: "validation" }, { status: 422 });
  }

  // приманку заполняют только боты — отвечаем как при успехе,
  // чтобы не подсказывать, что заявка не ушла
  if (body.website) {
    console.info("[lead] отброшено по приманке");
    return Response.json({ ok: true });
  }

  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (tooOften(ip)) {
    console.warn("[lead] слишком часто с адреса", ip);
    return Response.json({ error: "too_often" }, { status: 429 });
  }

  const lead = {
    name: body.name.trim(),
    phone: body.phone.trim(),
    city: body.city.trim(),
    locale: body.locale ?? "uk",
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? "",
  };

  console.info("[lead]", lead);

  // Заявка уходит в Telegram и на почту; ошибка канала не влияет на ответ
  // посетителю — он в любом случае видит экран благодарности

  await notify(lead);

  const webhook = process.env.LEADS_WEBHOOK_URL;
  if (webhook) {
    try {
      await fetch(webhook, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(lead),
      });
    } catch (error) {
      console.error("[lead] webhook failed", error);
    }
  }

  // Журнал заявок ведём всегда: на него смотрит админка, из него делается
  // выгрузка, и политика обещает посетителю, что данные хранятся и удаляются
  // по запросу. Отключается явным LEADS_SAVE_LOCAL=0
  if (process.env.LEADS_SAVE_LOCAL !== "0") {
    try {
      await appendLead(lead);
    } catch (error) {
      console.error("[lead] журнал не записался", error);
    }
  }

  return Response.json({ ok: true });
}
