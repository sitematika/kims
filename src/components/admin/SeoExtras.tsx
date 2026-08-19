import Image from "next/image";
import { UploadButton } from "@/components/admin/UploadButton";
import { removeOgImage, uploadOgImage } from "@/app/admin/media-actions";
import type { AdminDict } from "@/lib/admin-lang";

/** Блок SEO, который нельзя выразить обычным текстовым полем */
export function SeoExtras({
  ogImage,
  siteUrl,
  indexable,
  dict,
}: {
  ogImage?: string | null;
  siteUrl: string;
  indexable: boolean;
  dict: AdminDict;
}) {
  return (
    <section className="flex flex-col gap-[16px] rounded-[4px] border border-line-soft bg-white p-[20px]">
      <div>
        <h2 className="text-[16px]">{dict.seo.ogTitle}</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">{dict.seo.ogHint}</p>
      </div>

      <div className="flex flex-col gap-[16px] md:flex-row md:items-center">
        <div className="relative h-[110px] w-[210px] shrink-0 overflow-hidden rounded-[4px] bg-paper">
          {ogImage ? (
            <Image src={ogImage} alt="" fill sizes="210px" className="object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-[12px] text-ink/40">
              {dict.seo.ogMissing}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-[10px]">
          <UploadButton
            action={uploadOgImage}
            label={ogImage ? dict.seo.ogReplace : dict.seo.ogUpload}
            okMessage="ogUpdated"
          />
          {ogImage && (
            <form action={removeOgImage}>
              <button
                type="submit"
                className="h-[34px] rounded-[4px] border border-line px-[14px] text-[13px] text-red-700 transition-colors hover:bg-red-50"
              >
                {dict.seo.ogDelete}
              </button>
            </form>
          )}
        </div>
      </div>

      <hr className="border-line-soft" />

      <div className="flex flex-col gap-[8px] text-[13px]">
        <p>
          <span className="text-ink/50">{dict.seo.sitemap} </span>
          <a
            href="/sitemap.xml"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            {siteUrl}/sitemap.xml
          </a>
          <span className="text-ink/50"> {dict.seo.sitemapHint}</span>
        </p>
        <p>
          <span className="text-ink/50">{dict.seo.robots} </span>
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
          <span className="text-ink/50">{dict.seo.indexing} </span>
          {indexable ? (
            <span>{dict.seo.indexingOpen}</span>
          ) : (
            <span className="text-red-700">{dict.seo.indexingClosed}</span>
          )}
        </p>
      </div>
    </section>
  );
}
