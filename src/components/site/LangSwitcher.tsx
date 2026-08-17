"use client";

import { useLocale } from "next-intl";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { localeLabels, locales, type Locale } from "@/i18n/routing";

export function LangSwitcher({
  className = "",
  variant = "dropdown",
}: {
  className?: string;
  /** dropdown — для шапки, inline — для оверлей-меню на мобильном */
  variant?: "dropdown" | "inline";
}) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const switchTo = (next: Locale) => {
    setOpen(false);
    if (next === locale) return;
    startTransition(() => {
      router.replace(
        // @ts-expect-error — pathname приходит как строка, типы маршрутов здесь не нужны
        { pathname, params },
        { locale: next },
      );
    });
  };

  if (variant === "inline") {
    return (
      <div className={`flex items-center gap-[20px] ${className}`}>
        {locales.map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => switchTo(l)}
            className={`text-[16px] tracking-[1px] transition-colors ${
              l === locale ? "text-ink" : "text-muted hover:text-ink"
            }`}
          >
            {localeLabels[l]}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div ref={boxRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={isPending}
        className="flex items-center gap-[6px] text-[16px] font-light tracking-[1px] text-[#bababa] transition-colors hover:text-ink"
      >
        {localeLabels[locale]}
        <svg
          width="8"
          height="5"
          viewBox="0 0 8 5"
          fill="none"
          aria-hidden
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M1 1L4 4L7 1"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute right-0 top-[calc(100%+12px)] z-50 min-w-[92px] rounded-[4px] border border-blush-100 bg-white py-[6px] shadow-[0_8px_24px_rgba(30,30,30,0.08)]"
        >
          {locales.map((l) => (
            <li key={l}>
              <button
                type="button"
                role="option"
                aria-selected={l === locale}
                onClick={() => switchTo(l)}
                className={`block w-full px-[16px] py-[8px] text-left text-[14px] tracking-[1px] transition-colors hover:bg-blush-50 ${
                  l === locale ? "text-ink" : "text-muted"
                }`}
              >
                {localeLabels[l]}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
