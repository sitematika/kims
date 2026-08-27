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
        { href: "/admin/nav", label: dict.sections.nav },
        { href: "/admin/footer", label: dict.sections.footer },
      ],
    },
    {
      title: dict.nav.mediaFiles,
      links: [
        { href: "/admin/images", label: dict.nav.images },
        { href: "/admin/case-slides", label: dict.nav.caseSlides },
        { href: "/admin/presentation", label: dict.nav.presentation },
      ],
    },
    {
      title: dict.nav.seo,
      links: [
        { href: "/admin/seo", label: dict.nav.seo },
        { href: "/admin/service", label: dict.nav.servicePages },
      ],
    },
    {
      title: dict.nav.operations,
      links: [
        { href: "/admin/leads", label: dict.nav.leads },
        { href: "/admin/history", label: dict.nav.history },
        { href: "/admin/users", label: dict.nav.users },
        { href: "/admin/access", label: dict.nav.access },
      ],
    },
  ];
}
