import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { locales, type Locale } from "@/i18n/routing";
import { contentDir } from "./paths";
import { currentActor } from "./auth";
import { flattenFields, type ContentNode } from "./content";

/**
 * История правок контента.
 *
 * Перед каждым сохранением из админки складываем полный снимок текстов
 * и реестра медиа. Публикация остаётся мгновенной, но любую правку можно
 * откатить в один клик — включая случайную и сделанную не тем человеком.
 */

const historyDir = path.join(contentDir, ".history");
const KEEP = 30;
const files = [...locales.map((l) => `${l}.json`), "media.json"];

export type Snapshot = {
  id: string;
  label: string;
  createdAt: string;
  /** Кто правил. У снимков, сделанных до учётных записей, поля нет */
  actor?: string;
};

async function readMeta(id: string): Promise<Snapshot | null> {
  try {
    const raw = await readFile(path.join(historyDir, id, "meta.json"), "utf8");
    return JSON.parse(raw) as Snapshot;
  } catch {
    return null;
  }
}

/** Снимок текущего состояния. label — что именно правили */
export async function snapshot(label: string) {
  const createdAt = new Date().toISOString();
  // автора берём из сессии сами: иначе его пришлось бы тащить через
  // каждое серверное действие, и где-нибудь он бы потерялся
  const actor = (await currentActor())?.name;
  const id = createdAt.replace(/[:.]/g, "-");
  const dir = path.join(historyDir, id);

  try {
    await mkdir(dir, { recursive: true });
    for (const name of files) {
      await copyFile(path.join(contentDir, name), path.join(dir, name)).catch(
        () => {},
      );
    }
    await writeFile(
      path.join(dir, "meta.json"),
      JSON.stringify({ id, label, createdAt, actor }, null, 2),
      "utf8",
    );
  } catch {
    // история — вспомогательная вещь, её сбой не должен ломать сохранение
    return;
  }

  await prune();
}

async function prune() {
  try {
    const ids = (await readdir(historyDir)).sort().reverse();
    for (const id of ids.slice(KEEP)) {
      await rm(path.join(historyDir, id), { recursive: true, force: true });
    }
  } catch {
    // каталога может ещё не быть
  }
}

export async function listSnapshots(): Promise<Snapshot[]> {
  try {
    const ids = (await readdir(historyDir)).sort().reverse();
    const metas = await Promise.all(ids.map(readMeta));
    return metas.filter((m): m is Snapshot => Boolean(m));
  } catch {
    return [];
  }
}

/** Возвращает тексты и реестр медиа к состоянию снимка */
export async function restore(id: string) {
  const meta = await readMeta(id);
  if (!meta) return false;

  // перед откатом сохраняем текущее состояние — чтобы откат тоже был обратим
  await snapshot("Перед откатом");

  const dir = path.join(historyDir, id);
  for (const name of files) {
    await copyFile(path.join(dir, name), path.join(contentDir, name)).catch(
      () => {},
    );
  }
  return true;
}


/**
 * Что изменилось между снимком и следующим за ним состоянием.
 *
 * Снимок делается ПЕРЕД правкой, поэтому «что поменяли» — это разница
 * с предыдущим по времени снимком, а для самого свежего — с текущими
 * текстами. Иначе откат приходится делать вслепую.
 */
export type Change = { path: string; locale: Locale; before: string; after: string };

async function readTexts(dir: string) {
  const result = {} as Record<Locale, ContentNode>;
  for (const locale of locales) {
    try {
      const raw = await readFile(path.join(dir, `${locale}.json`), "utf8");
      result[locale] = JSON.parse(raw) as ContentNode;
    } catch {
      result[locale] = {};
    }
  }
  return result;
}

export async function changesOf(id: string): Promise<Change[]> {
  const ids = (await readdir(historyDir).catch(() => [])).sort().reverse();
  const index = ids.indexOf(id);
  if (index < 0) return [];

  // предыдущий по времени снимок лежит ниже в списке; для самого свежего
  // сравниваем с тем, что на сайте прямо сейчас
  const older = path.join(historyDir, id);
  const newer = index === 0 ? contentDir : path.join(historyDir, ids[index - 1]);

  const [before, after] = await Promise.all([
    readTexts(older),
    readTexts(newer),
  ]);

  const changes: Change[] = [];
  for (const locale of locales) {
    const beforeMap = new Map(
      flattenFields(before[locale]).map((f) => [f.path, f.value]),
    );
    for (const field of flattenFields(after[locale])) {
      const was = beforeMap.get(field.path);
      if (was !== undefined && was !== field.value) {
        changes.push({
          path: field.path,
          locale,
          before: was,
          after: field.value,
        });
      }
    }
  }

  return changes;
}
