import { copyFile, mkdir, readdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { locales } from "@/i18n/routing";
import { contentDir } from "./paths";

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

export type Snapshot = { id: string; label: string; createdAt: string };

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
      JSON.stringify({ id, label, createdAt }, null, 2),
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
