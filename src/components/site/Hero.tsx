import Image from "next/image";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/Button";

export function Hero() {
  const t = useTranslations("hero");
  const tCta = useTranslations("cta");

  return (
    <section id="kims" className="relative isolate overflow-hidden">
      {/* Фон-фото на всю ширину с белой вуалью, как в макете */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/img/hero.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-white/40" />
      </div>

      {/* Надпись со стены — только на широких экранах, где для неё есть место */}
      <p
        aria-hidden
        className="absolute top-[76px] left-[var(--shell-pad)] hidden text-[42px] leading-none font-medium text-blush-400 opacity-50 xl:block"
      >
        KIMS
        <span className="mt-[6px] block font-normal">
          We&nbsp; love&nbsp; people.
          <br />
          People&nbsp; love&nbsp; life
        </span>
      </p>

      <div className="shell pt-[40px] pb-[48px] md:pt-[56px] md:pb-[72px] xl:pt-[76px] xl:pb-[110px]">
        <div className="flex flex-col gap-[32px] xl:ml-auto xl:w-[639px] xl:gap-[68px]">
          <div className="flex flex-col gap-[20px] md:gap-[32px]">
            <p className="inline-flex w-fit items-center rounded-[4px] bg-blush-50 px-[21px] py-[12px] text-[14px] md:h-[48px] md:py-0 md:text-[16px] md:tracking-[-0.32px]">
              {t("badge")}
            </p>

            <h1 className="max-w-[560px] text-[24px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[36px] xl:max-w-none xl:text-[40px] xl:tracking-[-0.8px]">
              {t("title")}
            </h1>

            <div className="flex max-w-[514px] flex-col gap-[16px] text-[15px] leading-[1.2] md:text-[16px] xl:text-[18px]">
              <p>{t("lead")}</p>
              <p>{t("text")}</p>
            </div>
          </div>

          <div className="flex flex-col gap-[16px] md:max-w-[320px] xl:max-w-none xl:flex-row xl:items-center xl:gap-[32px]">
            <Button href="#lead" variant="dark" className="w-full xl:w-auto xl:min-w-[287px]">
              {tCta("franchise")}
            </Button>
            <Button
              href="#formats"
              variant="blush"
              className="w-full xl:w-auto xl:min-w-[286px]"
            >
              {tCta("formats")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
