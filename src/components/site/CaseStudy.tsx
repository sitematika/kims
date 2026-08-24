"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { CountUp } from "@/components/ui/CountUp";

type Year = { year: string; value: string; share: number };
type Slide = { id: string; image: string };

export function CaseStudy({ slides: source }: { slides: Slide[] }) {
  const t = useTranslations("case");
  const years = t.raw("years") as Year[];
  const captions = t.raw("slides") as Record<string, string>;

  // подписи живут в переводах, фото — в реестре медиа: собираем вместе
  const slides = source.map((slide) => ({
    ...slide,
    caption: captions?.[slide.id] ?? "",
  }));
  const [active, setActive] = useState(0);
  const [barsIn, setBarsIn] = useState(false);
  const barsRef = useRef<HTMLDivElement>(null);

  // Полосы выручки заполняются, когда блок доходит до экрана
  useEffect(() => {
    const node = barsRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setBarsIn(true);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -15% 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const go = (dir: -1 | 1) =>
    setActive((i) => (i + dir + slides.length) % slides.length);

  const current = slides[active] ?? slides[0];

  // В DOM держим только текущий кадр и соседние: остальные подгружаются
  // по мере листания, чтобы первый экран не тянул все фото сразу
  const [mounted, setMounted] = useState(() => new Set([0]));
  useEffect(() => {
    const n = slides.length;
    if (!n) return;
    setMounted((prev) => {
      const next = new Set(prev);
      [active, (active + 1) % n, (active - 1 + n) % n].forEach((i) =>
        next.add(i),
      );
      return next.size === prev.size ? prev : next;
    });
  }, [active, slides.length]);

  return (
    <section id="case" className="shell pt-[56px] md:pt-[80px] xl:pt-[110px]">
      <Badge>{t("badge")}</Badge>

      <div className="mt-[24px] grid grid-cols-1 gap-[32px] xl:mt-[32px] xl:grid-cols-2 xl:gap-[40px]">
        <div className="flex flex-col">
          <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[38px] xl:tracking-[-0.38px]">
            {t("titleStart")}{" "}
            <strong className="font-medium">{t("titleAccent")}</strong>
            <br />
            {t("titleEnd")}
          </h2>
          <p className="mt-[12px] text-[13px] text-ink/60 md:text-[14px] xl:mt-[16px] xl:text-[18px]">
            {t("subtitle")}
          </p>

          <div ref={barsRef} className="mt-[24px] flex flex-col xl:mt-[32px]">
            {years.map((y) => (
              <div
                key={y.year}
                className="flex items-center gap-[16px] border-t border-ink/10 py-[20px] last:border-b md:gap-[24px] md:py-[24px]"
              >
                <span className="w-[44px] shrink-0 text-[14px] text-ink/50 md:text-[16px] xl:w-[52px] xl:text-[20px] xl:font-light">
                  {y.year}
                </span>
                <span className="h-[10px] flex-1 rounded-full bg-blush-50">
                  <span
                    className="block h-full rounded-full bg-blush-300 transition-[width] duration-1000 ease-out"
                    style={{ width: barsIn ? `${y.share}%` : "0%" }}
                  />
                </span>
                <span className="shrink-0 text-[18px] font-light md:text-[24px] xl:text-[30px] xl:font-normal">
                  <CountUp align="end">{y.value}</CountUp>
                </span>
              </div>
            ))}
          </div>

          {/* На телефоне — три отдельные карточки, как в макете;
              с планшета они срастаются в одну полосу */}
          <div className="mt-[24px] grid grid-cols-1 gap-[12px] sm:grid-cols-[1fr_auto] sm:gap-0 sm:overflow-hidden sm:rounded-[4px]">
            <div className="rounded-[4px] bg-blush-50 px-[24px] py-[24px] sm:rounded-none md:px-[32px] md:py-[28px]">
              <p className="text-[20px] md:text-[24px] xl:text-[40px]">
                {t("city")}
              </p>
              <p className="mt-[8px] text-[14px] md:text-[16px] xl:mt-[16px] xl:text-[24px]">
                {t("growthStart")}{" "}
                <span className="text-accent">
                  <CountUp>{t("growthValue")}</CountUp>
                </span>{" "}
                {t("growthEnd")}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-[12px] sm:flex sm:flex-col sm:justify-center sm:gap-[8px] sm:bg-blush-200 sm:px-[24px] sm:py-[24px] md:px-[32px]">
              {[
                [t("workshops"), t("workshopsUnit")],
                [t("points"), t("pointsUnit")],
              ].map(([value, unit]) => (
                <p
                  key={unit}
                  className="flex items-baseline gap-[8px] rounded-[4px] bg-blush-200 px-[20px] py-[16px] sm:rounded-none sm:bg-transparent sm:p-0"
                >
                  <span className="text-[24px] font-light xl:text-[36px]">
                    <CountUp>{value}</CountUp>
                  </span>
                  <span className="text-[13px] text-ink/60 xl:text-[16px]">
                    {unit}
                  </span>
                </p>
              ))}
            </div>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-[4px]">
          <div className="relative aspect-[4/3] bg-blush-50 xl:aspect-auto xl:h-full xl:min-h-[520px]">
            {/* Кадры лежат стопкой и переключаются прозрачностью, поэтому
                смены мгновенные: соседние слайды уже загружены */}
            {slides.map((slide, i) =>
              mounted.has(i) ? (
                <Image
                  key={slide.id}
                  src={slide.image}
                  alt={slide.caption}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1280px) 100vw, 50vw"
                  className={`object-cover transition-[opacity,transform] duration-500 ease-out ${
                    i === active
                      ? "scale-100 opacity-100"
                      : "scale-[1.02] opacity-0"
                  }`}
                />
              ) : null,
            )}
          </div>

          <div className="absolute right-[12px] bottom-[12px] left-[12px] flex items-center justify-between gap-[16px] rounded-[4px] bg-white px-[20px] py-[14px] xl:right-[20px] xl:bottom-[20px] xl:left-[20px]">
            <p
              key={current?.id}
              className="animate-[rise_0.4s_ease-out] text-[14px] md:text-[16px]"
            >
              {current?.caption}
            </p>
            <div className="flex items-center gap-[12px]">
              {slides.length > 1 && (
                <span className="text-[13px] text-ink/40">
                  {active + 1}/{slides.length}
                </span>
              )}
              <button
                type="button"
                onClick={() => go(-1)}
                disabled={slides.length < 2}
                aria-label="←"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[18px] transition-colors duration-200 hover:bg-blush-50 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                ←
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                disabled={slides.length < 2}
                aria-label="→"
                className="flex h-[32px] w-[32px] items-center justify-center rounded-full text-[18px] transition-colors duration-200 hover:bg-blush-50 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
