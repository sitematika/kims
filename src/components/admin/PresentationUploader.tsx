"use client";

import { useActionState } from "react";
import { uploadPresentation } from "@/app/admin/media-actions";

export function PresentationUploader({ hasFile }: { hasFile: boolean }) {
  const [message, formAction, pending] = useActionState(
    uploadPresentation,
    null,
  );
  const ok = message === "Презентация обновлена";

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[16px] rounded-[4px] border border-dashed border-line bg-white px-[20px] py-[20px] md:flex-row md:items-end"
    >
      <label className="flex flex-1 flex-col gap-[6px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          PDF-ФАЙЛ (до 35 МБ)
        </span>
        <input
          type="file"
          name="file"
          accept="application/pdf,.pdf"
          required
          className="text-[13px] file:mr-[12px] file:rounded-[4px] file:border-0 file:bg-ink file:px-[16px] file:py-[8px] file:text-[13px] file:text-white"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="h-[42px] shrink-0 rounded-[4px] bg-ink px-[24px] text-[14px] font-medium text-white disabled:opacity-60"
      >
        {pending
          ? "Загружаем…"
          : hasFile
            ? "Заменить презентацию"
            : "Загрузить презентацию"}
      </button>

      {message && (
        <p className={`text-[13px] ${ok ? "text-ink/60" : "text-red-700"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
