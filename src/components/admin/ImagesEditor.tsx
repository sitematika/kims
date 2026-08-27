"use client";

import Image from "next/image";
import { useActionState } from "react";
import { locales, type Locale } from "@/i18n/routing";
import { saveSection } from "@/app/admin/actions";
import { replaceImage, resetImage } from "@/app/admin/media-actions";
import { LocaleInput } from "./FieldsForm";
import { UploadButton } from "./UploadButton";
import { useDict } from "./AdminLangProvider";

export type ImageRow = {
  id: string;
  label: string;
  src: string;
  custom: boolean;
  alts: Record<Locale, string>;
};

const FORM_ID = "alt-form";

/**
 * Фото и alt-тексты в одном месте: подпись видно рядом с самой картинкой,
 * а не в отдельном списке, где непонятно, к чему она относится.
 *
 * Поля alt лежат вне тега формы и связаны с ней атрибутом form — иначе
 * пришлось бы вкладывать формы загрузки внутрь формы сохранения, чего
 * браузер не допускает.
 */
export function ImagesEditor({ rows }: { rows: ImageRow[] }) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(saveSection, null);

  const missing = rows.filter((row) =>
    locales.some((l) => !row.alts[l]?.trim()),
  ).length;

  const note =
    message === "saved"
      ? dict.msg.saved
      : message === "sessionExpired"
        ? dict.msg.sessionExpired
        : null;

  return (
    <div className="flex max-w-[1100px] flex-col gap-[24px]">
      <form id={FORM_ID} action={formAction}>
        <input type="hidden" name="__section" value="alt" />
      </form>

      <header className="flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <h1 className="text-[24px]">{dict.images.title}</h1>
          <p className="mt-[4px] text-[14px] text-ink/60">
            {dict.images.subtitle}
            {missing > 0 && (
              <span className="text-red-700">
                {" "}
                · {dict.section.untranslated} {missing}
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
            form={FORM_ID}
            disabled={pending}
            className="h-[44px] rounded-[9px] bg-ink px-[28px] text-[14px] font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {pending ? dict.section.publishing : dict.section.publish}
          </button>
        </div>
      </header>

      <div className="flex flex-col gap-[16px]">
        {rows.map((row) => (
          <section
            key={row.id}
            className="flex flex-col gap-[16px] rounded-[4px] border border-line-soft bg-white p-[16px] lg:flex-row"
          >
            <div className="flex w-full shrink-0 flex-col gap-[10px] lg:w-[230px]">
              <div className="relative h-[150px] w-full overflow-hidden rounded-[4px] bg-paper">
                <Image
                  src={row.src}
                  alt=""
                  fill
                  sizes="230px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-wrap items-center gap-[8px]">
                <p className="text-[14px]">{row.label}</p>
                {row.custom && (
                  <span className="rounded-[3px] bg-blush-50 px-[8px] py-[2px] text-[11px] text-ink/60">
                    {dict.images.replaced}
                  </span>
                )}
              </div>

              <UploadButton
                action={replaceImage}
                hidden={{ slot: row.id }}
                label={dict.common.replace}
                okMessage="imageUpdated"
              />

              {row.custom && (
                <form action={resetImage}>
                  <input type="hidden" name="slot" value={row.id} />
                  <button
                    type="submit"
                    className="h-[32px] rounded-[4px] border border-line px-[12px] text-[12px] transition-colors hover:bg-paper"
                  >
                    {dict.images.reset}
                  </button>
                </form>
              )}
            </div>

            <div className="grid flex-1 grid-cols-1 gap-[16px] xl:grid-cols-2">
              {locales.map((locale) => (
                <LocaleInput
                  key={locale}
                  locale={locale}
                  path={`alt.${row.id}`}
                  value={row.alts[locale] ?? ""}
                  formId={FORM_ID}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
