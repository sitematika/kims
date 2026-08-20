"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/routing";
import { isAuthorized } from "@/lib/auth";
import { getContent, saveContent, type ContentNode } from "@/lib/content";
import { getMedia, makeSlideId, saveMedia } from "@/lib/media";
import { snapshot } from "@/lib/history";
import { mediaUrlPrefix, uploadsDir } from "@/lib/paths";

async function captionsFor(id: string, fallback: string) {
  for (const locale of locales) {
    const content = await getContent(locale);
    const section = content.case as ContentNode;
    const slides = (section.slides ?? {}) as ContentNode;
    slides[id] = slides[id] ?? fallback;
    section.slides = slides;
    await saveContent(locale, content);
  }
}

async function dropCaptions(id: string) {
  for (const locale of locales) {
    const content = await getContent(locale);
    const section = content.case as ContentNode;
    const slides = (section.slides ?? {}) as ContentNode;
    delete slides[id];
    section.slides = slides;
    await saveContent(locale, content);
  }
}

export async function addSlide(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const file = formData.get("file");
  const caption = String(formData.get("caption") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) return "pickFile";
  if (!file.type.startsWith("image/")) return "needImage";
  if (file.size > 15 * 1024 * 1024) return "tooBig";

  await snapshot("Слайдер кейса: добавлен слайд");

  const id = makeSlideId(file.name, Date.now());

  try {
    await mkdir(uploadsDir, { recursive: true });
    const source = Buffer.from(await file.arrayBuffer());
    // тот же пресет, что и у остальных фото сайта
    const webp = await sharp(source)
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();

    await writeFile(path.join(uploadsDir, `${id}.webp`), webp);
  } catch {
    return "imageFailed";
  }

  const media = await getMedia();
  media.caseSlides.push({ id, image: `${mediaUrlPrefix}/${id}.webp` });
  await saveMedia(media);

  await captionsFor(id, caption);

  revalidatePath("/", "layout");
  return "slideAdded";
}

export async function removeSlide(formData: FormData) {
  if (!(await isAuthorized())) return;

  const id = String(formData.get("id") ?? "");
  const media = await getMedia();
  const slide = media.caseSlides.find((s) => s.id === id);
  if (!slide) return;

  await snapshot("Слайдер кейса: удалён слайд");

  media.caseSlides = media.caseSlides.filter((s) => s.id !== id);
  await saveMedia(media);
  await dropCaptions(id);

  // файлы из public/img — общие ассеты сайта, удаляем только свои загрузки
  if (slide.image.startsWith(`${mediaUrlPrefix}/`)) {
    try {
      await unlink(path.join(uploadsDir, path.basename(slide.image)));
    } catch {
      // файла может уже не быть — это не ошибка
    }
  }

  revalidatePath("/", "layout");
}

export async function moveSlide(formData: FormData) {
  if (!(await isAuthorized())) return;

  const id = String(formData.get("id") ?? "");
  const direction = formData.get("direction") === "up" ? -1 : 1;

  const media = await getMedia();
  const index = media.caseSlides.findIndex((s) => s.id === id);
  const target = index + direction;
  if (index < 0 || target < 0 || target >= media.caseSlides.length) return;

  await snapshot("Слайдер кейса: изменён порядок");

  const [slide] = media.caseSlides.splice(index, 1);
  media.caseSlides.splice(target, 0, slide);
  await saveMedia(media);

  revalidatePath("/", "layout");
}

export async function uploadPresentation(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const locale = String(formData.get("locale") ?? "");
  if (!locales.includes(locale as (typeof locales)[number])) return "noSection";

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return "pickFile";
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "needPdf";
  }
  if (file.size > 35 * 1024 * 1024) return "tooBig";

  const media = await getMedia();
  // имя фиксированное для языка: ссылка не меняется при перезаливке
  const fileName = `presentation-${locale}.pdf`;

  try {
    await mkdir(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(path.join(uploadsDir, fileName), buffer);
  } catch {
    return "saveFailed";
  }

  await snapshot(`Презентация: ${locale}`);

  media.presentations = {
    ...(media.presentations ?? {}),
    [locale]: {
      file: `${mediaUrlPrefix}/${fileName}`,
      name: file.name,
      size: file.size,
      updatedAt: new Date().toISOString(),
    },
  };
  // старое общее поле больше не используется
  media.presentation = null;
  await saveMedia(media);

  revalidatePath("/", "layout");
  return "presentationUpdated";
}

export async function removePresentation(formData: FormData) {
  if (!(await isAuthorized())) return;

  const locale = String(formData.get("locale") ?? "");
  const media = await getMedia();
  const current = media.presentations?.[locale];
  if (!current) return;

  await snapshot(`Презентация удалена: ${locale}`);

  const rest = { ...(media.presentations ?? {}) };
  delete rest[locale];
  media.presentations = rest;
  media.presentation = null;
  await saveMedia(media);

  await unlink(path.join(uploadsDir, path.basename(current.file))).catch(() => {});

  revalidatePath("/", "layout");
}

/** Заменить картинку на сайте: слот из imageSlots -> загруженный файл */
export async function replaceImage(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const slot = String(formData.get("slot") ?? "");
  const file = formData.get("file");
  if (!slot) return "noSection";
  if (!(file instanceof File) || file.size === 0) return "pickFile";
  if (!file.type.startsWith("image/")) return "needImage";
  if (file.size > 25 * 1024 * 1024) return "tooBig";

  await snapshot("Картинки сайта: замена фото");

  const name = `slot-${slot}-${Date.now().toString(36).slice(-5)}.webp`;

  try {
    await mkdir(uploadsDir, { recursive: true });
    const webp = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize({ width: 2400, height: 2400, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
    await writeFile(path.join(uploadsDir, name), webp);
  } catch {
    return "imageFailed";
  }

  const media = await getMedia();
  const images = { ...(media.images ?? {}) };
  const previous = images[slot];
  images[slot] = `${mediaUrlPrefix}/${name}`;
  media.images = images;
  await saveMedia(media);

  // старую замену подчищаем, дефолт из репозитория не трогаем
  if (previous?.startsWith(`${mediaUrlPrefix}/`)) {
    await unlink(path.join(uploadsDir, path.basename(previous))).catch(() => {});
  }

  revalidatePath("/", "layout");
  return "imageUpdated";
}

/** Вернуть картинку из макета вместо загруженной */
export async function resetImage(formData: FormData) {
  if (!(await isAuthorized())) return;

  const slot = String(formData.get("slot") ?? "");
  const media = await getMedia();
  const images = { ...(media.images ?? {}) };
  const previous = images[slot];
  if (!previous) return;

  await snapshot("Картинки сайта: возврат к макету");

  delete images[slot];
  media.images = images;
  await saveMedia(media);

  if (previous.startsWith(`${mediaUrlPrefix}/`)) {
    await unlink(path.join(uploadsDir, path.basename(previous))).catch(() => {});
  }

  revalidatePath("/", "layout");
}

/** Картинка превью для соцсетей: приводим к 1200x630 */
export async function uploadOgImage(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return "pickFile";
  if (!file.type.startsWith("image/")) return "needImage";

  try {
    await mkdir(uploadsDir, { recursive: true });
    const jpeg = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate()
      .resize(1200, 630, { fit: "cover" })
      .jpeg({ quality: 86 })
      .toBuffer();
    await writeFile(path.join(uploadsDir, "og.jpg"), jpeg);
  } catch {
    return "imageFailed";
  }

  const media = await getMedia();
  await snapshot("Превью для соцсетей");

  media.ogImage = `${mediaUrlPrefix}/og.jpg`;
  await saveMedia(media);

  revalidatePath("/", "layout");
  return "ogUpdated";
}

export async function removeOgImage() {
  if (!(await isAuthorized())) return;

  const media = await getMedia();
  media.ogImage = null;
  await saveMedia(media);
  await unlink(path.join(uploadsDir, "og.jpg")).catch(() => {});

  revalidatePath("/", "layout");
}

/** Адреса соцсетей: общие для всех языков, подписи правятся в разделе «Футер» */
export async function saveSocialLinks(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const links: Record<string, string> = {};
  for (const [name, value] of formData.entries()) {
    if (!name.startsWith("link::") || typeof value !== "string") continue;
    const url = value.trim();
    if (!url) continue;
    if (!/^https?:\/\/.+/.test(url)) {
      return "badUrl";
    }
    links[name.slice("link::".length)] = url;
  }

  await snapshot("Ссылки на соцсети");

  const media = await getMedia();
  media.socialLinks = links;
  await saveMedia(media);

  revalidatePath("/", "layout");
  return "linksSaved";
}
