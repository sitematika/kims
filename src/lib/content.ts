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

/**
 * Отдаёт содержимое файла из CONTENT_DIR. Если его там нет — пробует
 * положить туда эталон из репозитория, а если каталог недоступен на запись
 * (нет прав, сборка идёт в изолированном окружении), просто читает эталон.
 * Сайт в любом случае поднимается с текстами; недоступную запись показывает
 * админка в разделе «Настройки и доступ».
 */
async function readSeeded(fileName: string) {
  const target = path.join(contentDir, fileName);
  const seed = path.join(seedDir, fileName);

  try {
    return await readFile(target, "utf8");
  } catch {
    // файла нет — пробуем создать рабочую копию
  }

  const raw = await readFile(seed, "utf8");
  try {
    await mkdir(contentDir, { recursive: true });
    await copyFile(seed, target);
  } catch {
    // каталог недоступен на запись — работаем с эталоном
  }
  return raw;
}

/**
 * Достраивает рабочую копию недостающими ключами из эталона.
 *
 * Без этого всё, что добавлено в код после первого запуска — новая секция,
 * новое поле, изменённая структура блока, — не доехало бы на работающий сайт:
 * рабочая копия создаётся один раз и живёт своей жизнью. Правки заказчика
 * при этом главнее: перезаписываются только отсутствующие и несовместимые
 * по структуре ключи.
 */
export function mergeDefaults(seed: ContentValue, current: ContentValue): ContentValue {
  const seedIsObject =
    seed !== null && typeof seed === "object" && !Array.isArray(seed);
  const currentIsObject =
    current !== null && typeof current === "object" && !Array.isArray(current);

  if (seedIsObject && currentIsObject) {
    const result: ContentNode = { ...(current as ContentNode) };
    for (const [key, value] of Object.entries(seed as ContentNode)) {
      result[key] = mergeDefaults(value, (current as ContentNode)[key]);
    }
    return result;
  }

  // структура поменялась (например, список стал набором ключей) —
  // берём эталон, иначе страница сломается
  if (seedIsObject !== currentIsObject && current !== undefined) return seed;

  if (Array.isArray(seed) && Array.isArray(current)) {
    return current.length === seed.length
      ? current.map((item, i) => mergeDefaults(seed[i], item))
      : current;
  }

  return current === undefined ? seed : current;
}

export async function getContent(locale: Locale): Promise<ContentNode> {
  const [working, seed] = await Promise.all([
    readSeeded(`${locale}.json`),
    readFile(path.join(seedDir, `${locale}.json`), "utf8"),
  ]);

  return mergeDefaults(
    JSON.parse(seed) as ContentNode,
    JSON.parse(working) as ContentNode,
  ) as ContentNode;
}

export async function getAllContent(): Promise<Record<Locale, ContentNode>> {
  const entries = await Promise.all(
    locales.map(async (locale) => [locale, await getContent(locale)] as const),
  );
  return Object.fromEntries(entries) as Record<Locale, ContentNode>;
}

export async function saveContent(locale: Locale, data: ContentNode) {
  // здесь ошибку не глушим: если запись невозможна, админка должна сказать
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

