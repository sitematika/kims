import nodemailer from "nodemailer";
import { getSettings } from "./settings";

export type Lead = {
  name: string;
  phone: string;
  city: string;
  locale: string;
  createdAt: string;
};

const labels: Record<string, string> = {
  uk: "українська",
  en: "англійська",
  es: "іспанська",
  ru: "російська",
};

function lines(lead: Lead) {
  return [
    `Ім'я: ${lead.name}`,
    `Телефон: ${lead.phone}`,
    `Місто: ${lead.city}`,
    `Мова сайту: ${labels[lead.locale] ?? lead.locale}`,
    `Час: ${new Date(lead.createdAt).toLocaleString("uk-UA")}`,
  ];
}

/** Доступ к боту: сначала то, что задано в админке, потом окружение */
export async function telegramAccess() {
  const { telegramToken, telegramChat } = await getSettings();
  return {
    token: telegramToken || process.env.TELEGRAM_BOT_TOKEN || "",
    chat: telegramChat || process.env.TELEGRAM_CHAT_ID || "",
  };
}

/** Сообщение в группу Telegram */
async function toTelegram(lead: Lead) {
  const { token, chat } = await telegramAccess();
  if (!token || !chat) return;

  const text = ["🔔 Нова заявка з сайту KIMS", "", ...lines(lead)].join("\n");

  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ chat_id: chat, text, disable_web_page_preview: true }),
  });

  if (!res.ok) {
    throw new Error(`Telegram ${res.status}: ${await res.text()}`);
  }
}

/** Список получателей: сначала заданные в админке, потом из окружения */
export async function leadRecipients(): Promise<string[]> {
  const { leadEmails } = await getSettings();
  if (leadEmails?.length) return leadEmails;

  const fromEnv = process.env.LEADS_EMAIL_TO;
  return fromEnv ? fromEnv.split(",").map((s) => s.trim()).filter(Boolean) : [];
}

/**
 * Отправка письма через настроенный SMTP. Возвращает false, если доступ
 * к почте не настроен — вызывающий решает, ошибка это или штатный пропуск.
 */
export async function sendMail(options: {
  to: string[];
  subject: string;
  text: string;
}) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  if (!host || !user || !pass || !options.to.length) return false;

  const port = Number(process.env.SMTP_PORT ?? 465);

  const transport = nodemailer.createTransport({
    host,
    port,
    // 465 — соединение сразу шифруется, 587 — переходит на TLS после старта
    secure: port === 465,
    auth: { user, pass },
  });

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? user,
    to: options.to,
    subject: options.subject,
    text: options.text,
  });

  return true;
}

/** Письмо ответственным менеджерам */
async function toEmail(lead: Lead) {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = await leadRecipients();
  if (!host || !user || !pass || !to.length) return;

  const port = Number(process.env.SMTP_PORT ?? 465);

  const transport = nodemailer.createTransport({
    host,
    port,
    // 465 — соединение сразу шифруется, 587 — переходит на TLS после старта
    secure: port === 465,
    auth: { user, pass },
  });

  await transport.sendMail({
    from: process.env.SMTP_FROM ?? user,
    to,
    replyTo: undefined,
    subject: `Заявка з сайту KIMS — ${lead.name}`,
    text: lines(lead).join("\n"),
  });
}

export type ChannelResult = {
  channel: "telegram" | "email";
  status: "ok" | "skipped" | "error";
  detail?: string;
};

/**
 * Рассылает заявку по всем настроенным каналам.
 * Ошибка одного канала не мешает остальным и не роняет ответ посетителю:
 * заявка к этому моменту уже записана.
 */
export async function notify(lead: Lead): Promise<ChannelResult[]> {
  const status = await notifyStatus();
  const settled = await Promise.allSettled([toTelegram(lead), toEmail(lead)]);

  return settled.map((result, i): ChannelResult => {
    const channel = i === 0 ? "telegram" : "email";
    const configured = i === 0 ? status.telegram : status.email;

    if (!configured) return { channel, status: "skipped" };

    if (result.status === "rejected") {
      const detail =
        result.reason instanceof Error
          ? result.reason.message
          : String(result.reason);
      console.error(`[lead] канал ${channel}:`, detail);
      return { channel, status: "error", detail };
    }

    return { channel, status: "ok" };
  });
}

/** Какие каналы настроены — для диагностики в админке */
export async function notifyStatus() {
  const [recipients, telegram] = await Promise.all([
    leadRecipients(),
    telegramAccess(),
  ]);

  return {
    telegram: Boolean(telegram.token && telegram.chat),
    // почта считается настроенной, только когда есть и доступ, и получатель
    email: Boolean(
      process.env.SMTP_HOST &&
        process.env.SMTP_USER &&
        process.env.SMTP_PASS &&
        recipients.length,
    ),
    smtpReady: Boolean(
      process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS,
    ),
    recipients,
    webhook: Boolean(process.env.LEADS_WEBHOOK_URL),
  };
}
