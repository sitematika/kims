"use client";

import { useActionState } from "react";
import { uploadPresentation } from "@/app/admin/media-actions";
import { useDict } from "./AdminLangProvider";

export function PresentationUploader({
  locale,
  hasFile,
}: {
  locale: string;
  hasFile: boolean;
}) {
  const [message, formAction, pending] = useActionState(
    uploadPresentation,
    null,
  );
  const dict = useDict();
  const ok = message === "presentationUpdated";
  const note = message
    ? (dict.msg[message as keyof typeof dict.msg] ?? message)
    : null;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[16px] md:flex-row md:items-end"
    >
      <input type="hidden" name="locale" value={locale} />
      <label className="flex flex-1 flex-col gap-[6px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          {dict.presentation.file}
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
        className="h-[42px] shrink-0 rounded-[9px] bg-ink px-[24px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
      >
        {pending
          ? dict.common.uploading
          : hasFile
            ? dict.presentation.replace
            : dict.presentation.upload}
      </button>

      {note && (
        <p className={`text-[13px] ${ok ? "text-ink/60" : "text-red-700"}`}>
          {note}
        </p>
      )}
    </form>
  );
}
