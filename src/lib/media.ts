import { copyFile, mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { contentDir, seedDir } from "./paths";

/**
 * Реестр картинок, которыми управляет админка.
 *
 * Лежит отдельно от текстов, потому что фото общие для всех языков —
 * подписи к слайдам переводятся, сам файл один.
 */

export type Slide = { id: string; image: string };

export type Presentation = {
  file: string;
  name: string;
  size: number;
  updatedAt: string;
};

export type Media = {
  caseSlides: Slide[];
  presentation?: Presentation | null;
};

const file = path.join(contentDir, "media.json");

/** Реестр берётся из репозитория, если в CONTENT_DIR его ещё нет */
async function ensureSeeded() {
  try {
    await readFile(file, "utf8");
  } catch {
    await mkdir(contentDir, { recursive: true });
    await copyFile(path.join(seedDir, "media.json"), file).catch(() => {});
  }
}

export async function getMedia(): Promise<Media> {
  await ensureSeeded();
  try {
    const media = JSON.parse(await readFile(file, "utf8")) as Media;
    return { caseSlides: media.caseSlides ?? [], presentation: media.presentation ?? null };
  } catch {
    return { caseSlides: [], presentation: null };
  }
}

export async function saveMedia(media: Media) {
  await mkdir(contentDir, { recursive: true });
  await writeFile(file, `${JSON.stringify(media, null, 2)}\n`, "utf8");
}

/** Идентификатор слайда: латиница из имени файла плюс отметка времени. */
export function makeSlideId(fileName: string, now: number) {
  const base = fileName
    .replace(/\.[^.]+$/, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);

  return `${base || "slide"}-${now.toString(36).slice(-5)}`;
}
