"use client";

import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";

/**
 * Прелоадер: держится, пока не загрузятся шрифты и фото первого экрана,
 * затем плавно уходит. Контент под ним отрисован сразу, так что на SEO
 * и на индексацию это не влияет.
 */
export function Preloader() {
  const [done, setDone] = useState(false);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const finish = () => {
      if (cancelled) return;
      setDone(true);
      // убираем из потока после того, как отыграет затухание
      window.setTimeout(() => !cancelled && setHidden(true), 700);
    };

    const ready = Promise.all([
      document.fonts?.ready ?? Promise.resolve(),
      new Promise<void>((resolve) => {
        if (document.readyState === "complete") return resolve();
        window.addEventListener("load", () => resolve(), { once: true });
      }),
    ]);

    // страховка: даже при медленной сети не держим экран дольше 2.5 с
    const failsafe = window.setTimeout(finish, 2500);
    ready.then(() => {
      window.clearTimeout(failsafe);
      window.setTimeout(finish, 250);
    });

    document.documentElement.style.overflow = "hidden";
    return () => {
      cancelled = true;
      window.clearTimeout(failsafe);
      document.documentElement.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (done) document.documentElement.style.overflow = "";
  }, [done]);

  if (hidden) return null;

  return (
    <div
      aria-hidden
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center gap-[28px] bg-white transition-opacity duration-700 ${
        done ? "pointer-events-none opacity-0" : "opacity-100"
      }`}
    >
      <Logo className="h-[28px] w-auto animate-[preloader-fade_1.6s_ease-in-out_infinite] text-ink md:h-[34px]" />

      <span className="relative block h-px w-[160px] overflow-hidden bg-blush-200 md:w-[200px]">
        <span className="absolute inset-y-0 left-0 w-1/3 animate-[preloader-sweep_1.3s_ease-in-out_infinite] bg-accent" />
      </span>
    </div>
  );
}
