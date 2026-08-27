"use client";

import { useActionState, useEffect, useState } from "react";
import { locales, localeLabels, type Locale } from "@/i18n/routing";
import { saveSection } from "@/app/admin/actions";
import { useDict, useLang } from "./AdminLangProvider";
import { fieldLabel } from "@/lib/field-labels";

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
  anchor,
  children,
}: {
  section: string;
  title: string;
  subtitle?: string;
  groups: FieldGroup[];
  /** Якорь блока на сайте — для кнопки «Подивитись на сайті» */
  anchor?: string;
  children?: React.ReactNode;
}) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(saveSection, null);
  const [allLangs, setAllLangs] = useState(false);
  const [dirty, setDirty] = useState(false);

  // правки живут только в форме: уход со страницы без сохранения их теряет
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (message === "saved") setDirty(false);
  }, [message]);

  const shown = allLangs ? locales : ([locales[0]] as readonly Locale[]);

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
    <form
      action={formAction}
      onChange={() => setDirty(true)}
      className="flex max-w-[1100px] flex-col gap-[24px] pb-[80px]"
    >
      <input type="hidden" name="__section" value={section} />

      <header className="flex flex-wrap items-start justify-between gap-[16px]">
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

        <div className="flex flex-wrap items-center gap-[12px]">
          {anchor && (
            <a
              href={anchor}
              target="_blank"
              rel="noreferrer"
              className="h-[36px] rounded-[8px] border border-line px-[16px] text-[13px] leading-[34px] transition-colors hover:bg-paper"
            >
              {dict.section.viewOnSite}
            </a>
          )}
          <button
            type="button"
            onClick={() => setAllLangs((v) => !v)}
            className="h-[36px] rounded-[8px] border border-line px-[16px] text-[13px] transition-colors hover:bg-paper"
          >
            {allLangs ? dict.section.onlyPrimary : dict.section.allLangs}
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

          {blocksOf(group.fields).map((block) => (
            <Block key={block.key} block={block} shown={shown} />
          ))}
        </div>
      ))}

      {/* кнопка едет за экраном: в длинном разделе не надо возвращаться вверх */}
      <div className="sticky bottom-0 -mx-[20px] flex flex-wrap items-center gap-[16px] border-t border-line-soft bg-white/95 px-[20px] py-[14px] backdrop-blur-[6px]">
        <button
          type="submit"
          disabled={pending}
          className="h-[44px] rounded-[9px] bg-ink px-[28px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {pending ? dict.section.publishing : dict.section.publish}
        </button>

        {note && (
          <span
            className={`text-[14px] ${
              message === "saved" ? "text-ink/60" : "text-red-700"
            }`}
          >
            {note}
          </span>
        )}

        {!note && dirty && (
          <span className="text-[13px] text-ink/50">
            {dict.section.unsaved}
          </span>
        )}
      </div>
    </form>
  );
}

type Block = { key: string; heading: string | null; fields: EditorField[] };

/**
 * Собирает поля в блоки по общему родителю.
 *
 * Плоский список из «Підпис / Значення / Підпис / Значення» не даёт понять,
 * какая подпись к какому числу. Поля одной ячейки идут в JSON рядом, под
 * общим ключом — по нему и группируем, а заголовком берём осмысленный текст
 * самой ячейки, если он там есть.
 */
function blocksOf(fields: EditorField[]): Block[] {
  const blocks: Block[] = [];

  for (const field of fields) {
    const parts = field.path.split(".");
    // у поля верхнего уровня родитель — сам раздел, группировать нечего
    const key = parts.length > 2 ? parts.slice(0, -1).join(".") : "";
    const last = blocks.at(-1);

    if (last && last.key === key) last.fields.push(field);
    else blocks.push({ key, heading: null, fields: [field] });
  }

  for (const block of blocks) {
    if (!block.key) continue;
    const named = block.fields.find((f) =>
      /\.(label|title|name|year)$/.test(f.path),
    );
    block.heading = named?.values.uk?.trim() || null;
  }

  return blocks;
}

function Block({ block, shown }: { block: Block; shown: readonly Locale[] }) {
  // без осмысленного заголовка рамка только мешает: у простых списков
  // номер элемента и так написан в подписи поля
  if (!block.heading) {
    return (
      <>
        {block.fields.map((field) => (
          <FieldRow key={field.path} field={field} shown={shown} />
        ))}
      </>
    );
  }

  return (
    <div className="flex flex-col gap-[10px] rounded-[10px] border border-line-soft bg-paper/50 px-[14px] py-[14px]">
      <p className="text-[13px] text-ink/70">{block.heading}</p>

      {block.fields.map((field) => (
        <FieldRow key={field.path} field={field} shown={shown} inBlock />
      ))}
    </div>
  );
}

function FieldRow({
  field,
  shown,
  inBlock = false,
}: {
  field: EditorField;
  shown: readonly Locale[];
  /** Внутри блока с заголовком номер элемента в подписи не нужен */
  inBlock?: boolean;
}) {
  const lang = useLang();

  return (
    <fieldset className="rounded-[10px] border border-line-soft bg-white px-[18px] py-[16px]">
      <legend className="px-[6px] text-[13px] text-ink/70">
        {fieldLabel(field.path, lang, inBlock)}
      </legend>

      <div
        className={`grid grid-cols-1 gap-[16px] ${
          shown.length > 1 ? "xl:grid-cols-2" : ""
        }`}
      >
        {shown.map((locale) => (
          <LocaleInput
            key={locale}
            locale={locale}
            path={field.path}
            value={field.values[locale] ?? ""}
          />
        ))}
      </div>

      {/* скрытые языки всё равно уходят на сервер: иначе сохранение
          затёрло бы переводы, которых нет на экране */}
      {locales
        .filter((locale) => !shown.includes(locale))
        .map((locale) => (
          <input
            key={locale}
            type="hidden"
            name={`${locale}::${field.path}`}
            defaultValue={field.values[locale] ?? ""}
          />
        ))}
    </fieldset>
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
