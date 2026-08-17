"use client";

import { useActionState } from "react";
import { addSlide } from "@/app/admin/media-actions";

export function SlideUploader() {
  const [message, formAction, pending] = useActionState(addSlide, null);
  const ok = message === "Слайд добавлен";

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[16px] rounded-[4px] border border-dashed border-line bg-white px-[20px] py-[20px] md:flex-row md:items-end"
    >
      <label className="flex flex-1 flex-col gap-[6px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">ФОТО</span>
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className="text-[13px] file:mr-[12px] file:rounded-[4px] file:border-0 file:bg-ink file:px-[16px] file:py-[8px] file:text-[13px] file:text-white"
        />
      </label>

      <label className="flex flex-1 flex-col gap-[6px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          ПОДПИСЬ (украинский)
        </span>
        <input
          name="caption"
          placeholder="Напр.: Після відкриття"
          className="rounded-[4px] border border-line px-[12px] py-[10px] text-[14px] outline-none focus:border-ink"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="h-[42px] shrink-0 rounded-[4px] bg-ink px-[24px] text-[14px] font-medium text-white disabled:opacity-60"
      >
        {pending ? "Загружаем…" : "Добавить слайд"}
      </button>

      {message && (
        <p className={`text-[13px] ${ok ? "text-ink/60" : "text-red-700"}`}>
          {message}
        </p>
      )}
    </form>
  );
}
