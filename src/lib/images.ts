/**
 * Реестр картинок сайта.
 *
 * Ключ — стабильный идентификатор места на странице. Файл можно заменить
 * из админки (перекрытие лежит в media.json), alt-текст переводится и живёт
 * в content/{locale}.json в разделе `alt`.
 */

export const imageSlots = [
  { id: "hero", src: "/img/hero.webp" },
  { id: "gallery1", src: "/img/gallery-1-sofa.webp" },
  { id: "gallery2", src: "/img/gallery-2-statue.webp" },
  { id: "gallery3", src: "/img/gallery-3-hall.webp" },
  { id: "gallery4", src: "/img/gallery-4-nike.webp" },
  { id: "gallery5", src: "/img/gallery-5-counter.webp" },
  { id: "founder", src: "/img/founder.webp" },
  { id: "youtube", src: "/img/youtube-cover.webp" },
  {
    id: "package",
    src: "/img/package-reception.webp",
  },
  { id: "steps", src: "/img/steps.webp" },
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
