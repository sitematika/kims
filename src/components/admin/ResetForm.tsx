"use client";

import Link from "next/link";
import { useActionState } from "react";
import { askReset, setNewPassword } from "@/app/admin/reset-actions";
import type { AdminDict } from "@/lib/admin-lang";

function Shell({
  dict,
  title,
  hint,
  children,
}: {
  dict: AdminDict;
  title: string;
  hint: string;
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-[20px]">
      <div className="flex w-full max-w-[380px] flex-col gap-[20px] rounded-[4px] bg-white px-[32px] py-[40px] shadow-[0_8px_32px_rgba(30,30,30,0.06)]">
        <div>
          <h1 className="text-[22px]">{title}</h1>
          <p className="mt-[6px] text-[14px] text-ink/60">{hint}</p>
        </div>

        {children}

        <Link
          href="/admin/login"
          className="text-[13px] text-ink/60 underline underline-offset-[3px] hover:text-ink"
        >
          {dict.reset.backToLogin}
        </Link>
      </div>
    </main>
  );
}

/** Шаг 1: попросить письмо со ссылкой */
export function ResetRequestForm({
  dict,
  maskedTo,
  expired = false,
}: {
  dict: AdminDict;
  maskedTo: string;
  expired?: boolean;
}) {
  const [message, formAction, pending] = useActionState(
    async () => askReset(),
    null,
  );
  const done = message === "resetSent";
  const note = message
    ? (dict.msg[message as keyof typeof dict.msg] ?? message)
    : null;

  return (
    <Shell
      dict={dict}
      title={dict.reset.title}
      hint={
        maskedTo
          ? `${dict.reset.willSendTo} ${maskedTo}`
          : dict.reset.noRecipientsHint
      }
    >
      {!done && (
        <form action={formAction}>
          <button
            type="submit"
            disabled={pending || !maskedTo}
            className="h-[48px] w-full rounded-[4px] bg-ink text-[15px] font-medium text-white disabled:opacity-60"
          >
            {pending ? dict.reset.sending : dict.reset.send}
          </button>
        </form>
      )}

      {expired && !message && (
        <p className="text-[13px] text-red-700">{dict.msg.resetBadToken}</p>
      )}

      {note && (
        <p className={`text-[13px] ${done ? "text-ink/70" : "text-red-700"}`}>
          {note}
        </p>
      )}
    </Shell>
  );
}

/** Шаг 2: задать новый пароль по ссылке из письма */
export function ResetPasswordForm({
  dict,
  token,
}: {
  dict: AdminDict;
  token: string;
}) {
  const [message, formAction, pending] = useActionState(setNewPassword, null);
  const done = message === "resetDone";
  const note = message
    ? (dict.msg[message as keyof typeof dict.msg] ?? message)
    : null;

  return (
    <Shell dict={dict} title={dict.reset.newTitle} hint={dict.reset.newHint}>
      {!done && (
        <form action={formAction} className="flex flex-col gap-[20px]">
          <input type="hidden" name="token" value={token} />

          <label className="flex flex-col gap-[8px]">
            <span className="text-[13px] tracking-[1px] text-ink/70 uppercase">
              {dict.settings.next}
            </span>
            <input
              type="password"
              name="password"
              autoFocus
              required
              minLength={10}
              className="border-b border-ink/20 pb-[10px] text-[16px] outline-none focus:border-ink"
            />
          </label>

          <label className="flex flex-col gap-[8px]">
            <span className="text-[13px] tracking-[1px] text-ink/70 uppercase">
              {dict.settings.repeat}
            </span>
            <input
              type="password"
              name="repeat"
              required
              minLength={10}
              className="border-b border-ink/20 pb-[10px] text-[16px] outline-none focus:border-ink"
            />
          </label>

          <button
            type="submit"
            disabled={pending}
            className="h-[48px] rounded-[4px] bg-ink text-[15px] font-medium text-white disabled:opacity-60"
          >
            {pending ? dict.common.saving : dict.reset.save}
          </button>
        </form>
      )}

      {note && (
        <p className={`text-[13px] ${done ? "text-ink/70" : "text-red-700"}`}>
          {note}
        </p>
      )}
    </Shell>
  );
}
