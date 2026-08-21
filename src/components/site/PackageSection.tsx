import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import type { ResolvedImages } from "@/lib/images";

function List({
  title,
  items,
  tone,
  children,
}: {
  title: string;
  items: string[];
  tone: "light" | "blush";
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col rounded-[8px] px-[20px] py-[28px] md:px-[32px] md:py-[40px] xl:px-[52px] xl:py-[52px] ${
        tone === "blush" ? "bg-blush-50" : "border border-blush-50 bg-white"
      }`}
    >
      <p className="text-[13px] tracking-[1px] text-ink/50 uppercase md:text-[14px] xl:text-[16px] xl:font-light xl:tracking-[0.32px]">
        {title}
      </p>

      <ul className="mt-[16px] flex flex-col md:mt-[24px] xl:mt-[28px]">
        {items.map((item) => (
          <li
            key={item}
            className="border-t border-ink/10 py-[16px] text-[14px] leading-[1.35] md:py-[20px] md:text-[15px] xl:py-[12px] xl:text-[18px] xl:leading-[1.2] xl:font-light xl:tracking-[-0.18px]"
          >
            {item}
          </li>
        ))}
      </ul>

      {children}
    </div>
  );
}

export function PackageSection({ images }: { images: ResolvedImages }) {
  const t = useTranslations("package");

  return (
    <section id="package" className="shell pt-[56px] md:pt-[80px] xl:pt-[110px]">
      <Badge>{t("badge")}</Badge>

      <div className="mt-[24px] grid grid-cols-1 gap-[16px] md:grid-cols-2 md:items-end xl:mt-[40px]">
        {/* ширина как в макете: заголовок ложится в четыре строки */}
        <h2 className="max-w-[560px] text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:max-w-[470px] xl:text-[38px] xl:tracking-[-0.38px]">
          {t("title")}
        </h2>
        <p className="text-[14px] leading-[1.2] font-light md:text-right md:text-[16px] xl:text-[20px]">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-[28px] grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:mt-[40px] xl:gap-[28px]">
        <List
          title={t("beforeTitle")}
          items={t.raw("before") as string[]}
          tone="light"
        />
        <List
          title={t("afterTitle")}
          items={t.raw("after") as string[]}
          tone="blush"
        >
          {/* пропорции кадра из макета — широкая полоса, а не квадрат */}
          <div className="relative mt-[24px] aspect-[485/183] overflow-hidden rounded-[8px] xl:mt-[40px]">
            <Image
              src={images.package.src}
              alt={images.package.alt}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </List>
      </div>
    </section>
  );
}
