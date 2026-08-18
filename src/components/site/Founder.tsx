import Image from "next/image";
import { useTranslations } from "next-intl";
import type { ResolvedImages } from "@/lib/images";

export function Founder({ images }: { images: ResolvedImages }) {
  const t = useTranslations("founder");
  const tCta = useTranslations("cta");

  return (
    <section className="shell pt-[56px] md:pt-[80px] xl:pt-[110px]">
      <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[32px]">
        {t("badge")}
      </h2>

      <div className="relative mt-[28px] grid grid-cols-1 gap-[24px] md:grid-cols-2 md:gap-[32px] xl:mt-[48px] xl:gap-[40px]">
        {/* Крупная кавычка из макета */}
        <img
          src="/img/quote.svg"
          alt=""
          aria-hidden
          className="pointer-events-none absolute -top-[30px] right-[6%] z-0 hidden w-[140px] opacity-60 md:block xl:-top-[48px] xl:w-[213px]"
        />

        <div className="relative aspect-[3/4] overflow-hidden rounded-[4px] md:aspect-[607/700]">
          <Image
            src={images.founder.src}
            alt={images.founder.alt || t("name")}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute bottom-[16px] left-[16px] rounded-[4px] bg-white px-[24px] py-[16px] md:bottom-[20px] md:left-[20px] md:px-[32px] md:py-[20px]">
            <p className="text-[20px] md:text-[24px]">{t("name")}</p>
            <p className="mt-[4px] text-[13px] text-ink/70 md:text-[14px]">
              {t("role")}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-[24px] text-[15px] leading-[1.35] italic md:text-[16px]">
          <div className="flex flex-col gap-[20px]">
            <p>
              <strong className="font-medium">{t("p1Strong")}</strong>{" "}
              {t("p1")}
            </p>
            <p>
              <strong className="font-medium">{t("p2Strong")}</strong> {t("p2")}
            </p>
            <p>
              <strong className="font-medium">{t("p3Strong")}</strong> {t("p3")}
            </p>
          </div>

          <blockquote className="mt-auto rounded-[4px] bg-blush-50 px-[24px] py-[24px] md:px-[32px] md:py-[28px]">
            {t("quoteStart")}{" "}
            <strong className="font-medium">{t("quoteStrong1")}</strong>{" "}
            {t("quoteMid")}{" "}
            <strong className="font-medium">{t("quoteStrong2")}</strong>
          </blockquote>
        </div>
      </div>

      {/* Блок с YouTube */}
      <div className="relative mt-[24px] overflow-hidden rounded-[4px] xl:mt-[32px]">
        {/* TODO: заменить на оригинал от клиента — сейчас кадр вырезан из макета */}
        <div className="relative aspect-[16/10] md:aspect-[1240/440]">
          <Image
            src={images.youtube.src}
            alt={images.youtube.alt}
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="absolute right-[12px] bottom-[12px] left-[12px] flex flex-col gap-[12px] rounded-[4px] bg-white px-[16px] py-[16px] md:flex-row md:items-center md:justify-between md:px-[24px] xl:right-[20px] xl:bottom-[20px] xl:left-[20px]">
          <p className="flex items-center gap-[16px] text-[14px] md:text-[16px]">
            <YoutubeIcon />
            <span>
              {t("youtube")}{" "}
              <span className="font-medium">{t("youtubeLink")}</span>
            </span>
          </p>
          <a
            href="https://www.youtube.com/@kims_ukraine"
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-[40px] shrink-0 items-center justify-center rounded-[2px] bg-ink px-[32px] text-[14px] font-medium text-white transition-colors hover:bg-ink-soft"
          >
            {tCta("go")}
          </a>
        </div>
      </div>
    </section>
  );
}

function YoutubeIcon() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 44 44"
      fill="none"
      aria-hidden
      className="shrink-0"
    >
      <path
        d="M43.0805 11.4125C42.5734 9.52187 41.0867 8.02656 39.1875 7.51953C35.7586 6.6 22 6.6 22 6.6s-13.7586 0-17.1875.91953C2.91328 8.02656 1.42656 9.52187 0.919531 11.4125 0 14.8414 0 22 0 22s0 7.1586.919531 10.5875C1.42656 34.4781 2.91328 35.9734 4.8125 36.4805 8.24141 37.4 22 37.4 22 37.4s13.7586 0 17.1875-.9195c1.8992-.5071 3.3859-2.0024 3.893-3.893C44 29.1586 44 22 44 22s0-7.1586-.9195-10.5875Z"
        fill="#FF0000"
      />
      <path d="M17.6 28.6 29.0164 22 17.6 15.4v13.2Z" fill="#fff" />
    </svg>
  );
}
