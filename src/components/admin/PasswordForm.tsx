"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/admin/settings-actions";

const field =
  "rounded-[4px] border border-line px-[12px] py-[10px] text-[14px] outline-none focus:border-ink";

export function PasswordForm({ usingEnv }: { usingEnv: boolean }) {
  const [message, formAction, pending] = useActionState(changePassword, null);
  const done = message === "Пароль изменён. Войдите заново";

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[20px] rounded-[4px] border border-line-soft bg-white p-[20px]"
    >
      <div>
        <h2 className="text-[16px]">Пароль администратора</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">
          {usingEnv
            ? "Сейчас действует пароль из настроек хостинга. Задайте свой — он будет храниться на сервере и переживёт переустановку."
            : "Пароль задан здесь. После смены все открытые сессии закроются."}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
        <label className="flex flex-col gap-[8px]">
          <span className="text-[12px] tracking-[1px] text-ink/50">
            ТЕКУЩИЙ
          </span>
          <input type="password" name="current" required className={field} />
        </label>
        <label className="flex flex-col gap-[8px]">
          <span className="text-[12px] tracking-[1px] text-ink/50">
            НОВЫЙ (ОТ 10 СИМВОЛОВ)
          </span>
          <input
            type="password"
            name="next"
            required
            minLength={10}
            className={field}
          />
        </label>
        <label className="flex flex-col gap-[8px]">
          <span className="text-[12px] tracking-[1px] text-ink/50">
            НОВЫЙ ЕЩЁ РАЗ
          </span>
          <input type="password" name="repeat" required className={field} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          type="submit"
          disabled={pending}
          className="h-[42px] rounded-[4px] bg-ink px-[24px] text-[14px] font-medium text-white disabled:opacity-60"
        >
          {pending ? "Меняем…" : "Сменить пароль"}
        </button>
        {message && (
          <span className={`text-[13px] ${done ? "text-ink/60" : "text-red-700"}`}>
            {message}
          </span>
        )}
      </div>

      {done && (
        <a
          href="/admin/login"
          className="w-fit text-[14px] underline underline-offset-[4px]"
        >
          Войти с новым паролем
        </a>
      )}
    </form>
  );
}
