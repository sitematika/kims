"use server";

import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/auth";
import { saveSettings } from "@/lib/settings";
import { telegramAccess } from "@/lib/notify";

export async function updateTelegram(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const telegramToken = String(formData.get("telegramToken") ?? "").trim();
  const telegramChat = String(formData.get("telegramChat") ?? "").trim();

  if (telegramToken && !/^\d+:[\w-]{30,}$/.test(telegramToken)) {
    return "badTelegramToken";
  }

  // поле токена показывается пустым: сохранённый не выводим на экран,
  // поэтому пустое значение означает «оставить как есть»
  await saveSettings(
    telegramToken ? { telegramToken, telegramChat } : { telegramChat },
  );
  revalidatePath("/admin/leads");
  return "saved";
}

export type FoundChat = { id: string; title: string };

/**
 * Ищет чаты, в которых бот уже побывал.
 *
 * Самая частая причина «chat not found» — вписан не тот идентификатор:
 * у супергруппы он начинается с -100, а после превращения группы в
 * супергруппу меняется целиком. Спрашиваем список у самого Telegram,
 * чтобы не искать его вручную.
 */
export async function findChats(): Promise<
  { ok: true; chats: FoundChat[] } | { ok: false; error: string }
> {
  if (!(await isAuthorized())) return { ok: false, error: "sessionExpired" };

  const { token } = await telegramAccess();
  if (!token) return { ok: false, error: "noToken" };

  try {
    const res = await fetch(
      `https://api.telegram.org/bot${token}/getUpdates?limit=100`,
      { cache: "no-store" },
    );
    const data = (await res.json()) as {
      ok: boolean;
      description?: string;
      result?: { message?: { chat?: { id: number; title?: string; type: string } } }[];
    };

    if (!data.ok) return { ok: false, error: data.description ?? "telegram" };

    const seen = new Map<string, string>();
    for (const update of data.result ?? []) {
      const chat = update.message?.chat;
      if (!chat) continue;
      seen.set(String(chat.id), chat.title ?? chat.type);
    }

    return {
      ok: true,
      chats: [...seen].map(([id, title]) => ({ id, title })),
    };
  } catch (error) {
    return { ok: false, error: String(error) };
  }
}
