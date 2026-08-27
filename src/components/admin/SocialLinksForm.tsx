"use client";

import { useActionState } from "react";
import { saveSocialLinks } from "@/app/admin/media-actions";
import { useDict } from "./AdminLangProvider";

export type SocialRow = { id: string; group: string; label: string; url: string };

export function SocialLinksForm({ rows }: { rows: SocialRow[] }) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(saveSocialLinks, null);
  const ok = message === "linksSaved";
  const note = message
    ? (dict.msg[message as keyof typeof dict.msg] ?? message)
    : null;

  return (
    <form action={formAction} className="flex flex-col gap-[16px]">
      {rows.map((row, i) => (
        <label
          key={row.id}
          className="flex flex-col gap-[8px] rounded-[4px] border border-line-soft bg-white p-[16px] md:flex-row md:items-center md:gap-[20px]"
        >
          <span className="w-full text-[14px] md:w-[220px] md:shrink-0">
            {(i === 0 || rows[i - 1].group !== row.group) && (
              <span className="mr-[8px] text-ink/40">{row.group}</span>
            )}
            {row.label}
          </span>
          <input
            name={`link::${row.id}`}
            defaultValue={row.url}
            placeholder="https://"
            className="flex-1 rounded-[8px] border border-line px-[12px] py-[10px] text-[14px] outline-none transition-colors focus:border-ink"
          />
        </label>
      ))}

      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          type="submit"
          disabled={pending}
          className="h-[42px] rounded-[9px] bg-ink px-[24px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? dict.common.saving : dict.social.save}
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
