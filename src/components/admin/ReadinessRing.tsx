"use client";

import { animate, useMotionValue, useTransform, motion } from "motion/react";
import { useEffect, useState } from "react";

/**
 * Кольцо готовности к запуску.
 *
 * Дуга и число доезжают до значения за секунду — это единственное место
 * в панели, где движение несёт смысл: показывает, что до полной готовности
 * ещё есть путь. Остальные экраны намеренно статичны.
 */
export function ReadinessRing({
  done,
  total,
  label,
}: {
  done: number;
  total: number;
  label: string;
}) {
  const ratio = total ? done / total : 0;
  const progress = useMotionValue(0);
  const [shown, setShown] = useState(0);

  const size = 108;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = useTransform(progress, (v) => circumference * (1 - v));

  useEffect(() => {
    const run = animate(progress, ratio, {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setShown(Math.round(v * total)),
    });
    return () => run.stop();
  }, [progress, ratio, total]);

  const tone =
    ratio === 1 ? "#16a34a" : ratio >= 0.6 ? "var(--color-accent)" : "#dc2626";

  return (
    <div className="flex items-center gap-[16px]">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={stroke}
            className="text-line-soft"
          />
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={tone}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            style={{ strokeDashoffset: offset }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-[24px] leading-none font-medium tabular-nums">
            {shown}
          </span>
          <span className="mt-[2px] text-[12px] text-ink/45">/ {total}</span>
        </div>
      </div>

      <p className="max-w-[280px] text-[13px] leading-[1.45] text-ink/60">
        {label}
      </p>
    </div>
  );
}
