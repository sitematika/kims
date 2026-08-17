import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { locales, type Locale } from "@/i18n/routing";

/**
 * Хранилище контента сайта.
 *
 * Сейчас — JSON-файлы в content/. Работает локально и на VPS.
 * Если сайт поедет на serverless (Vercel), файловая система там только на
 * чтение: тогда меняется только этот модуль — на таблицу в Postgres, —
 * а весь остальной код остаётся как есть.
 */

export type ContentValue = string | number | ContentNode | ContentValue[];
export type ContentNode = { [key: string]: ContentValue };

const dir = path.join(process.cwd(), "content");

export async function getContent(locale: Locale): Promise<ContentNode> {
  const raw = await readFile(path.join(dir, `${locale}.json`), "utf8");
  return JSON.parse(raw) as ContentNode;
}

export async function getAllContent(): Promise<Record<Locale, ContentNode>> {
  const entries = await Promise.all(
    locales.map(async (locale) => [locale, await getContent(locale)] as const),
  );
  return Object.fromEntries(entries) as Record<Locale, ContentNode>;
}

export async function saveContent(locale: Locale, data: ContentNode) {
  await writeFile(
    path.join(dir, `${locale}.json`),
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );
}

/** Путь вида "hero.title" или "benefits.items.0.text" */
export function readPath(node: ContentValue, dotted: string): ContentValue {
  return dotted
    .split(".")
    .reduce<ContentValue | undefined>(
      (acc, key) =>
        acc && typeof acc === "object"
          ? (acc as ContentNode)[key] ??
            (Array.isArray(acc) ? acc[Number(key)] : undefined)
          : undefined,
      node,
    ) as ContentValue;
}

export function writePath(node: ContentNode, dotted: string, value: string) {
  const keys = dotted.split(".");
  const last = keys.pop();
  if (!last) return;

  let cursor: ContentValue = node;
  for (const key of keys) {
    if (cursor === null || typeof cursor !== "object") return;
    cursor = Array.isArray(cursor)
      ? cursor[Number(key)]
      : (cursor as ContentNode)[key];
  }

  if (cursor === null || typeof cursor !== "object") return;
  if (Array.isArray(cursor)) cursor[Number(last)] = value;
  else (cursor as ContentNode)[last] = value;
}

/** Плоский список всех текстовых полей документа, в порядке появления. */
export function flattenFields(
  node: ContentValue,
  prefix = "",
): { path: string; value: string }[] {
  if (typeof node === "string") return [{ path: prefix, value: node }];
  if (typeof node === "number") return [{ path: prefix, value: String(node) }];

  if (Array.isArray(node)) {
    return node.flatMap((item, i) =>
      flattenFields(item, prefix ? `${prefix}.${i}` : String(i)),
    );
  }

  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) =>
      flattenFields(value, prefix ? `${prefix}.${key}` : key),
    );
  }

  return [];
}

/** Разделы для меню админки: ключ верхнего уровня -> человеческое название. */
export const sectionLabels: Record<string, string> = {
  meta: "SEO и мета-теги",
  nav: "Меню и шапка",
  cta: "Кнопки",
  hero: "Первый экран",
  stats: "Цифры",
  gallery: "Галерея",
  invest: "Полоса «Инвестиции»",
  founder: "От основателя",
  market: "О бренде и рынке",
  benefits: "Что вы получаете",
  formats: "Форматы",
  developers: "Для девелоперов",
  package: "Пакет партнёра",
  case: "Кейс Риги",
  steps: "Шаги",
  lead: "Форма заявки",
  footer: "Футер",
};
