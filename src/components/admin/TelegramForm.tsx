"use client";

import { useActionState, useState, useTransition } from "react";
import {
  findChats,
  updateTelegram,
  type FoundChat,
} from "@/app/admin/telegram-actions";
import { useDict } from "./AdminLangProvider";

/** Доступ к боту Telegram: токен, чат и поиск идентификатора чата */
export function TelegramForm({
  hasToken,
  chat,
  fromEnv,
}: {
  hasToken: boolean;
  chat: string;
  /** Значения пришли из переменных хостинга, а не из панели */
  fromEnv: boolean;
}) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(updateTelegram, null);
  const [chats, setChats] = useState<FoundChat[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [chatValue, setChatValue] = useState(chat);
  const [searching, startSearch] = useTransition();

  const note = message
    ? (dict.msg[message as keyof typeof dict.msg] ?? message)
    : null;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[16px] rounded-[12px] border border-line-soft bg-white p-[20px] shadow-[0_1px_2px_rgba(30,30,30,0.04)]"
    >
      <div>
        <h2 className="text-[16px]">{dict.telegram.title}</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">{dict.telegram.hint}</p>
      </div>

      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          {dict.telegram.token}
        </span>
        <input
          name="telegramToken"
          type="password"
          autoComplete="off"
          placeholder={
            hasToken ? dict.telegram.tokenSaved : "123456789:AA..."
          }
          className="rounded-[8px] border border-line px-[12px] py-[10px] text-[14px] outline-none transition-colors focus:border-ink"
        />
        <span className="text-[13px] text-ink/60">
          {hasToken ? dict.telegram.tokenKeep : dict.telegram.tokenHint}
        </span>
      </label>

      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          {dict.telegram.chat}
        </span>
        <input
          name="telegramChat"
          value={chatValue}
          onChange={(e) => setChatValue(e.target.value)}
          placeholder="-1001234567890"
          className="rounded-[8px] border border-line px-[12px] py-[10px] text-[14px] outline-none transition-colors focus:border-ink"
        />
      </label>

      <div className="flex flex-wrap items-center gap-[12px]">
        <button
          type="button"
          disabled={searching || !hasToken}
          onClick={() =>
            startSearch(async () => {
              setError(null);
              const result = await findChats();
              if (result.ok) setChats(result.chats);
              else {
                setChats(null);
                setError(result.error);
              }
            })
          }
          className="h-[38px] rounded-[8px] border border-line px-[18px] text-[13px] transition-colors hover:bg-paper disabled:opacity-50"
        >
          {searching ? dict.telegram.searching : dict.telegram.find}
        </button>
        <span className="text-[13px] text-ink/50">{dict.telegram.findHint}</span>
      </div>

      {chats?.length === 0 && (
        <p className="text-[13px] text-red-700">{dict.telegram.noChats}</p>
      )}

      {chats && chats.length > 0 && (
        <ul className="flex flex-col gap-[8px]">
          {chats.map((item) => (
            <li key={item.id}>
              <button
                type="button"
                onClick={() => setChatValue(item.id)}
                className={`rounded-[4px] border px-[12px] py-[8px] text-[13px] transition-colors ${
                  chatValue === item.id
                    ? "border-ink bg-paper"
                    : "border-line hover:bg-paper"
                }`}
              >
                {item.title}
                <span className="ml-[8px] font-mono text-ink/50">
                  {item.id}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-[13px] text-red-700">{error}</p>}

      {fromEnv && (
        <p className="text-[13px] text-ink/60">{dict.telegram.fromEnv}</p>
      )}

      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          type="submit"
          disabled={pending}
          className="h-[42px] rounded-[9px] bg-ink px-[24px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? dict.common.saving : dict.common.save}
        </button>
        {note && <span className="text-[13px] text-ink/60">{note}</span>}
      </div>
    </form>
  );
}
