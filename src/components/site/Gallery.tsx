import Image from "next/image";
import { useTranslations } from "next-intl";

const shots = [
  { src: "/img/gallery-1-sofa.webp", cls: "md:col-span-4 xl:col-span-3" },
  { src: "/img/gallery-2-statue.webp", cls: "md:col-span-8 xl:col-span-3" },
  { src: "/img/gallery-3-hall.webp", cls: "md:col-span-12 xl:col-span-6" },
  { src: "/img/gallery-4-nike.webp", cls: "md:col-span-8" },
  { src: "/img/gallery-5-counter.webp", cls: "md:col-span-4" },
];

export function Gallery() {
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
            key={shot.src}
            className={`relative aspect-[4/3] overflow-hidden rounded-[4px] md:aspect-auto md:h-[240px] xl:h-[305px] ${shot.cls} ${
              i >= 3 ? "xl:h-[407px]" : ""
            }`}
          >
            <Image
              src={shot.src}
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
