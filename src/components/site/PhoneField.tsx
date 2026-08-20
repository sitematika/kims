"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyMask,
  countries,
  digitsInMask,
  flagOf,
  type Country,
} from "@/lib/countries";

/**
 * Телефон с выбором страны: флаг, код и маска национального номера.
 *
 * Названия стран берутся у браузера на языке сайта, поэтому список
 * не приходится держать в переводах.
 */
export function PhoneField({
  locale,
  iso,
  onIsoChange,
  digits,
  onDigitsChange,
  error,
  label,
  searchPlaceholder,
}: {
  locale: string;
  iso: string;
  onIsoChange: (iso: string) => void;
  digits: string;
  onDigitsChange: (digits: string) => void;
  error?: string;
  label: string;
  searchPlaceholder: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const boxRef = useRef<HTMLDivElement>(null);

  const names = useMemo(() => {
    try {
      const dn = new Intl.DisplayNames([locale], { type: "region" });
      return (code: string) => dn.of(code) ?? code;
    } catch {
      return (code: string) => code;
    }
  }, [locale]);

  const sorted = useMemo(
    () =>
      [...countries].sort((a, b) =>
        names(a.iso).localeCompare(names(b.iso), locale),
      ),
    [names, locale],
  );

  const current: Country =
    countries.find((c) => c.iso === iso) ?? countries[0];

  const found = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sorted;

    // цифры сверяем с кодом, но только если они есть: пустую строку
    // содержит любой номер, и тогда фильтр пропускал бы всё подряд
    const asDigits = q.replace(/\D/g, "");

    return sorted.filter(
      (c) =>
        names(c.iso).toLowerCase().includes(q) ||
        c.iso.toLowerCase().includes(q) ||
        (asDigits !== "" && c.dial.includes(asDigits)),
    );
  }, [query, sorted, names]);

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

  const limit = digitsInMask(current.mask);

  return (
    <label className="flex flex-col gap-[12px] pt-[28px] first:pt-0">
      <span className="text-[13px] tracking-[1px] text-ink/70 uppercase md:text-[14px]">
        {label}
      </span>

      <div
        ref={boxRef}
        className={`relative flex items-center gap-[10px] border-b pb-[12px] ${
          error ? "border-red-600" : "border-ink/20 focus-within:border-ink"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          className="flex shrink-0 items-center gap-[6px] text-[16px]"
        >
          <span className="text-[20px] leading-none">{flagOf(current.iso)}</span>
          <span>+{current.dial}</span>
          <svg width="8" height="5" viewBox="0 0 8 5" fill="none" aria-hidden>
            <path
              d="M1 1L4 4L7 1"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          value={applyMask(digits, current.mask)}
          placeholder={current.mask.replace(/#/g, "0")}
          onChange={(e) =>
            onDigitsChange(e.target.value.replace(/\D/g, "").slice(0, limit))
          }
          className="w-full bg-transparent text-[16px] outline-none placeholder:text-ink/30"
        />

        {open && (
          <div className="absolute top-[calc(100%+8px)] left-0 z-30 w-full max-w-[320px] overflow-hidden rounded-[4px] border border-line bg-white shadow-[0_12px_32px_rgba(30,30,30,0.12)]">
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full border-b border-line-soft px-[14px] py-[10px] text-[14px] outline-none"
            />

            <ul role="listbox" className="max-h-[240px] overflow-y-auto">
              {found.map((c) => (
                <li key={c.iso + c.dial}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={c.iso === current.iso}
                    onClick={() => {
                      onIsoChange(c.iso);
                      onDigitsChange(digits.slice(0, digitsInMask(c.mask)));
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-center gap-[10px] px-[14px] py-[9px] text-left text-[14px] transition-colors hover:bg-blush-50 ${
                      c.iso === current.iso ? "bg-blush-50" : ""
                    }`}
                  >
                    <span className="text-[18px] leading-none">
                      {flagOf(c.iso)}
                    </span>
                    <span className="flex-1 truncate">{names(c.iso)}</span>
                    <span className="text-ink/50">+{c.dial}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {error && <span className="text-[13px] text-red-700">{error}</span>}
    </label>
  );
}
