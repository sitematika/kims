import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";

type Item = { title: string; text: string };

export function Benefits() {
  const t = useTranslations("benefits");
  const items = t.raw("items") as Item[];

  return (
    <section id="benefits" className="pt-[56px] md:pt-[80px] xl:pt-[110px]">
      <div className="shell grid grid-cols-1 gap-[24px] md:grid-cols-2 md:gap-[32px]">
        <Badge>{t("badge")}</Badge>
        <div className="flex flex-col gap-[12px] xl:gap-[24px]">
          <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[38px] xl:tracking-[-0.38px]">
            {t("title")}
          </h2>
          <p className="text-[14px] leading-[1.2] md:text-[16px] xl:text-[18px] xl:tracking-[-0.18px]">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Полосы-зебра идут во всю ширину экрана, как в макете */}
      <div className="mt-[28px] xl:mt-[40px]">
        {items.map((item, i) => (
          <div
            key={item.title}
            className={`transition-colors duration-300 ${
              i % 2 === 0
                ? "bg-blush-50 hover:bg-blush-200/70"
                : "bg-white hover:bg-blush-50/60"
            }`}
          >
            {/* На десктопе левая колонка равна половине сетки шапки минус
                половина зазора — тогда описание начинается ровно под заголовком */}
            <div className="shell grid grid-cols-1 gap-y-[10px] py-[24px] md:py-[28px] xl:grid-cols-[calc(50%-16px)_1fr] xl:items-center xl:gap-x-[32px] xl:py-[36px]">
              <div className="flex items-center gap-[20px] md:gap-[32px] xl:gap-[64px]">
                <span className="w-[40px] shrink-0 text-[28px] leading-none font-light text-accent md:w-[48px] md:text-[32px] xl:w-[62px] xl:text-[42px] xl:tracking-[-0.42px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-[16px] leading-[1.25] md:text-[18px] xl:text-[20px] xl:leading-[1.15]">
                  {item.title}
                </h3>
              </div>
              <p className="pl-[60px] text-[13px] leading-[1.4] text-ink-warm/80 md:pl-[80px] md:text-[14px] xl:pl-0 xl:text-[16px] xl:leading-[1.2] xl:tracking-[-0.16px]">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
