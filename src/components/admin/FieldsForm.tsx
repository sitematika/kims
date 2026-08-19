"use client";

import { useActionState } from "react";
import { locales, localeLabels, type Locale } from "@/i18n/routing";
import { saveSection } from "@/app/admin/actions";
import { useDict } from "./AdminLangProvider";

export type EditorField = {
  path: string;
  values: Record<Locale, string>;
};

export type FieldGroup = { title?: string; fields: EditorField[] };

/**
 * Универсальный редактор текстов. Может показывать поля нескольких разделов
 * сразу — сохранение идёт по путям внутри имён полей, поэтому одна форма
 * спокойно правит и «Меню», и «Кнопки».
 */
export function FieldsForm({
  section,
  title,
  subtitle,
  groups,
  children,
}: {
  section: string;
  title: string;
  subtitle?: string;
  groups: FieldGroup[];
  children?: React.ReactNode;
}) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(saveSection, null);

  const fields = groups.flatMap((group) => group.fields);
  const emptyCount = fields.filter((f) =>
    locales.some((l) => !f.values[l]?.trim()),
  ).length;

  const note =
    message === "saved"
      ? dict.msg.saved
      : message === "sessionExpired"
        ? dict.msg.sessionExpired
        : message === "noSection"
          ? dict.msg.noSection
          : null;

  return (
    <form action={formAction} className="flex max-w-[1100px] flex-col gap-[24px]">
      <input type="hidden" name="__section" value={section} />

      <header className="flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <h1 className="text-[24px]">{title}</h1>
          <p className="mt-[4px] text-[14px] text-ink/60">
            {subtitle ? `${subtitle} · ` : ""}
            {fields.length} {dict.section.fields}
            {emptyCount > 0 && (
              <span className="text-red-700">
                {" "}
                · {dict.section.untranslated} {emptyCount}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center gap-[16px]">
          {note && (
            <span
              className={`text-[14px] ${
                message === "saved" ? "text-ink/60" : "text-red-700"
              }`}
            >
              {note}
            </span>
          )}
          <button
            type="submit"
            disabled={pending}
            className="h-[44px] rounded-[4px] bg-ink px-[28px] text-[14px] font-medium text-white disabled:opacity-60"
          >
            {pending ? dict.section.publishing : dict.section.publish}
          </button>
        </div>
      </header>

      {children}

      {groups.map((group, i) => (
        <div key={group.title ?? i} className="flex flex-col gap-[16px]">
          {group.title && (
            <p className="text-[12px] tracking-[1px] text-ink/40 uppercase">
              {group.title}
            </p>
          )}

          {group.fields.map((field) => (
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
      ))}
    </form>
  );
}

export function LocaleInput({
  locale,
  path,
  value,
  formId,
}: {
  locale: Locale;
  path: string;
  value: string;
  formId?: string;
}) {
  const dict = useDict();
  const long = value.length > 90;
  const name = `${locale}::${path}`;
  const empty = !value.trim();

  const className = `rounded-[4px] border bg-white px-[12px] py-[10px] text-[14px] outline-none focus:border-ink ${
    empty ? "border-red-300" : "border-line"
  }`;

  return (
    <label className="flex flex-col gap-[6px]">
      <span
        className={`text-[12px] tracking-[1px] ${
          empty ? "text-red-700" : "text-ink/50"
        }`}
      >
        {localeLabels[locale]}
        {empty && ` · ${dict.common.empty}`}
      </span>

      {long ? (
        <textarea
          name={name}
          form={formId}
          defaultValue={value}
          rows={Math.min(8, Math.ceil(value.length / 70) + 1)}
          className={`resize-y leading-[1.4] ${className}`}
        />
      ) : (
        <input
          name={name}
          form={formId}
          defaultValue={value}
          className={className}
        />
      )}
    </label>
  );
}
