"use client";

import { useActionState } from "react";
import { updateRecoveryEmail } from "@/app/admin/settings-actions";
import { useDict } from "./AdminLangProvider";

/** Куда уходит ссылка на сброс пароля */
export function RecoveryEmailForm({
  recoveryEmail,
  fallback,
}: {
  recoveryEmail: string;
  fallback: string[];
}) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(
    updateRecoveryEmail,
    null,
  );
  const note = message
    ? (dict.msg[message as keyof typeof dict.msg] ?? message)
    : null;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[16px] rounded-[12px] border border-line-soft bg-white p-[20px] shadow-[0_1px_2px_rgba(30,30,30,0.04)]"
    >
      <div>
        <h2 className="text-[16px]">{dict.reset.title}</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">
          {dict.settings.recoveryHint}
        </p>
      </div>

      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          {dict.settings.recoveryEmail}
        </span>
        <input
          name="recoveryEmail"
          type="email"
          defaultValue={recoveryEmail}
          placeholder={fallback[0] ?? "name@example.com"}
          className="rounded-[8px] border border-line px-[12px] py-[10px] text-[14px] outline-none transition-colors focus:border-ink"
        />
      </label>

      {!recoveryEmail && (
        <p className="text-[13px] text-ink/60">
          {fallback.length
            ? `${dict.reset.willSendTo} ${fallback.join(", ")}`
            : dict.reset.noRecipientsHint}
        </p>
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
