"use server";

import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { revalidatePath } from "next/cache";
import { locales } from "@/i18n/routing";
import { isAuthorized } from "@/lib/auth";
import { getContent, saveContent, type ContentNode } from "@/lib/content";
import { getMedia, makeSlideId, saveMedia } from "@/lib/media";
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
  if (!(await isAuthorized())) return "Сессия истекла, войдите заново";

  const file = formData.get("file");
  const caption = String(formData.get("caption") ?? "").trim();

  if (!(file instanceof File) || file.size === 0) return "Выберите файл";
  if (!file.type.startsWith("image/")) return "Нужен файл изображения";
  if (file.size > 15 * 1024 * 1024) return "Файл больше 15 МБ";

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
    return "Не удалось обработать изображение";
  }

  const media = await getMedia();
  media.caseSlides.push({ id, image: `${mediaUrlPrefix}/${id}.webp` });
  await saveMedia(media);

  await captionsFor(id, caption);

  revalidatePath("/", "layout");
  return "Слайд добавлен";
}

export async function removeSlide(formData: FormData) {
  if (!(await isAuthorized())) return;

  const id = String(formData.get("id") ?? "");
  const media = await getMedia();
  const slide = media.caseSlides.find((s) => s.id === id);
  if (!slide) return;

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

  const [slide] = media.caseSlides.splice(index, 1);
  media.caseSlides.splice(target, 0, slide);
  await saveMedia(media);

  revalidatePath("/", "layout");
}

export async function uploadPresentation(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "Сессия истекла, войдите заново";

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) return "Выберите файл";
  if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) {
    return "Нужен файл PDF";
  }
  if (file.size > 35 * 1024 * 1024) return "Файл больше 35 МБ";

  const media = await getMedia();

  try {
    await mkdir(uploadsDir, { recursive: true });
    const buffer = Buffer.from(await file.arrayBuffer());
    // имя фиксированное: ссылка на презентацию не меняется при перезаливке
    await writeFile(path.join(uploadsDir, "presentation.pdf"), buffer);
  } catch {
    return "Не удалось сохранить файл";
  }

  media.presentation = {
    file: `${mediaUrlPrefix}/presentation.pdf`,
    name: file.name,
    size: file.size,
    updatedAt: new Date().toISOString(),
  };
  await saveMedia(media);

  revalidatePath("/", "layout");
  return "Презентация обновлена";
}

export async function removePresentation() {
  if (!(await isAuthorized())) return;

  const media = await getMedia();
  media.presentation = null;
  await saveMedia(media);

  try {
    await unlink(path.join(uploadsDir, "presentation.pdf"));
  } catch {
    // файла может уже не быть
  }

  revalidatePath("/", "layout");
}
