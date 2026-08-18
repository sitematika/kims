import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { locales, type Locale } from "@/i18n/routing";
import { contentDir, seedDir } from "./paths";

/**
 * Хранилище контента сайта.
 *
 * JSON-файлы в каталоге CONTENT_DIR (по умолчанию content/ внутри проекта).
 * На сервере каталог выносится за пределы папки приложения, чтобы редеплой
 * не затирал правки заказчика. Пустой каталог заполняется текстами из
 * репозитория при первом обращении.
 */

export type ContentValue = string | number | ContentNode | ContentValue[];
export type ContentNode = { [key: string]: ContentValue };

/** Копирует эталонный файл в CONTENT_DIR, если его там ещё нет */
async function ensureSeeded(fileName: string) {
  const target = path.join(contentDir, fileName);
  try {
    await readFile(target, "utf8");
  } catch {
    await mkdir(contentDir, { recursive: true });
    await copyFile(path.join(seedDir, fileName), target);
  }
  return target;
}

export async function getContent(locale: Locale): Promise<ContentNode> {
  const target = await ensureSeeded(`${locale}.json`);
  return JSON.parse(await readFile(target, "utf8")) as ContentNode;
}

export async function getAllContent(): Promise<Record<Locale, ContentNode>> {
  const entries = await Promise.all(
    locales.map(async (locale) => [locale, await getContent(locale)] as const),
  );
  return Object.fromEntries(entries) as Record<Locale, ContentNode>;
}

export async function saveContent(locale: Locale, data: ContentNode) {
  await mkdir(contentDir, { recursive: true });
  await writeFile(
    path.join(contentDir, `${locale}.json`),
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
