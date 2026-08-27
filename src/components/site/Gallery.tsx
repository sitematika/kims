import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ImageId, ResolvedImages } from "@/lib/images";

const shots: { id: ImageId; cls: string }[] = [
  { id: "gallery1", cls: "md:col-span-4 xl:col-span-3" },
  { id: "gallery2", cls: "md:col-span-8 xl:col-span-3" },
  { id: "gallery3", cls: "md:col-span-12 xl:col-span-6" },
  { id: "gallery4", cls: "md:col-span-8" },
  { id: "gallery5", cls: "md:col-span-4" },
];

// Мобильная мозаика из макета: две колонки, кадры разной высоты.
// Слева стоят 1-й, 3-й и 5-й снимки, справа — 2-й и 4-й.
const mobileColumns = [
  [0, 2, 4],
  [1, 3],
];
const mobileAspect = [
  "aspect-[158/131]",
  "aspect-[158/214]",
  "aspect-[158/211]",
  "aspect-[158/250]",
  "aspect-[158/110]",
];

export function Gallery({ images }: { images: ResolvedImages }) {
  const t = useTranslations("gallery");

  const shot = (i: number, className: string) => {
    const { id } = shots[i];
    return (
      <div
        key={id}
        className={`group relative overflow-hidden rounded-[4px] ${className}`}
      >
        <Image
          src={images[id].src}
          alt={images[id].alt}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
    );
  };

  return (
    <section id="gallery" className="shell pt-[56px] md:pt-[80px] xl:pt-[104px]">
      <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[38px] xl:tracking-[-0.38px]">
        {t("titleStart")} <strong className="font-medium">{t("titleAccent")}</strong>{" "}
        {t("titleEnd")}
      </h2>

      <div className="mt-[28px] flex gap-[15px] md:hidden">
        {mobileColumns.map((column, ci) => (
          <div key={ci} className="flex flex-1 flex-col gap-[15px]">
            {column.map((i) => shot(i, mobileAspect[i]))}
          </div>
        ))}
      </div>

      <div className="mt-[28px] hidden md:grid md:grid-cols-12 md:gap-[20px] xl:mt-[40px] xl:gap-[24px]">
        {shots.map((s, i) =>
          shot(
            i,
            `md:h-[240px] xl:h-[305px] ${s.cls} ${i >= 3 ? "xl:h-[407px]" : ""}`,
          ),
        )}
      </div>
    </section>
  );
}
