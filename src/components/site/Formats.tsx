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

      <div className="mt-[24px] grid grid-cols-1 gap-[16px] md:grid-cols-2 md:items-end xl:mt-[32px]">
        <h2 className="max-w-[520px] text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[32px]">
          {t("title")}
        </h2>
        <p className="text-[14px] md:text-right md:text-[16px]">
          {t("subtitle")}
        </p>
      </div>

      <div className="mt-[28px] grid grid-cols-1 gap-[20px] xl:mt-[40px] xl:grid-cols-2 xl:gap-[24px]">
        {items.map((item, i) => {
          const dark = i === 1;
          return (
            <article
              key={item.name}
              className={`flex flex-col rounded-[4px] px-[24px] py-[32px] md:px-[48px] md:py-[56px] ${
                dark ? "bg-ink text-white" : "bg-blush-50 text-ink"
              }`}
            >
              <p
                className={`text-[13px] tracking-[1px] uppercase md:text-[14px] ${
                  dark ? "text-white/50" : "text-ink/50"
                }`}
              >
                {item.label}
              </p>

              <h3 className="mt-[20px] text-[24px] leading-none tracking-[-0.5px] uppercase md:mt-[28px] md:text-[32px]">
                {item.name}
              </h3>

              <p
                className={`mt-[20px] text-[14px] leading-[1.4] md:mt-[28px] md:text-[15px] ${
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
                className={`flex flex-wrap gap-x-[40px] gap-y-[8px] text-[13px] tracking-[1px] uppercase md:text-[14px] ${
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
                <span aria-hidden>→</span>
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
