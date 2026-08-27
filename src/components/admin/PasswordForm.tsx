"use client";

import { useActionState } from "react";
import { changePassword } from "@/app/admin/settings-actions";
import { useDict } from "./AdminLangProvider";

const field =
  "rounded-[8px] border border-line px-[12px] py-[10px] text-[14px] outline-none transition-colors focus:border-ink";

export function PasswordForm({ usingEnv }: { usingEnv: boolean }) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(changePassword, null);
  const done = message === "passwordChanged";
  const note = message
    ? (dict.msg[message as keyof typeof dict.msg] ?? message)
    : null;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[20px] rounded-[12px] border border-line-soft bg-white p-[20px] shadow-[0_1px_2px_rgba(30,30,30,0.04)]"
    >
      <div>
        <h2 className="text-[16px]">{dict.settings.passwordBlock}</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">
          {usingEnv
            ? dict.settings.passwordUsingEnv
            : dict.settings.passwordStored}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
        <label className="flex flex-col gap-[8px]">
          <span className="text-[12px] tracking-[1px] text-ink/50">
            {dict.settings.current}
          </span>
          <input type="password" name="current" required className={field} />
        </label>
        <label className="flex flex-col gap-[8px]">
          <span className="text-[12px] tracking-[1px] text-ink/50">
            {dict.settings.next}
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
            {dict.settings.repeat}
          </span>
          <input type="password" name="repeat" required className={field} />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          type="submit"
          disabled={pending}
          className="h-[42px] rounded-[9px] bg-ink px-[24px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? dict.settings.changing : dict.settings.changePassword}
        </button>
        {note && (
          <span className={`text-[13px] ${done ? "text-ink/60" : "text-red-700"}`}>
            {note}
          </span>
        )}
      </div>

      {done && (
        <a
          href="/admin/login"
          className="w-fit text-[14px] underline underline-offset-[4px]"
        >
          {dict.settings.loginAgain}
        </a>
      )}
    </form>
  );
}
