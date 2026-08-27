import { locales, type Locale } from "@/i18n/routing";
import { getAllContent, flattenFields, type ContentNode } from "./content";
import { getMedia } from "./media";
import { getSettings } from "./settings";
import { notifyStatus } from "./notify";
import { getUsers } from "./users";
import { imageSlots } from "./images";

/**
 * Проверка готовности сайта к запуску.
 *
 * Собирает в одном месте то, что легко упустить и что видно только снаружи:
 * незаполненные переводы, пустые alt, отсутствующее превью для соцсетей,
 * незалитые презентации, некому слать заявки. Каждая строка — либо «готово»,
 * либо конкретное «чего не хватает» со ссылкой на нужный раздел.
 */

export type Check = {
  id: string;
  ok: boolean;
  /** Мягкое замечание: на запуск не влияет, но лучше поправить */
  soft?: boolean;
  detail?: string;
  href?: string;
};

export type SectionStat = { section: string; total: number; empty: number };

export type Readiness = {
  checks: Check[];
  sections: SectionStat[];
  /** Сколько незаполненных полей всего */
  emptyTotal: number;
};

function emptyFields(all: Record<Locale, ContentNode>, section: string) {
  const source = all.uk[section];
  if (source === undefined) return { total: 0, empty: 0 };

  const paths = flattenFields(source, section)
    .map((f) => f.path)
    // подписи слайдов правятся рядом с кадрами, в разделе их нет
    .filter((path) => !path.startsWith("case.slides."));
  let empty = 0;

  for (const path of paths) {
    for (const locale of locales) {
      const value = path
        .split(".")
        .reduce<unknown>(
          (acc, key) =>
            acc && typeof acc === "object"
              ? (acc as Record<string, unknown>)[key]
              : undefined,
          all[locale],
        );
      if (typeof value !== "string" || !value.trim()) empty += 1;
    }
  }

  return { total: paths.length, empty };
}

export async function getReadiness(): Promise<Readiness> {
  const [all, media, settings, channels, users] = await Promise.all([
    getAllContent(),
    getMedia(),
    getSettings(),
    notifyStatus(),
    getUsers(),
  ]);

  const sections = Object.keys(all.uk)
    .filter((key) => !key.startsWith("_"))
    .map((section) => ({ section, ...emptyFields(all, section) }))
    .filter((s) => s.total > 0);

  const emptyTotal = sections.reduce((sum, s) => sum + s.empty, 0);

  const alts = all.uk.alt as Record<string, string> | undefined;
  const missingAlt = imageSlots.filter((slot) => !alts?.[slot.id]?.trim());

  const missingPresentations = locales.filter(
    (locale) => !media.presentations?.[locale],
  );

  const socialLinks = media.socialLinks ?? {};
  const filledLinks = Object.values(socialLinks).filter(Boolean).length;

  const checks: Check[] = [
    {
      id: "siteUrl",
      ok: Boolean(settings.siteUrl),
      href: "/admin/seo",
    },
    {
      id: "translations",
      ok: emptyTotal === 0,
      detail: String(emptyTotal),
    },
    {
      id: "alt",
      ok: missingAlt.length === 0,
      soft: true,
      detail: missingAlt.map((s) => s.id).join(", "),
      href: "/admin/images",
    },
    {
      id: "ogImage",
      ok: Boolean(media.ogImage),
      soft: true,
      href: "/admin/seo",
    },
    {
      id: "presentation",
      ok: missingPresentations.length === 0,
      soft: missingPresentations.length < locales.length,
      detail: missingPresentations.join(", ").toUpperCase(),
      href: "/admin/presentation",
    },
    {
      id: "leadChannels",
      ok: channels.email || channels.telegram,
      detail: [
        channels.telegram ? "Telegram" : null,
        channels.email ? "email" : null,
      ]
        .filter(Boolean)
        .join(" + "),
      href: "/admin/leads",
    },
    {
      id: "social",
      ok: filledLinks > 0,
      soft: true,
      detail: String(filledLinks),
      href: "/admin/footer",
    },
    {
      id: "users",
      ok: users.length > 0,
      soft: true,
      detail: String(users.length),
      href: "/admin/users",
    },
    {
      id: "indexing",
      ok: settings.indexing,
      href: "/admin/seo",
    },
  ];

  return { checks, sections, emptyTotal };
}
