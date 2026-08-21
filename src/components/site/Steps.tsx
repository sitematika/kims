"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/Badge";
import type { ResolvedImages } from "@/lib/images";

type Item = { title: string; text: string };

export function Steps({ images }: { images: ResolvedImages }) {
  const t = useTranslations("steps");
  const items = t.raw("items") as Item[];
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLLIElement | null)[]>([]);

  // Шаг подсвечивается, когда доходит до середины экрана
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const index = refs.current.indexOf(entry.target as HTMLLIElement);
          if (index >= 0) setActive(index);
        });
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );
    refs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="steps" className="shell pt-[56px] md:pt-[80px] xl:pt-[110px]">
      <Badge>{t("badge")}</Badge>

      <div className="mt-[24px] grid grid-cols-1 gap-[32px] xl:mt-[32px] xl:grid-cols-2 xl:gap-[40px]">
        <div>
          <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[38px] xl:tracking-[-0.38px]">
            <strong className="font-medium">{t("titleStart")}</strong>
            <br />
            <span className="font-light">{t("titleStrong")}</span>
          </h2>

          <ol className="mt-[28px] flex flex-col xl:mt-[40px]">
            {items.map((item, i) => {
              const on = i <= active;
              return (
                <li
                  key={item.title}
                  ref={(el) => {
                    refs.current[i] = el;
                  }}
                  className="relative flex gap-[20px] pb-[28px] last:pb-0 md:gap-[28px]"
                >
                  {/* линия между кружками */}
                  {i < items.length - 1 && (
                    <span
                      aria-hidden
                      className="absolute top-[48px] bottom-0 left-[24px] w-px bg-ink/15 xl:top-[60px] xl:left-[30px]"
                    />
                  )}

                  <span
                    className={`relative z-10 flex h-[48px] w-[48px] shrink-0 items-center justify-center rounded-full border bg-white text-[16px] font-light transition-all duration-500 xl:h-[60px] xl:w-[60px] xl:text-[32px] ${
                      on
                        ? "scale-105 border-accent text-accent"
                        : "scale-100 border-ink/15 text-ink/30"
                    }`}
                  >
                    {i + 1}
                  </span>

                  {/* ширина колонки как в макете: описания ложатся в 2–3 строки */}
                  <div
                    className={`flex flex-col gap-[8px] pt-[8px] transition-opacity duration-300 xl:max-w-[364px] xl:gap-[16px] xl:pt-[6px] ${
                      on ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <h3 className="text-[17px] md:text-[18px] xl:text-[24px] xl:leading-[1.1]">
                      {item.title}
                    </h3>
                    <p className="text-[13px] leading-[1.4] text-ink-warm/80 md:text-[14px] xl:text-[16px] xl:leading-[1.2] xl:font-light xl:tracking-[-0.16px]">
                      {item.text}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        <div className="relative aspect-[4/3] overflow-hidden rounded-[4px] xl:aspect-auto xl:h-full xl:min-h-[600px]">
          <Image
            src={images.steps.src}
            alt={images.steps.alt}
            fill
            sizes="(max-width: 1280px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
