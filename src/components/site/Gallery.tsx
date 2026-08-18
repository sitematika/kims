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

export function Gallery({ images }: { images: ResolvedImages }) {
  const t = useTranslations("gallery");

  return (
    <section className="shell pt-[56px] md:pt-[80px] xl:pt-[104px]">
      <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[32px]">
        {t("titleStart")} <strong className="font-medium">{t("titleAccent")}</strong>{" "}
        {t("titleEnd")}
      </h2>

      <div className="mt-[28px] grid grid-cols-1 gap-[16px] md:grid-cols-12 md:gap-[20px] xl:mt-[40px] xl:gap-[24px]">
        {shots.map((shot, i) => (
          <div
            key={shot.id}
            className={`group relative aspect-[4/3] overflow-hidden rounded-[4px] md:aspect-auto md:h-[240px] xl:h-[305px] ${shot.cls} ${
              i >= 3 ? "xl:h-[407px]" : ""
            }`}
          >
            <Image
              src={images[shot.id].src}
              alt={images[shot.id].alt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
