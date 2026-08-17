import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const runtime = "nodejs";

type Lead = {
  name: string;
  phone: string;
  city: string;
  locale: string;
};

function isValid(body: Partial<Lead>): body is Lead {
  return (
    typeof body.name === "string" &&
    body.name.trim().length >= 2 &&
    typeof body.phone === "string" &&
    body.phone.replace(/\D/g, "").length >= 9 &&
    typeof body.city === "string" &&
    body.city.trim().length >= 2
  );
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

  const lead = {
    name: body.name.trim(),
    phone: body.phone.trim(),
    city: body.city.trim(),
    locale: body.locale ?? "uk",
    createdAt: new Date().toISOString(),
    userAgent: request.headers.get("user-agent") ?? "",
  };

  // Куда уходит заявка, ещё не решено. Пока: лог + опциональный вебхук
  // (Telegram/CRM/Make) + опциональный файл. Достаточно поменять env.
  console.info("[lead]", lead);

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

  // Локальный лог заявок для разработки: LEADS_SAVE_LOCAL=1 -> data/leads.jsonl
  if (process.env.LEADS_SAVE_LOCAL === "1") {
    try {
      const dir = path.join(process.cwd(), "data");
      await mkdir(dir, { recursive: true });
      await appendFile(
        path.join(dir, "leads.jsonl"),
        `${JSON.stringify(lead)}\n`,
        "utf8",
      );
    } catch (error) {
      console.error("[lead] file write failed", error);
    }
  }

  return Response.json({ ok: true });
}
