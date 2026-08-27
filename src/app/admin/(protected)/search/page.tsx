import Link from "next/link";
import { locales, localeLabels } from "@/i18n/routing";
import { flattenFields, getAllContent } from "@/lib/content";
import { getAdminDict, getAdminLang, type AdminDict } from "@/lib/admin-lang";
import { fieldLabel } from "@/lib/field-labels";
import { sectionHref } from "@/lib/section-anchors";

export const dynamic = "force-dynamic";

const LIMIT = 60;

/** Поиск по всем текстам всех языков: помнишь фразу — найдёшь раздел */
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, all, dict, lang] = await Promise.all([
    searchParams,
    getAllContent(),
    getAdminDict(),
    getAdminLang(),
  ]);

  const query = (q ?? "").trim().toLowerCase();

  const hits = query
    ? locales
        .flatMap((locale) =>
          flattenFields(all[locale])
            .filter((f) => f.value.toLowerCase().includes(query))
            .map((f) => ({ locale, ...f })),
        )
        // порядок полей важнее языка: одно и то же поле — рядом
        .sort((a, b) => a.path.localeCompare(b.path))
    : [];

  return (
    <div className="flex max-w-[900px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.nav.search}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">
          {dict.search.subtitle}
        </p>
      </header>

      <form className="flex flex-wrap gap-[12px]">
        <input
          name="q"
          defaultValue={q ?? ""}
          autoFocus
          placeholder={dict.search.placeholder}
          className="h-[44px] min-w-[240px] flex-1 rounded-[4px] border border-line px-[14px] text-[15px] outline-none focus:border-ink"
        />
        <button
          type="submit"
          className="h-[44px] rounded-[4px] bg-ink px-[28px] text-[14px] font-medium text-white"
        >
          {dict.search.go}
        </button>
      </form>

      {query && (
        <p className="text-[13px] text-ink/50">
          {hits.length
            ? `${dict.search.found} ${hits.length}`
            : dict.search.nothing}
          {hits.length > LIMIT && ` · ${dict.search.shownFirst} ${LIMIT}`}
        </p>
      )}

      <div className="flex flex-col gap-[10px]">
        {hits.slice(0, LIMIT).map((hit) => {
          const section = hit.path.split(".")[0];
          return (
            <Link
              key={`${hit.locale}-${hit.path}`}
              href={sectionHref(section)}
              className="flex flex-col gap-[6px] rounded-[4px] border border-line-soft bg-white px-[16px] py-[12px] transition-colors hover:border-line"
            >
              <span className="flex flex-wrap items-center gap-[8px] text-[12px] text-ink/45">
                <span className="rounded-[3px] bg-paper px-[6px] py-[2px]">
                  {localeLabels[hit.locale]}
                </span>
                <span>
                  {dict.sections[section as keyof AdminDict["sections"]] ??
                    section}
                </span>
                <span>·</span>
                <span>{fieldLabel(hit.path, lang)}</span>
              </span>
              <Highlight text={hit.value} query={query} />
            </Link>
          );
        })}
      </div>
    </div>
  );
}

/** Показываем кусок вокруг совпадения, а не всю простыню текста */
function Highlight({ text, query }: { text: string; query: string }) {
  const at = text.toLowerCase().indexOf(query);
  const from = Math.max(0, at - 60);
  const cut = text.slice(from, at + query.length + 90);

  const start = cut.toLowerCase().indexOf(query);
  const before = cut.slice(0, start);
  const match = cut.slice(start, start + query.length);
  const after = cut.slice(start + query.length);

  return (
    <span className="text-[14px] leading-[1.4]">
      {from > 0 && "…"}
      {before}
      <mark className="bg-blush-200 text-ink">{match}</mark>
      {after}
      {at + query.length + 90 < text.length && "…"}
    </span>
  );
}
