"use client";

import { useActionState } from "react";
import { login } from "@/app/admin/actions";
import type { AdminDict } from "@/lib/admin-lang";

export function LoginForm({ dict }: { dict: AdminDict }) {
  const [error, formAction, pending] = useActionState(login, null);

  return (
    <main className="flex min-h-screen items-center justify-center px-[20px]">
      <form
        action={formAction}
        className="flex w-full max-w-[380px] flex-col gap-[20px] rounded-[4px] bg-white px-[32px] py-[40px] shadow-[0_8px_32px_rgba(30,30,30,0.06)]"
      >
        <div>
          <h1 className="text-[22px]">{dict.login.title}</h1>
          <p className="mt-[6px] text-[14px] text-ink/60">
            {dict.login.subtitle}
          </p>
        </div>

        <label className="flex flex-col gap-[8px]">
          <span className="text-[13px] tracking-[1px] text-ink/70 uppercase">
            {dict.login.password}
          </span>
          <input
            type="password"
            name="password"
            autoFocus
            required
            className="border-b border-ink/20 pb-[10px] text-[16px] outline-none focus:border-ink"
          />
        </label>

        {error && (
          <p className="text-[13px] text-red-700">
            {error === "wrongPassword" ? dict.msg.wrongPassword : error}
          </p>
        )}

        <button
          type="submit"
          disabled={pending}
          className="mt-[8px] h-[48px] rounded-[4px] bg-ink text-[15px] font-medium text-white disabled:opacity-60"
        >
          {pending ? dict.login.checking : dict.login.submit}
        </button>
      </form>
    </main>
  );
}
