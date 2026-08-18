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
  /** Замены картинок сайта: id слота -> путь к загруженному файлу */
  images?: Record<string, string>;
  /** Картинка для превью в соцсетях */
  ogImage?: string | null;
};

const file = path.join(contentDir, "media.json");

/** Реестр из CONTENT_DIR, с откатом на эталон из репозитория */
async function readRegistry() {
  try {
    return await readFile(file, "utf8");
  } catch {
    // рабочей копии ещё нет
  }

  const seed = path.join(seedDir, "media.json");
  const raw = await readFile(seed, "utf8");
  try {
    await mkdir(contentDir, { recursive: true });
    await copyFile(seed, file);
  } catch {
    // каталог недоступен на запись — работаем с эталоном
  }
  return raw;
}

export async function getMedia(): Promise<Media> {
  try {
    const media = JSON.parse(await readRegistry()) as Media;
    return {
      caseSlides: media.caseSlides ?? [],
      presentation: media.presentation ?? null,
      images: media.images ?? {},
      ogImage: media.ogImage ?? null,
    };
  } catch {
    return { caseSlides: [], presentation: null, images: {}, ogImage: null };
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
