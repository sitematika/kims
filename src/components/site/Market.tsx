import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";

type Figure = { value: string; text: string };
type Pillar = { title: string; text: string };

export function Market() {
  const t = useTranslations("market");
  const figures = t.raw("figures") as Figure[];
  const pillars = t.raw("pillars") as Pillar[];

  return (
    <section
      id="brand"
      className="mt-[56px] bg-ink text-white md:mt-[80px] xl:mt-[110px]"
    >
      <div className="shell py-[56px] md:py-[72px] xl:py-[104px]">
        <div className="grid grid-cols-1 gap-[24px] md:grid-cols-2 md:gap-[32px] xl:gap-[40px]">
          <div className="flex flex-col gap-[24px]">
            <Badge>{t("badge")}</Badge>
            <h2 className="max-w-[430px] text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[32px]">
              {t("title")}
            </h2>
          </div>

          <div className="flex flex-col gap-[16px] text-[14px] leading-[1.35] md:text-[15px] xl:text-[16px]">
            <p>{t("lead")}</p>
            <p className="text-white/70">{t("text")}</p>
          </div>
        </div>

        <hr className="my-[40px] border-white/15 xl:my-[56px]" />

        <div className="grid grid-cols-1 gap-[32px] sm:grid-cols-2 xl:grid-cols-4">
          {figures.map((f) => (
            <div key={f.value} className="flex flex-col gap-[16px]">
              <p className="text-[36px] leading-none font-light text-blush-300 md:text-[42px] xl:text-[48px]">
                {f.value}
              </p>
              <p className="text-[13px] leading-[1.35] text-white/70 md:text-[14px]">
                {f.text}
              </p>
            </div>
          ))}
        </div>

        <hr className="my-[40px] border-white/15 xl:my-[56px]" />

        <h3 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[32px]">
          <strong className="font-medium">{t("pillarsTitleStrong")}</strong>
          <br />
          <span className="font-light">{t("pillarsTitle")}</span>
        </h3>

        <div className="mt-[28px] grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:mt-[40px] xl:grid-cols-3 xl:gap-[24px]">
          {pillars.map((p, i) => (
            <article
              key={p.title}
              className="flex flex-col gap-[24px] rounded-[2px] border border-white/20 px-[24px] py-[28px] md:px-[32px] md:py-[36px]"
            >
              <p className="text-[28px] leading-none font-light text-white/60 md:text-[32px]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="flex flex-col gap-[12px]">
                <h4 className="text-[17px] leading-[1.25] md:text-[18px]">
                  {p.title}
                </h4>
                <p className="text-[13px] leading-[1.4] text-white/70 md:text-[14px]">
                  {p.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-[32px] text-[12px] leading-[1.4] text-white/40 md:text-[13px] xl:mt-[48px]">
          {t("source")}
        </p>
      </div>
    </section>
  );
}
