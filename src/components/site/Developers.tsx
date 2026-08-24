import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function Developers() {
  const t = useTranslations("developers");
  const tCta = useTranslations("cta");
  const points = t.raw("points") as string[];

  return (
    <section
      id="developers"
      className="mt-[64px] bg-ink-deep text-white md:mt-[100px] xl:mt-[160px]"
    >
      <div className="shell grid grid-cols-1 gap-[32px] py-[56px] md:py-[72px] xl:grid-cols-[485px_1fr] xl:gap-[150px] xl:py-[100px]">
        <div className="flex flex-col items-start gap-[24px] xl:gap-[32px]">
          <Badge>{t("badge")}</Badge>

          <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:max-w-[390px] xl:text-[38px] xl:tracking-[-0.38px]">
            <strong className="font-medium">{t("titleStrong")}</strong>
            <br />
            <span className="font-light">{t("title")}</span>
          </h2>

          <p className="text-[14px] leading-[1.4] text-white/80 md:text-[15px] xl:text-[18px] xl:leading-[1.2] xl:font-light">
            {t("text")}
          </p>

          <Button
            href="#lead"
            variant="accent"
            className="mt-[8px] w-full xl:mt-[24px] xl:w-[332px]"
          >
            {tCta("presentation")}
          </Button>
        </div>

        <ul className="flex flex-col">
          {points.map((point) => (
            <li
              key={point}
              className="flex items-center gap-[24px] border-b border-white/20 py-[20px] transition-colors duration-300 hover:border-white/45 md:gap-[32px] md:py-[24px] xl:gap-[44px] xl:py-[28px]"
            >
              <span className="relative h-[32px] w-[32px] shrink-0 md:h-[36px] md:w-[36px]">
                <Image
                  src="/img/check-neon.webp"
                  alt=""
                  fill
                  sizes="36px"
                  className="object-cover mix-blend-screen"
                />
              </span>
              <p className="text-[14px] leading-[1.35] md:text-[15px] xl:text-[18px] xl:leading-[1.2] xl:font-light">
                {point}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
