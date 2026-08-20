import { locales, localeLabels } from "@/i18n/routing";
import { getMedia } from "@/lib/media";
import { getAdminDict } from "@/lib/admin-lang";
import { PresentationUploader } from "@/components/admin/PresentationUploader";
import { removePresentation } from "@/app/admin/media-actions";

export const dynamic = "force-dynamic";

function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} MB` : `${Math.round(bytes / 1024)} KB`;
}

export default async function PresentationPage() {
  const [media, dict] = await Promise.all([getMedia(), getAdminDict()]);

  return (
    <div className="flex max-w-[860px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.presentation.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">
          {dict.presentation.subtitle}
        </p>
      </header>

      <div className="flex flex-col gap-[12px]">
        {locales.map((locale) => {
          const file = media.presentations?.[locale];
          const hasUk = Boolean(media.presentations?.uk);

          return (
            <section
              key={locale}
              className="flex flex-col gap-[14px] rounded-[4px] border border-line-soft bg-white p-[20px]"
            >
              <div className="flex flex-wrap items-center gap-[12px]">
                <span className="rounded-[3px] bg-paper px-[10px] py-[4px] text-[12px] tracking-[1px]">
                  {localeLabels[locale]}
                </span>

                {file ? (
                  <>
                    <span className="text-[15px]">{file.name}</span>
                    <span className="text-[13px] text-ink/50">
                      {formatSize(file.size)} · {dict.presentation.updated}{" "}
                      {new Date(file.updatedAt).toLocaleString("uk-UA")}
                    </span>
                  </>
                ) : (
                  <span className="text-[13px] text-ink/50">
                    {locale !== "uk" && hasUk
                      ? dict.presentation.fallback
                      : dict.presentation.noFallback}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-end gap-[16px]">
                <PresentationUploader locale={locale} hasFile={Boolean(file)} />

                {file && (
                  <div className="flex items-center gap-[10px]">
                    <a
                      href={file.file}
                      target="_blank"
                      rel="noreferrer"
                      className="flex h-[38px] items-center rounded-[4px] border border-line px-[16px] text-[13px] transition-colors hover:bg-paper"
                    >
                      {dict.common.open}
                    </a>
                    <form action={removePresentation}>
                      <input type="hidden" name="locale" value={locale} />
                      <button
                        type="submit"
                        className="h-[38px] rounded-[4px] border border-line px-[16px] text-[13px] text-red-700 transition-colors hover:bg-red-50"
                      >
                        {dict.common.delete}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
