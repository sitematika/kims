import Link from "next/link";
import { getReadiness } from "@/lib/readiness";
import { sectionHref } from "@/lib/section-anchors";
import { listSnapshots } from "@/lib/history";
import { readLeads } from "@/lib/leads";
import { getAdminDict, type AdminDict } from "@/lib/admin-lang";
import { Card } from "@/components/admin/Card";
import { ReadinessRing } from "@/components/admin/ReadinessRing";

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

  const done = checks.filter((c) => c.ok).length;
  const blocking = checks.filter((c) => !c.ok && !c.soft);
  const soft = checks.filter((c) => !c.ok && c.soft);

  const verdict = blocking.length
    ? dict.home.blocking
    : soft.length
      ? dict.home.softOnly
      : dict.home.allGood;

  return (
    <div className="flex max-w-[1000px] flex-col gap-[20px]">
      <header>
        <h1 className="text-[26px] tracking-[-0.4px]">{dict.home.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/55">{dict.home.subtitle}</p>
      </header>

      <Card title={dict.home.readiness}>
        <div className="flex flex-col gap-[20px] md:flex-row md:items-center md:gap-[28px]">
          <ReadinessRing done={done} total={checks.length} label={verdict} />

          <ul className="min-w-0 flex-1">
            {checks.map((check) => (
              <li
                key={check.id}
                className="flex items-start gap-[9px] border-b border-line-soft py-[8px] text-[13px] last:border-b-0"
              >
                <span
                  aria-hidden
                  className={`mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full ${
                    check.ok
                      ? "bg-green-600"
                      : check.soft
                        ? "bg-accent"
                        : "bg-red-600"
                  }`}
                />
                <span className="min-w-0 flex-1">
                  <span className={check.ok ? "text-ink/45" : "text-ink"}>
                    {dict.checks[check.id as keyof AdminDict["checks"]] ??
                      check.id}
                  </span>
                  {check.detail && (
                    <span className="ml-[6px] text-[12px] text-ink/35">
                      {check.detail}
                    </span>
                  )}
                </span>
                {!check.ok && check.href && (
                  <Link
                    href={check.href}
                    className="shrink-0 text-[12px] text-accent transition-opacity hover:opacity-70"
                  >
                    {dict.home.fix}
                  </Link>
                )}
              </li>
            ))}
          </ul>
        </div>
      </Card>

      <Card
        title={dict.home.translations}
        aside={
          <span
            className={`text-[13px] ${emptyTotal ? "text-red-700" : "text-ink/45"}`}
          >
            {emptyTotal
              ? `${dict.section.untranslated} ${emptyTotal}`
              : dict.home.allTranslated}
          </span>
        }
      >
        <div className="flex flex-wrap gap-[8px]">
          {sections.map((s) => (
            <Link
              key={s.section}
              href={sectionHref(s.section)}
              className={`flex items-center gap-[7px] rounded-[8px] border px-[12px] py-[7px] text-[13px] transition-colors ${
                s.empty
                  ? "border-red-200 bg-red-50/50 hover:border-red-400"
                  : "border-line-soft hover:border-line hover:bg-paper"
              }`}
            >
              {dict.sections[s.section as keyof AdminDict["sections"]] ??
                s.section}
              {s.empty > 0 && (
                <span className="rounded-full bg-red-600 px-[6px] py-[1px] text-[11px] leading-[16px] text-white tabular-nums">
                  {s.empty}
                </span>
              )}
            </Link>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2">
        <Card
          title={dict.nav.leads}
          aside={
            <Link
              href="/admin/leads"
              className="text-[13px] text-ink/50 transition-colors hover:text-ink"
            >
              {dict.home.all}
            </Link>
          }
        >
          {leads.length === 0 ? (
            <p className="text-[13px] text-ink/45">{dict.home.noLeads}</p>
          ) : (
            <ul className="flex flex-col">
              {leads.slice(0, 5).map((lead) => (
                <li
                  key={lead.createdAt}
                  className="border-b border-line-soft py-[9px] text-[13px] last:border-b-0 last:pb-0"
                >
                  <span className="block truncate">{lead.name}</span>
                  <span className="text-[12px] text-ink/45">
                    {lead.city} · {new Date(lead.createdAt).toLocaleString("uk-UA")}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card
          title={dict.nav.history}
          aside={
            <Link
              href="/admin/history"
              className="text-[13px] text-ink/50 transition-colors hover:text-ink"
            >
              {dict.home.all}
            </Link>
          }
        >
          {snapshots.length === 0 ? (
            <p className="text-[13px] text-ink/45">{dict.history.empty}</p>
          ) : (
            <ul className="flex flex-col">
              {snapshots.slice(0, 5).map((item) => (
                <li
                  key={item.id}
                  className="border-b border-line-soft py-[9px] text-[13px] last:border-b-0 last:pb-0"
                >
                  <span className="block truncate">{item.label}</span>
                  <span className="text-[12px] text-ink/45">
                    {new Date(item.createdAt).toLocaleString("uk-UA")}
                    {item.actor ? ` · ${item.actor}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
