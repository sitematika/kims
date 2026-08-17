import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

/** Тёмная полоса «Інвестиції від € 200 000» — повторяется на странице трижды */
export function InvestBand({ className = "" }: { className?: string }) {
  const t = useTranslations("invest");
  const tCta = useTranslations("cta");

  return (
    <section className={`shell ${className}`}>
      <div className="flex flex-col gap-[24px] rounded-[4px] bg-ink px-[24px] py-[28px] text-white md:px-[40px] md:py-[36px] xl:flex-row xl:items-center xl:justify-between xl:px-[60px] xl:py-[56px]">
        <p className="text-[18px] leading-[1.35] tracking-[-0.4px] uppercase md:text-[24px] xl:text-[32px]">
          {t("label")} <span className="text-accent">{t("value")}</span>
          <br />
          {t("paybackLabel")}{" "}
          <span className="text-accent">{t("paybackValue")}</span>
        </p>

        <Button
          href="#lead"
          variant="accent"
          className="w-full shrink-0 xl:w-[320px]"
        >
          {tCta("lead")}
        </Button>
      </div>
    </section>
  );
}
