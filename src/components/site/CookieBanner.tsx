"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { buttonClasses } from "@/components/ui/Button";

const KEY = "kims-cookie-consent";

/**
 * Согласие на аналитику. Пока выбор не сделан, счётчики не подключаются —
 * поэтому баннер не декоративный, а реально управляет тем, что грузится.
 */
export function CookieBanner() {
  const t = useTranslations("cookies");
  const [decided, setDecided] = useState(true);

  useEffect(() => {
    setDecided(Boolean(window.localStorage.getItem(KEY)));
  }, []);

  const decide = (value: "all" | "essential") => {
    window.localStorage.setItem(KEY, value);
    setDecided(true);
    window.dispatchEvent(new CustomEvent("kims-consent", { detail: value }));
  };

  if (decided) return null;

  return (
    <div
      role="dialog"
      aria-label={t("policy")}
      className="fixed inset-x-[12px] bottom-[12px] z-50 rounded-[4px] bg-ink px-[20px] py-[18px] text-white shadow-[0_18px_50px_rgba(30,30,30,0.35)] md:inset-x-auto md:right-[24px] md:bottom-[24px] md:max-w-[520px] md:px-[28px] md:py-[24px]"
    >
      <p className="text-[13px] leading-[1.45] text-white/85 md:text-[14px]">
        {t("text")}{" "}
        <Link href="/privacy" className="underline underline-offset-[3px]">
          {t("policy")}
        </Link>
      </p>

      <div className="mt-[16px] flex flex-col gap-[10px] sm:flex-row">
        <button
          type="button"
          onClick={() => decide("all")}
          className={buttonClasses("blush", "sm", "h-[40px] px-[28px]")}
        >
          {t("accept")}
        </button>
        <button
          type="button"
          onClick={() => decide("essential")}
          className="h-[40px] rounded-[4px] border border-white/25 px-[28px] text-[14px] transition-colors hover:border-white/50"
        >
          {t("decline")}
        </button>
      </div>
    </div>
  );
}
