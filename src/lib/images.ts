/**
 * Реестр картинок сайта.
 *
 * Ключ — стабильный идентификатор места на странице. Файл можно заменить
 * из админки (перекрытие лежит в media.json), alt-текст переводится и живёт
 * в content/{locale}.json в разделе `alt`.
 */

export const imageSlots = [
  { id: "hero", src: "/img/hero.webp", label: "Первый экран" },
  { id: "gallery1", src: "/img/gallery-1-sofa.webp", label: "Галерея — 1" },
  { id: "gallery2", src: "/img/gallery-2-statue.webp", label: "Галерея — 2" },
  { id: "gallery3", src: "/img/gallery-3-hall.webp", label: "Галерея — 3" },
  { id: "gallery4", src: "/img/gallery-4-nike.webp", label: "Галерея — 4" },
  { id: "gallery5", src: "/img/gallery-5-counter.webp", label: "Галерея — 5" },
  { id: "founder", src: "/img/founder.webp", label: "Фото основателя" },
  { id: "youtube", src: "/img/youtube-cover.webp", label: "Обложка YouTube" },
  {
    id: "package",
    src: "/img/package-reception.webp",
    label: "Пакет партнёра",
  },
  { id: "steps", src: "/img/steps.webp", label: "Шаги" },
] as const;

export type ImageId = (typeof imageSlots)[number]["id"];

export type ResolvedImage = { src: string; alt: string };
export type ResolvedImages = Record<ImageId, ResolvedImage>;

/** Склеивает дефолт из репозитория, замену из админки и переведённый alt */
export function resolveImages(
  overrides: Record<string, string> | undefined,
  alts: Record<string, string> | undefined,
): ResolvedImages {
  const entries = imageSlots.map((slot) => [
    slot.id,
    {
      src: overrides?.[slot.id] || slot.src,
      alt: alts?.[slot.id] ?? "",
    },
  ]);

  return Object.fromEntries(entries) as ResolvedImages;
}
