"use client";

import { useActionState } from "react";
import { addUser } from "@/app/admin/users-actions";
import { useDict } from "./AdminLangProvider";

/** Форма добавления учётной записи */
export function AddUserForm({ first }: { first: boolean }) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(addUser, null);
  const ok = message === "userAdded" || message === "usersStarted";
  const note = message
    ? (dict.msg[message as keyof typeof dict.msg] ?? message)
    : null;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[16px] rounded-[12px] border border-dashed border-line bg-white p-[20px]"
    >
      <div>
        <h2 className="text-[16px]">{dict.users.addTitle}</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">
          {first ? dict.users.firstHint : dict.users.addHint}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-[16px] md:grid-cols-3">
        <label className="flex flex-col gap-[6px]">
          <span className="text-[12px] tracking-[1px] text-ink/50">
            {dict.users.name}
          </span>
          <input
            name="name"
            required
            placeholder={dict.users.namePlaceholder}
            className="rounded-[8px] border border-line px-[12px] py-[10px] text-[14px] outline-none transition-colors focus:border-ink"
          />
        </label>

        <label className="flex flex-col gap-[6px]">
          <span className="text-[12px] tracking-[1px] text-ink/50">
            {dict.users.email}
          </span>
          <input
            name="email"
            type="email"
            required
            placeholder="name@example.com"
            className="rounded-[8px] border border-line px-[12px] py-[10px] text-[14px] outline-none transition-colors focus:border-ink"
          />
        </label>

        <label className="flex flex-col gap-[6px]">
          <span className="text-[12px] tracking-[1px] text-ink/50">
            {dict.users.password}
          </span>
          <input
            name="password"
            type="text"
            required
            minLength={10}
            autoComplete="off"
            className="rounded-[8px] border border-line px-[12px] py-[10px] text-[14px] outline-none transition-colors focus:border-ink"
          />
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          type="submit"
          disabled={pending}
          className="h-[42px] rounded-[9px] bg-ink px-[24px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? dict.common.saving : dict.users.add}
        </button>
        {note && (
          <span className={`text-[13px] ${ok ? "text-ink/60" : "text-red-700"}`}>
            {note}
          </span>
        )}
      </div>
    </form>
  );
}
