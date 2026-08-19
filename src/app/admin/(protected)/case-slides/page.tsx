import Image from "next/image";
import { locales, localeLabels } from "@/i18n/routing";
import { getAllContent, type ContentNode } from "@/lib/content";
import { getMedia } from "@/lib/media";
import { getAdminDict } from "@/lib/admin-lang";
import { SlideUploader } from "@/components/admin/SlideUploader";
import { moveSlide, removeSlide } from "@/app/admin/media-actions";

export const dynamic = "force-dynamic";

export default async function CaseSlidesPage() {
  const [media, all, dict] = await Promise.all([
    getMedia(),
    getAllContent(),
    getAdminDict(),
  ]);

  const captionFor = (locale: (typeof locales)[number], id: string) => {
    const section = all[locale].case as ContentNode | undefined;
    const slides = (section?.slides ?? {}) as ContentNode;
    return typeof slides[id] === "string" ? (slides[id] as string) : "";
  };

  return (
    <div className="flex max-w-[1100px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.slides.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">{dict.slides.subtitle}</p>
      </header>

      <SlideUploader />

      <div className="flex flex-col gap-[12px]">
        {media.caseSlides.map((slide, i) => (
          <div
            key={slide.id}
            className="flex flex-col gap-[16px] rounded-[4px] border border-line-soft bg-white p-[16px] md:flex-row md:items-center"
          >
            <div className="relative h-[110px] w-full shrink-0 overflow-hidden rounded-[4px] bg-paper md:w-[180px]">
              <Image
                src={slide.image}
                alt=""
                fill
                sizes="180px"
                className="object-cover"
              />
            </div>

            <div className="flex-1">
              <p className="font-mono text-[12px] text-ink/40">{slide.id}</p>
              <ul className="mt-[8px] grid grid-cols-1 gap-x-[24px] gap-y-[4px] text-[13px] sm:grid-cols-2">
                {locales.map((locale) => {
                  const caption = captionFor(locale, slide.id);
                  // при загрузке подпись копируется во все языки, чтобы сайт
                  // не показывал пустоту — здесь подсказываем, что её надо перевести
                  const untranslated =
                    locale !== "uk" && caption === captionFor("uk", slide.id);

                  return (
                    <li key={locale}>
                      <span className="text-ink/40">
                        {localeLabels[locale]}:{" "}
                      </span>
                      {caption || (
                        <span className="text-red-700">{dict.common.empty}</span>
                      )}
                      {untranslated && (
                        <span className="text-red-700"> · {dict.common.needsTranslation}</span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="flex shrink-0 items-center gap-[8px]">
              <form action={moveSlide}>
                <input type="hidden" name="id" value={slide.id} />
                <input type="hidden" name="direction" value="up" />
                <button
                  type="submit"
                  disabled={i === 0}
                  aria-label={dict.slides.up}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-[4px] border border-line disabled:opacity-30"
                >
                  ↑
                </button>
              </form>

              <form action={moveSlide}>
                <input type="hidden" name="id" value={slide.id} />
                <input type="hidden" name="direction" value="down" />
                <button
                  type="submit"
                  disabled={i === media.caseSlides.length - 1}
                  aria-label={dict.slides.down}
                  className="flex h-[36px] w-[36px] items-center justify-center rounded-[4px] border border-line disabled:opacity-30"
                >
                  ↓
                </button>
              </form>

              <form action={removeSlide}>
                <input type="hidden" name="id" value={slide.id} />
                <button
                  type="submit"
                  className="h-[36px] rounded-[4px] border border-line px-[16px] text-[13px] text-red-700 transition-colors hover:bg-red-50"
                >
                  {dict.common.delete}
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
