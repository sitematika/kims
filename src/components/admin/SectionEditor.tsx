"use client";

import { useActionState } from "react";
import { locales, localeLabels, type Locale } from "@/i18n/routing";
import { saveSection } from "@/app/admin/actions";

export type EditorField = {
  path: string;
  values: Record<Locale, string>;
};

export function SectionEditor({
  section,
  title,
  fields,
}: {
  section: string;
  title: string;
  fields: EditorField[];
}) {
  const [message, formAction, pending] = useActionState(saveSection, null);
  const emptyCount = fields.filter((f) =>
    locales.some((l) => !f.values[l]?.trim()),
  ).length;

  return (
    <form action={formAction} className="flex max-w-[1100px] flex-col gap-[24px]">
      <input type="hidden" name="__section" value={section} />

      <header className="flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <h1 className="text-[24px]">{title}</h1>
          <p className="mt-[4px] text-[14px] text-ink/60">
            {fields.length} полей
            {emptyCount > 0 && (
              <span className="text-red-700">
                {" "}
                · не заполнено переводов: {emptyCount}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-[16px]">
          {message && (
            <span
              className={`text-[14px] ${
                message === "Сохранено" ? "text-ink/60" : "text-red-700"
              }`}
            >
              {message}
            </span>
          )}
          <button
            type="submit"
            disabled={pending}
            className="h-[44px] rounded-[4px] bg-ink px-[28px] text-[14px] font-medium text-white disabled:opacity-60"
          >
            {pending ? "Сохраняем…" : "Сохранить и опубликовать"}
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-[16px]">
        {fields.map((field) => (
          <fieldset
            key={field.path}
            className="rounded-[4px] border border-line-soft bg-white px-[20px] py-[18px]"
          >
            <legend className="px-[6px] font-mono text-[12px] text-ink/40">
              {field.path}
            </legend>

            <div className="grid grid-cols-1 gap-[16px] xl:grid-cols-2">
              {locales.map((locale) => (
                <LocaleInput
                  key={locale}
                  locale={locale}
                  path={field.path}
                  value={field.values[locale] ?? ""}
                />
              ))}
            </div>
          </fieldset>
        ))}
      </div>
    </form>
  );
}

function LocaleInput({
  locale,
  path,
  value,
}: {
  locale: Locale;
  path: string;
  value: string;
}) {
  const long = value.length > 90;
  const name = `${locale}::${path}`;
  const empty = !value.trim();

  return (
    <label className="flex flex-col gap-[6px]">
      <span
        className={`text-[12px] tracking-[1px] ${
          empty ? "text-red-700" : "text-ink/50"
        }`}
      >
        {localeLabels[locale]}
        {empty && " · пусто"}
      </span>

      {long ? (
        <textarea
          name={name}
          defaultValue={value}
          rows={Math.min(8, Math.ceil(value.length / 70) + 1)}
          className={`resize-y rounded-[4px] border bg-white px-[12px] py-[10px] text-[14px] leading-[1.4] outline-none focus:border-ink ${
            empty ? "border-red-300" : "border-line"
          }`}
        />
      ) : (
        <input
          name={name}
          defaultValue={value}
          className={`rounded-[4px] border bg-white px-[12px] py-[10px] text-[14px] outline-none focus:border-ink ${
            empty ? "border-red-300" : "border-line"
          }`}
        />
      )}
    </label>
  );
}
