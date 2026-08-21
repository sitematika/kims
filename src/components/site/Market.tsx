import Image from "next/image";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/Badge";
import { CountUp } from "@/components/ui/CountUp";
import type { ResolvedImages } from "@/lib/images";

type Figure = { value: string; text: string };
type Pillar = { title: string; text: string };

export function Market({ images }: { images: ResolvedImages }) {
  const t = useTranslations("market");
  const figures = t.raw("figures") as Figure[];
  const pillars = t.raw("pillars") as Pillar[];

  // Заголовок из двух фраз: вторая всегда начинается с новой строки,
  // как в макете. Делим по концу первого предложения, а не жёстким <br>,
  // чтобы текст оставался обычным полем в админке на всех языках.
  const [titleLead, ...titleRest] = t("title").split(/(?<=[.!?])\s+/);
  const titleTail = titleRest.join(" ");

  return (
    <section
      id="brand"
      className="mt-[56px] bg-ink-deep text-white md:mt-[80px] xl:mt-[110px]"
    >
      <div className="shell py-[56px] md:py-[72px] xl:py-[100px]">
        <Badge>{t("badge")}</Badge>

        <div className="mt-[24px] grid grid-cols-1 gap-[24px] md:grid-cols-2 md:gap-[32px] xl:mt-[60px] xl:grid-cols-[580px_1fr] xl:gap-[100px]">
          <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[38px] xl:tracking-[-0.38px]">
            <span className="font-medium">{titleLead}</span>
            {titleTail && (
              <>
                <br />
                {titleTail}
              </>
            )}
          </h2>

          <div className="flex flex-col gap-[16px] text-[14px] leading-[1.35] md:text-[15px] xl:gap-[24px] xl:text-[18px] xl:leading-[1.2]">
            <p>{t("lead")}</p>
            <p className="text-white/70">{t("text")}</p>
          </div>
        </div>

        <hr className="my-[40px] border-white/15 xl:my-[56px]" />

        <div className="grid grid-cols-1 gap-[32px] sm:grid-cols-2 xl:grid-cols-4">
          {figures.map((f) => (
            <div key={f.value} className="flex flex-col gap-[16px] xl:gap-[24px]">
              <p className="text-[36px] leading-none font-light text-blush-300 md:text-[42px] xl:text-[52px]">
                <CountUp>{f.value}</CountUp>
              </p>
              <p className="text-[13px] leading-[1.35] text-white/70 md:text-[14px] xl:text-[16px] xl:leading-[1.2]">
                {f.text}
              </p>
            </div>
          ))}
        </div>

        <hr className="my-[40px] border-white/15 xl:my-[56px]" />

        <h3 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[40px] xl:tracking-[-0.4px]">
          <strong className="font-medium">{t("pillarsTitleStrong")}</strong>
          <br />
          <span className="font-light">{t("pillarsTitle")}</span>
        </h3>

        <div className="mt-[28px] grid grid-cols-1 gap-[20px] md:grid-cols-2 xl:mt-[40px] xl:grid-cols-3 xl:gap-[24px]">
          {pillars.map((p, i) => (
            <article
              key={p.title}
              className="flex flex-col gap-[24px] rounded-[2px] border border-white/20 px-[24px] py-[28px] transition-colors duration-300 hover:border-white/45 hover:bg-white/[0.03] md:px-[32px] md:py-[36px] xl:gap-[40px] xl:px-[40px] xl:py-[44px]"
            >
              <p className="text-[28px] leading-none font-light text-white/60 md:text-[32px] xl:text-[42px]">
                {String(i + 1).padStart(2, "0")}
              </p>
              <div className="flex flex-col gap-[12px] xl:gap-[24px]">
                {/* две строки под заголовок: описания стартуют на одной
                    линии во всех карточках при любом переводе */}
                <h4 className="text-[17px] leading-[1.25] md:min-h-[2.5em] md:text-[18px] xl:min-h-[2.2em] xl:text-[24px] xl:leading-[1.1]">
                  {p.title}
                </h4>
                <p className="text-[13px] leading-[1.4] text-white/70 md:text-[14px] xl:text-[16px] xl:leading-[1.2]">
                  {p.text}
                </p>
              </div>
            </article>
          ))}
        </div>

        {/* Кадр под карточками — только на телефоне и планшете, как в макете */}
        <div className="relative mt-[20px] aspect-[335/250] overflow-hidden rounded-[2px] xl:hidden">
          <Image
            src={images.market.src}
            alt={images.market.alt}
            fill
            sizes="(max-width: 1280px) 100vw, 0px"
            className="object-cover"
          />
        </div>

        <p className="mt-[32px] text-[12px] leading-[1.4] text-white/40 md:text-[13px] xl:mt-[48px] xl:text-[18px] xl:leading-[1.2]">
          {t("source")}
        </p>
      </div>
    </section>
  );
}
