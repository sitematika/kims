"use client";

import { useActionState } from "react";

type Action = (
  state: string | null,
  formData: FormData,
) => Promise<string | null>;

/** Компактная форма «выбрать файл → загрузить» с сообщением о результате */
export function UploadButton({
  action,
  hidden,
  label,
  accept = "image/*",
  okMessage,
}: {
  action: Action;
  hidden?: Record<string, string>;
  label: string;
  accept?: string;
  okMessage: string;
}) {
  const [message, formAction, pending] = useActionState(action, null);

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-[12px]">
      {Object.entries(hidden ?? {}).map(([name, value]) => (
        <input key={name} type="hidden" name={name} value={value} />
      ))}

      <input
        type="file"
        name="file"
        accept={accept}
        required
        className="max-w-[220px] text-[12px] file:mr-[10px] file:rounded-[4px] file:border-0 file:bg-paper file:px-[12px] file:py-[6px] file:text-[12px]"
      />

      <button
        type="submit"
        disabled={pending}
        className="h-[34px] rounded-[4px] bg-ink px-[16px] text-[13px] font-medium text-white disabled:opacity-60"
      >
        {pending ? "Загружаем…" : label}
      </button>

      {message && (
        <span
          className={`text-[12px] ${
            message === okMessage ? "text-ink/60" : "text-red-700"
          }`}
        >
          {message}
        </span>
      )}
    </form>
  );
}
