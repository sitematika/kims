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
      className="mt-[56px] bg-ink text-white md:mt-[80px] xl:mt-[110px]"
    >
      <div className="shell grid grid-cols-1 gap-[32px] py-[56px] md:py-[72px] xl:grid-cols-2 xl:gap-[80px] xl:py-[104px]">
        <div className="flex flex-col items-start gap-[24px]">
          <Badge>{t("badge")}</Badge>

          <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[32px]">
            <strong className="font-medium">{t("titleStrong")}</strong>
            <br />
            <span className="font-light">{t("title")}</span>
          </h2>

          <p className="text-[14px] leading-[1.4] text-white/80 md:text-[15px]">
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
              className="flex items-center gap-[24px] border-b border-white/20 py-[20px] transition-colors duration-300 hover:border-white/45 md:gap-[32px] md:py-[24px]"
            >
              <span className="relative h-[36px] w-[36px] shrink-0 md:h-[44px] md:w-[44px]">
                <Image
                  src="/img/check-neon.webp"
                  alt=""
                  fill
                  sizes="44px"
                  className="object-contain mix-blend-screen"
                />
              </span>
              <p className="text-[14px] leading-[1.35] md:text-[15px]">
                {point}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
