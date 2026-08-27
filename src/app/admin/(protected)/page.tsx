import Link from "next/link";
import { getReadiness } from "@/lib/readiness";
import { sectionHref } from "@/lib/section-anchors";
import { listSnapshots } from "@/lib/history";
import { readLeads } from "@/lib/leads";
import { getAdminDict, type AdminDict } from "@/lib/admin-lang";

export const dynamic = "force-dynamic";

/** Сводка: что мешает запуску, где не хватает переводов, что происходило */
export default async function AdminHome() {
  const [{ checks, sections, emptyTotal }, dict, snapshots, leads] =
    await Promise.all([
      getReadiness(),
      getAdminDict(),
      listSnapshots(),
      readLeads().catch(() => []),
    ]);

  const blocking = checks.filter((c) => !c.ok && !c.soft);
  const soft = checks.filter((c) => !c.ok && c.soft);

  return (
    <div className="flex max-w-[1000px] flex-col gap-[28px]">
      <header>
        <h1 className="text-[24px]">{dict.home.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">{dict.home.subtitle}</p>
      </header>

      <section className="flex flex-col gap-[12px] rounded-[4px] border border-line-soft bg-white p-[20px]">
        <div className="flex flex-wrap items-baseline justify-between gap-[12px]">
          <h2 className="text-[16px]">{dict.home.readiness}</h2>
          <span className="text-[13px] text-ink/50">
            {checks.filter((c) => c.ok).length}/{checks.length}
          </span>
        </div>

        <ul className="flex flex-col">
          {checks.map((check) => (
            <li
              key={check.id}
              className="flex flex-wrap items-center gap-[10px] border-b border-line-soft py-[10px] text-[14px] last:border-b-0"
            >
              <span
                aria-hidden
                className={`h-[8px] w-[8px] shrink-0 rounded-full ${
                  check.ok
                    ? "bg-green-600"
                    : check.soft
                      ? "bg-accent"
                      : "bg-red-600"
                }`}
              />
              <span className={check.ok ? "text-ink/60" : ""}>
                {dict.checks[check.id as keyof AdminDict["checks"]] ?? check.id}
              </span>
              {check.detail && (
                <span className="text-[13px] text-ink/45">{check.detail}</span>
              )}
              {!check.ok && check.href && (
                <Link
                  href={check.href}
                  className="ml-auto text-[13px] underline underline-offset-[3px] text-ink/60 hover:text-ink"
                >
                  {dict.home.fix}
                </Link>
              )}
            </li>
          ))}
        </ul>

        <p className="text-[13px] text-ink/50">
          {blocking.length
            ? dict.home.blocking
            : soft.length
              ? dict.home.softOnly
              : dict.home.allGood}
        </p>
      </section>

      <section className="flex flex-col gap-[12px] rounded-[4px] border border-line-soft bg-white p-[20px]">
        <div className="flex flex-wrap items-baseline justify-between gap-[12px]">
          <h2 className="text-[16px]">{dict.home.translations}</h2>
          <span className="text-[13px] text-ink/50">
            {emptyTotal
              ? `${dict.section.untranslated} ${emptyTotal}`
              : dict.home.allTranslated}
          </span>
        </div>

        <div className="flex flex-wrap gap-[8px]">
          {sections.map((s) => (
            <Link
              key={s.section}
              href={sectionHref(s.section)}
              className={`rounded-[4px] border px-[12px] py-[8px] text-[13px] transition-colors ${
                s.empty
                  ? "border-red-200 bg-red-50/60 hover:border-red-400"
                  : "border-line-soft hover:bg-paper"
              }`}
            >
              {dict.sections[s.section as keyof AdminDict["sections"]] ??
                s.section}
              {s.empty > 0 && (
                <span className="ml-[6px] text-red-700">{s.empty}</span>
              )}
            </Link>
          ))}
        </div>
      </section>

      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
        <section className="flex flex-col gap-[12px] rounded-[4px] border border-line-soft bg-white p-[20px]">
          <div className="flex items-baseline justify-between gap-[12px]">
            <h2 className="text-[16px]">{dict.nav.leads}</h2>
            <Link
              href="/admin/leads"
              className="text-[13px] text-ink/60 underline underline-offset-[3px] hover:text-ink"
            >
              {dict.home.all}
            </Link>
          </div>

          {leads.length === 0 ? (
            <p className="text-[13px] text-ink/50">{dict.home.noLeads}</p>
          ) : (
            <ul className="flex flex-col gap-[8px]">
              {leads.slice(0, 5).map((lead) => (
                <li key={lead.createdAt} className="text-[13px]">
                  <span>{lead.name}</span>
                  <span className="text-ink/50">
                    {" · "}
                    {lead.city}
                    {" · "}
                    {new Date(lead.createdAt).toLocaleString("uk-UA")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col gap-[12px] rounded-[4px] border border-line-soft bg-white p-[20px]">
          <div className="flex items-baseline justify-between gap-[12px]">
            <h2 className="text-[16px]">{dict.nav.history}</h2>
            <Link
              href="/admin/history"
              className="text-[13px] text-ink/60 underline underline-offset-[3px] hover:text-ink"
            >
              {dict.home.all}
            </Link>
          </div>

          {snapshots.length === 0 ? (
            <p className="text-[13px] text-ink/50">{dict.history.empty}</p>
          ) : (
            <ul className="flex flex-col gap-[8px]">
              {snapshots.slice(0, 5).map((item) => (
                <li key={item.id} className="text-[13px]">
                  <span>{item.label}</span>
                  <span className="text-ink/50">
                    {" · "}
                    {new Date(item.createdAt).toLocaleString("uk-UA")}
                    {item.actor ? ` · ${item.actor}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
