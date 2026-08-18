import Image from "next/image";
import { UploadButton } from "@/components/admin/UploadButton";
import { removeOgImage, uploadOgImage } from "@/app/admin/media-actions";

/** Блок SEO, который нельзя выразить обычным текстовым полем */
export function SeoExtras({
  ogImage,
  siteUrl,
  indexable,
}: {
  ogImage?: string | null;
  siteUrl: string;
  indexable: boolean;
}) {
  return (
    <section className="flex flex-col gap-[16px] rounded-[4px] border border-line-soft bg-white p-[20px]">
      <div>
        <h2 className="text-[16px]">Превью для соцсетей (Open Graph)</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">
          Картинка, которая показывается при отправке ссылки в мессенджер или
          соцсеть. Любое фото приводится к 1200×630.
        </p>
      </div>

      <div className="flex flex-col gap-[16px] md:flex-row md:items-center">
        <div className="relative h-[110px] w-[210px] shrink-0 overflow-hidden rounded-[4px] bg-paper">
          {ogImage ? (
            <Image src={ogImage} alt="" fill sizes="210px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[12px] text-ink/40">
              не загружена
            </span>
          )}
        </div>

        <div className="flex flex-col gap-[10px]">
          <UploadButton
            action={uploadOgImage}
            label={ogImage ? "Заменить превью" : "Загрузить превью"}
            okMessage="Превью обновлено"
          />
          {ogImage && (
            <form action={removeOgImage}>
              <button
                type="submit"
                className="h-[34px] rounded-[4px] border border-line px-[14px] text-[13px] text-red-700 transition-colors hover:bg-red-50"
              >
                Удалить превью
              </button>
            </form>
          )}
        </div>
      </div>

      <hr className="border-line-soft" />

      <div className="flex flex-col gap-[8px] text-[13px]">
        <p>
          <span className="text-ink/50">Карта сайта: </span>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {siteUrl}/sitemap.xml
          </a>
          <span className="text-ink/50">
            {" "}
            — собирается автоматически из четырёх языковых версий
          </span>
        </p>
        <p>
          <span className="text-ink/50">Правила для роботов: </span>
          <a
            href="/robots.txt"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {siteUrl}/robots.txt
          </a>
        </p>
        <p>
          <span className="text-ink/50">Индексация: </span>
          {indexable ? (
            <span>открыта — сайт попадает в поиск</span>
          ) : (
            <span className="text-red-700">
              закрыта (SITE_NOINDEX=1) — это технический домен
            </span>
          )}
        </p>
      </div>
    </section>
  );
}
