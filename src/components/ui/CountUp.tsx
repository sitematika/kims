"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Анимация числа при появлении в кадре.
 *
 * Принимает строку целиком («119», «$25,2 млрд», «€1 100 000», «+6,5%»),
 * находит в ней первое число и анимирует только его, сохраняя разделители
 * и весь окружающий текст — поэтому работает на всех четырёх языках,
 * где формат чисел разный.
 */

const NUMBER = /\d[\d\s .,]*\d|\d/;

type Parsed = {
  before: string;
  after: string;
  value: number;
  decimals: number;
  decimalSep: string;
  groupSep: string;
};

function parse(text: string): Parsed | null {
  const match = text.match(NUMBER);
  if (!match || match.index === undefined) return null;

  const token = match[0];
  const before = text.slice(0, match.index);
  const after = text.slice(match.index + token.length);

  // «25,2» или «6.5» — дробное; «1 100 000» или «1,100,000» — разряды
  const fraction = token.match(/^(\d+)([.,])(\d{1,2})$/);
  if (fraction) {
    return {
      before,
      after,
      value: Number(`${fraction[1]}.${fraction[3]}`),
      decimals: fraction[3].length,
      decimalSep: fraction[2],
      groupSep: "",
    };
  }

  const groupSep = token.match(/[\s .,]/)?.[0] ?? "";
  const digits = token.replace(/[\s .,]/g, "");

  return {
    before,
    after,
    value: Number(digits),
    decimals: 0,
    decimalSep: "",
    groupSep,
  };
}

function format(value: number, parsed: Parsed) {
  const fixed = value.toFixed(parsed.decimals);
  const [whole, fraction] = fixed.split(".");

  const grouped = parsed.groupSep
    ? whole.replace(/\B(?=(\d{3})+(?!\d))/g, parsed.groupSep)
    : whole;

  return fraction ? `${grouped}${parsed.decimalSep}${fraction}` : grouped;
}

export function CountUp({
  children,
  className,
  duration = 1400,
}: {
  children: string;
  className?: string;
  duration?: number;
}) {
  const parsed = parse(children);
  const ref = useRef<HTMLSpanElement>(null);
  const [text, setText] = useState(children);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || !parsed) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    // до попадания в кадр показываем настоящее число: если скрипт не отработает
    // или блок так и не долистают, посетитель увидит значение, а не ноль
    const run = () => {
      setText(`${parsed.before}${format(0, parsed)}${parsed.after}`);
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        // easeOutCubic — быстрый разгон, мягкая остановка
        const eased = 1 - (1 - progress) ** 3;
        setText(
          `${parsed.before}${format(parsed.value * eased, parsed)}${parsed.after}`,
        );
        if (progress < 1) requestAnimationFrame(tick);
        else setText(children);
      };
      requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();
        run();
      },
      { rootMargin: "0px 0px -15% 0px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [children, duration]);

  return (
    <span ref={ref} className={className}>
      {text}
    </span>
  );
}
