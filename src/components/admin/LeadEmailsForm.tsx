"use client";

import { useActionState } from "react";
import { addLeadEmail, removeLeadEmail } from "@/app/admin/settings-actions";
import { useDict } from "./AdminLangProvider";

const errors: Record<string, string> = {
  badEmail: "email",
  emailExists: "exists",
};

export function LeadEmailsForm({ emails }: { emails: string[] }) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(addLeadEmail, null);

  const hint =
    message === "saved"
      ? dict.msg.saved
      : message === "badEmail"
        ? dict.leads.badEmail
        : message === "emailExists"
          ? dict.leads.emailExists
          : message === "sessionExpired"
            ? dict.msg.sessionExpired
            : null;

  return (
    <div className="flex flex-col gap-[12px]">
      <ul className="flex flex-wrap gap-[8px]">
        {emails.length === 0 && (
          <li className="text-[13px] text-red-700">{dict.leads.noRecipients}</li>
        )}
        {emails.map((email) => (
          <li
            key={email}
            className="flex items-center gap-[8px] rounded-[4px] bg-paper px-[10px] py-[6px] text-[13px]"
          >
            {email}
            <form action={removeLeadEmail}>
              <input type="hidden" name="email" value={email} />
              <button
                type="submit"
                aria-label={dict.common.delete}
                className="text-ink/40 transition-colors hover:text-red-700"
              >
                ✕
              </button>
            </form>
          </li>
        ))}
      </ul>

      <form action={formAction} className="flex flex-wrap items-center gap-[10px]">
        <input
          name="email"
          type="email"
          required
          placeholder="name@example.com"
          className="w-[260px] rounded-[4px] border border-line px-[12px] py-[8px] text-[13px] outline-none focus:border-ink"
        />
        <button
          type="submit"
          disabled={pending}
          className="h-[36px] rounded-[8px] border border-line px-[16px] text-[13px] transition-colors hover:bg-paper disabled:opacity-60"
        >
          {dict.leads.addEmail}
        </button>
        {hint && (
          <span
            className={`text-[13px] ${
              message === "saved" ? "text-ink/60" : "text-red-700"
            }`}
          >
            {hint}
          </span>
        )}
      </form>
    </div>
  );
}
