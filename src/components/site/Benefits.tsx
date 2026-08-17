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
        <div className="flex flex-col gap-[12px]">
          <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[32px]">
            {t("title")}
          </h2>
          <p className="text-[14px] leading-[1.35] md:text-[16px]">
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
            <div className="shell grid grid-cols-[auto_1fr] items-start gap-x-[20px] gap-y-[8px] py-[24px] md:gap-x-[32px] md:py-[28px] xl:grid-cols-[80px_1fr_1fr] xl:items-center xl:gap-x-[40px] xl:py-[36px]">
              <span className="text-[28px] leading-none font-light text-accent/60 md:text-[32px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-[16px] leading-[1.25] md:text-[18px] xl:text-[20px]">
                {item.title}
              </h3>
              <p className="col-start-2 text-[13px] leading-[1.4] text-ink/70 md:text-[14px] xl:col-start-3">
                {item.text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
