import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";

type Item = {
  label: string;
  name: string;
  text: string;
  tagA: string;
  tagB: string;
};

export function Formats() {
  const t = useTranslations("formats");
  const tCta = useTranslations("cta");
  const items = t.raw("items") as Item[];

  return (
    <section id="formats" className="shell pt-[56px] md:pt-[80px] xl:pt-[110px]">
      <Badge>{t("badge")}</Badge>

      <div className="mt-[24px] grid grid-cols-1 gap-[16px] md:grid-cols-2 md:items-end xl:mt-[40px]">
        {/* ширина как в макете — заголовок ложится в три строки */}
        <h2 className="max-w-[520px] text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:max-w-[420px] xl:text-[38px] xl:tracking-[-0.38px]">
          {t("title")}
        </h2>
        <p className="text-[14px] leading-[1.2] font-light md:text-right md:text-[16px] xl:text-[20px]">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-[28px] grid grid-cols-1 gap-[20px] xl:mt-[40px] xl:grid-cols-2 xl:gap-[28px]">
        {items.map((item, i) => {
          const dark = i === 1;
          return (
            <article
              key={item.name}
              className={`group flex flex-col rounded-[8px] px-[24px] py-[32px] transition-shadow duration-300 md:px-[48px] md:py-[56px] xl:p-[52px] ${
                dark
                  ? "bg-ink text-white hover:shadow-[0_6px_18px_rgba(30,30,30,0.14)]"
                  : "bg-blush-50 text-ink hover:shadow-[0_6px_18px_rgba(30,30,30,0.08)]"
              }`}
            >
              <p
                className={`text-[13px] tracking-[1px] uppercase md:text-[14px] xl:text-[16px] xl:font-light xl:tracking-[0.32px] ${
                  dark ? "text-white/60" : "text-ink/60"
                }`}
              >
                {item.label}
              </p>

              <h3 className="mt-[20px] text-[24px] leading-[1.2] tracking-[-0.5px] uppercase md:mt-[28px] md:text-[32px] xl:mt-[40px] xl:tracking-[-0.32px]">
                {item.name}
              </h3>

              {/* flex-1 прижимает разделитель и теги к низу карточки, поэтому
                  в обеих карточках они на одной линии при любой длине текста */}
              <p
                className={`mt-[20px] flex-1 text-[14px] leading-[1.4] md:mt-[28px] md:text-[15px] xl:text-[18px] xl:leading-[1.2] xl:font-light ${
                  dark ? "text-white/80" : "text-ink/80"
                }`}
              >
                {item.text}
              </p>

              <hr
                className={`mt-[28px] mb-[20px] md:mt-[40px] md:mb-[24px] ${
                  dark ? "border-white/20" : "border-ink/15"
                }`}
              />

              <div
                className={`flex flex-wrap gap-x-[40px] gap-y-[8px] text-[13px] tracking-[1px] uppercase md:text-[14px] xl:gap-x-[72px] xl:text-[16px] xl:font-light xl:tracking-[0.32px] ${
                  dark ? "text-white/60" : "text-ink/60"
                }`}
              >
                <span>{item.tagA}</span>
                <span>{item.tagB}</span>
              </div>

              <a
                href="#lead"
                className="mt-[28px] inline-flex w-fit items-center gap-[12px] text-[14px] underline underline-offset-[6px] transition-opacity hover:opacity-70 md:mt-[40px] md:text-[16px]"
              >
                {tCta("more")}
                <span
                  aria-hidden
                  className="transition-transform duration-300 group-hover:translate-x-[6px]"
                >
                  →
                </span>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
