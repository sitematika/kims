import { getMedia } from "@/lib/media";
import { getAdminDict } from "@/lib/admin-lang";
import { PresentationUploader } from "@/components/admin/PresentationUploader";
import { removePresentation } from "@/app/admin/media-actions";

export const dynamic = "force-dynamic";

function formatSize(bytes: number) {
  const mb = bytes / (1024 * 1024);
  return mb >= 1 ? `${mb.toFixed(1)} МБ` : `${Math.round(bytes / 1024)} КБ`;
}

export default async function PresentationPage() {
  const [{ presentation }, dict] = await Promise.all([getMedia(), getAdminDict()]);

  return (
    <div className="flex max-w-[860px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.presentation.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">{dict.presentation.subtitle}</p>
      </header>

      <PresentationUploader hasFile={Boolean(presentation)} />

      {presentation ? (
        <div className="flex flex-col gap-[16px] rounded-[4px] border border-line-soft bg-white p-[20px] md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[16px]">{presentation.name}</p>
            <p className="mt-[4px] text-[13px] text-ink/50">
              {formatSize(presentation.size)} · {dict.presentation.updated}{" "}
              {new Date(presentation.updatedAt).toLocaleString("uk-UA")}
            </p>
          </div>

          <div className="flex items-center gap-[12px]">
            <a
              href={presentation.file}
              target="_blank"
              rel="noreferrer"
              className="flex h-[40px] items-center rounded-[4px] border border-line px-[20px] text-[14px] transition-colors hover:bg-paper"
            >
              {dict.common.open}
            </a>
            <form action={removePresentation}>
              <button
                type="submit"
                className="h-[40px] rounded-[4px] border border-line px-[20px] text-[14px] text-red-700 transition-colors hover:bg-red-50"
              >
                {dict.common.delete}
              </button>
            </form>
          </div>
        </div>
      ) : (
        <p className="rounded-[4px] bg-blush-50 px-[20px] py-[16px] text-[14px] text-ink/70">
          {dict.presentation.missing}
        </p>
      )}
    </div>
  );
}
