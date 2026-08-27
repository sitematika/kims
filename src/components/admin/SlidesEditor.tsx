"use client";

import Image from "next/image";
import { useActionState } from "react";
import { locales, type Locale } from "@/i18n/routing";
import { saveSection } from "@/app/admin/actions";
import { moveSlide, removeSlide } from "@/app/admin/media-actions";
import { LocaleInput } from "./FieldsForm";
import { SlideUploader } from "./SlideUploader";
import { useDict } from "./AdminLangProvider";

export type SlideRow = {
  id: string;
  image: string;
  captions: Record<Locale, string>;
};

const FORM_ID = "slides-form";

/** Кадр и его подписи рядом — видно, к какому фото какая подпись */
export function SlidesEditor({ rows }: { rows: SlideRow[] }) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(saveSection, null);

  const note =
    message === "saved"
      ? dict.msg.saved
      : message === "sessionExpired"
        ? dict.msg.sessionExpired
        : null;

  return (
    <div className="flex max-w-[1100px] flex-col gap-[24px]">
      <form id={FORM_ID} action={formAction}>
        <input type="hidden" name="__section" value="case" />
      </form>

      <header className="flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <h1 className="text-[24px]">{dict.slides.title}</h1>
          <p className="mt-[4px] text-[14px] text-ink/60">
            {dict.slides.subtitle}
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

      <SlideUploader />

      <div className="flex flex-col gap-[16px]">
        {rows.map((row, i) => (
          <section
            key={row.id}
            className="flex flex-col gap-[16px] rounded-[4px] border border-line-soft bg-white p-[16px] lg:flex-row"
          >
            <div className="flex w-full shrink-0 flex-col gap-[10px] lg:w-[230px]">
              <div className="relative h-[150px] w-full overflow-hidden rounded-[4px] bg-paper">
                <Image
                  src={row.image}
                  alt=""
                  fill
                  sizes="230px"
                  className="object-cover"
                />
              </div>

              <div className="flex items-center gap-[8px]">
                <form action={moveSlide}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="direction" value="up" />
                  <button
                    type="submit"
                    disabled={i === 0}
                    aria-label={dict.slides.up}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] border border-line disabled:opacity-30"
                  >
                    ↑
                  </button>
                </form>

                <form action={moveSlide}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="direction" value="down" />
                  <button
                    type="submit"
                    disabled={i === rows.length - 1}
                    aria-label={dict.slides.down}
                    className="flex h-[32px] w-[32px] items-center justify-center rounded-[4px] border border-line disabled:opacity-30"
                  >
                    ↓
                  </button>
                </form>

                <form action={removeSlide}>
                  <input type="hidden" name="id" value={row.id} />
                  <button
                    type="submit"
                    className="h-[32px] rounded-[4px] border border-line px-[12px] text-[12px] text-red-700 transition-colors hover:bg-red-50"
                  >
                    {dict.common.delete}
                  </button>
                </form>
              </div>
            </div>

            <div className="grid flex-1 grid-cols-1 gap-[16px] xl:grid-cols-2">
              {locales.map((locale) => (
                <LocaleInput
                  key={locale}
                  locale={locale}
                  path={`case.slides.${row.id}`}
                  value={row.captions[locale] ?? ""}
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
