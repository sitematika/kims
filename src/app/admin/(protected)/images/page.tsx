import Image from "next/image";
import { locales, localeLabels } from "@/i18n/routing";
import { getAllContent, type ContentNode } from "@/lib/content";
import { getMedia } from "@/lib/media";
import { imageSlots } from "@/lib/images";
import { UploadButton } from "@/components/admin/UploadButton";
import { replaceImage, resetImage } from "@/app/admin/media-actions";

export const dynamic = "force-dynamic";

export default async function ImagesPage() {
  const media = await getMedia();
  const all = await getAllContent();

  const altFor = (locale: (typeof locales)[number], id: string) => {
    const section = all[locale].alt as ContentNode | undefined;
    const value = section?.[id];
    return typeof value === "string" ? value : "";
  };

  return (
    <div className="flex max-w-[1100px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">Картинки сайта</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">
          Загруженное фото сжимается в WebP. Alt-тексты правятся в разделе
          «Alt-тексты картинок» — здесь они показаны для проверки.
        </p>
      </header>

      <div className="flex flex-col gap-[12px]">
        {imageSlots.map((slot) => {
          const custom = media.images?.[slot.id];
          return (
            <div
              key={slot.id}
              className="flex flex-col gap-[16px] rounded-[4px] border border-line-soft bg-white p-[16px] lg:flex-row"
            >
              <div className="relative h-[120px] w-full shrink-0 overflow-hidden rounded-[4px] bg-paper lg:w-[190px]">
                <Image
                  src={custom || slot.src}
                  alt=""
                  fill
                  sizes="190px"
                  className="object-cover"
                />
              </div>

              <div className="flex flex-1 flex-col gap-[10px]">
                <div className="flex flex-wrap items-center gap-[10px]">
                  <p className="text-[16px]">{slot.label}</p>
                  {custom && (
                    <span className="rounded-[3px] bg-blush-50 px-[8px] py-[2px] text-[11px] text-ink/60">
                      заменена
                    </span>
                  )}
                </div>

                <ul className="grid grid-cols-1 gap-x-[24px] gap-y-[2px] text-[12px] sm:grid-cols-2">
                  {locales.map((locale) => {
                    const alt = altFor(locale, slot.id);
                    return (
                      <li key={locale} className="truncate">
                        <span className="text-ink/40">
                          {localeLabels[locale]}:{" "}
                        </span>
                        {alt || <span className="text-red-700">нет alt</span>}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-[4px] flex flex-wrap items-center gap-[12px]">
                  <UploadButton
                    action={replaceImage}
                    hidden={{ slot: slot.id }}
                    label="Заменить"
                    okMessage="Картинка обновлена"
                  />
                  {custom && (
                    <form action={resetImage}>
                      <input type="hidden" name="slot" value={slot.id} />
                      <button
                        type="submit"
                        className="h-[34px] rounded-[4px] border border-line px-[14px] text-[13px] transition-colors hover:bg-paper"
                      >
                        Вернуть из макета
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
