"use client";

import { useActionState } from "react";
import { saveSocialLinks } from "@/app/admin/media-actions";

export type SocialRow = { id: string; group: string; label: string; url: string };

export function SocialLinksForm({ rows }: { rows: SocialRow[] }) {
  const [message, formAction, pending] = useActionState(saveSocialLinks, null);
  const ok = message === "Ссылки сохранены";

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
            className="flex-1 rounded-[4px] border border-line px-[12px] py-[10px] text-[14px] outline-none focus:border-ink"
          />
        </label>
      ))}

      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          type="submit"
          disabled={pending}
          className="h-[42px] rounded-[4px] bg-ink px-[24px] text-[14px] font-medium text-white disabled:opacity-60"
        >
          {pending ? "Сохраняем…" : "Сохранить ссылки"}
        </button>
        {message && (
          <span className={`text-[13px] ${ok ? "text-ink/60" : "text-red-700"}`}>
            {message}
          </span>
        )}
      </div>
    </form>
  );
}
