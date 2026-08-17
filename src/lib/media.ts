import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";

/**
 * Реестр картинок, которыми управляет админка.
 *
 * Лежит отдельно от текстов, потому что фото общие для всех языков —
 * подписи к слайдам переводятся, сам файл один.
 */

export type Slide = { id: string; image: string };
export type Media = { caseSlides: Slide[] };

const file = path.join(process.cwd(), "content", "media.json");

export async function getMedia(): Promise<Media> {
  try {
    return JSON.parse(await readFile(file, "utf8")) as Media;
  } catch {
    return { caseSlides: [] };
  }
}

export async function saveMedia(media: Media) {
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
