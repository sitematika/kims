"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Фоновое видео подгружается, только когда блок подходит к экрану.
 *
 * У тега video с autoplay браузер тянет файл сразу при открытии страницы —
 * полтора мегабайта ради блока, до которого ещё четыре экрана прокрутки.
 * Поэтому адрес подставляем по месту, а до тех пор виден кадр-постер.
 */
export function ShowreelVideo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setNear(true);
        observer.disconnect();
      },
      // с запасом, чтобы к моменту появления кадр уже двигался
      { rootMargin: "400px 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    // autoplay срабатывает на первичной загрузке; здесь адрес появился
    // позже, поэтому просим воспроизведение сами
    ref.current?.play().catch(() => {
      // браузер запретил автозапуск — останется постер, это допустимо
    });
  }, [near]);

  return (
    <video
      ref={ref}
      className="absolute inset-0 h-full w-full object-cover"
      src={near ? src : undefined}
      poster={poster}
      aria-label={label}
      autoPlay
      muted
      loop
      playsInline
      preload="none"
    />
  );
}
