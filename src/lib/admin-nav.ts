import type { AdminDict } from "./admin-lang";

/**
 * Структура меню панели.
 *
 * Разделы контента идут в том же порядке, что и блоки на странице, —
 * так проще найти нужный текст, не помня названий.
 */

export type NavLink = { href: string; label: string };
export type NavGroup = { title: string; links: NavLink[] };

export function buildNav(dict: AdminDict): NavGroup[] {
  const section = (key: keyof AdminDict["sections"]): NavLink => ({
    href: `/admin/${key}`,
    label: dict.sections[key],
  });

  return [
    {
      title: dict.nav.pageTexts,
      links: [
        section("hero"),
        section("stats"),
        section("gallery"),
        section("founder"),
        section("market"),
        section("benefits"),
        section("formats"),
        section("developers"),
        section("package"),
        section("case"),
        section("steps"),
        section("lead"),
        section("invest"),
      ],
    },
    {
      title: dict.nav.siteWide,
      links: [
        section("nav"),
        section("cta"),
        section("footer"),
        { href: "/admin/social", label: dict.nav.social },
      ],
    },
    {
      title: dict.nav.mediaFiles,
      links: [
        { href: "/admin/images", label: dict.nav.images },
        section("alt"),
        { href: "/admin/case-slides", label: dict.nav.caseSlides },
        { href: "/admin/presentation", label: dict.nav.presentation },
      ],
    },
    {
      title: dict.nav.seo,
      links: [
        { href: "/admin/settings", label: dict.nav.settings },
        section("meta"),
      ],
    },
    {
      title: dict.nav.servicePages,
      links: [section("cookies"), section("privacy"), section("notFound")],
    },
    {
      title: dict.nav.operations,
      links: [
        { href: "/admin/leads", label: dict.nav.leads },
        { href: "/admin/history", label: dict.nav.history },
      ],
    },
  ];
}
