"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { buttonClasses } from "@/components/ui/Button";
import { navItems } from "@/lib/sections";
import { LangSwitcher } from "./LangSwitcher";

export function Header() {
  const t = useTranslations();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-blush-100 bg-white/95 backdrop-blur-[5px]">
        <div className="shell flex h-[64px] items-center justify-between gap-[16px] md:h-[80px]">
          <a href="#top" aria-label="KIMS" className="shrink-0">
            <Logo className="h-[20px] w-auto text-ink md:h-[24px]" />
          </a>

          <div className="flex items-center gap-[16px] md:gap-[24px] xl:gap-[52px]">
            {/* Полное меню — только на широких экранах */}
            <nav className="hidden items-center gap-[32px] xl:flex">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="group relative text-[14px] whitespace-nowrap text-ink transition-colors hover:text-accent"
                >
                  {t(`nav.${item.key}`)}
                  <span className="absolute -bottom-[4px] left-0 h-px w-full origin-center scale-x-0 bg-accent transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              ))}
            </nav>

            <div className="flex items-center gap-[16px] md:gap-[24px] xl:gap-[32px]">
              <a
                href="#lead"
                className={buttonClasses(
                  "dark",
                  "sm",
                  "order-1 h-[40px] px-[16px] text-[13px] whitespace-nowrap md:px-[36px] md:text-[14px] xl:order-2",
                )}
              >
                {t("cta.lead")}
              </a>

              {/* Планшет: кнопка «Навігація» с иконкой. Мобильный: только бургер. */}
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                aria-expanded={menuOpen}
                aria-controls="site-menu"
                className="order-2 flex h-[40px] items-center gap-[12px] rounded-[2px] border-line px-0 text-[14px] whitespace-nowrap text-ink transition-colors hover:text-accent md:border md:px-[16px] xl:hidden"
              >
                <span className="hidden md:inline">{t("nav.open")}</span>
                <BurgerIcon />
              </button>

              <LangSwitcher className="order-3 hidden md:block xl:order-1" />
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div
          className="fixed inset-0 z-50 bg-ink/40 xl:hidden"
          onClick={() => setMenuOpen(false)}
        >
          <div
            id="site-menu"
            role="dialog"
            aria-modal="true"
            onClick={(e) => e.stopPropagation()}
            className="ml-auto w-full max-w-[360px] rounded-b-[4px] bg-white p-[24px] md:max-w-[656px] md:p-[32px]"
          >
            <div className="flex items-center justify-between">
              <Logo className="h-[20px] w-auto text-ink md:h-[24px]" />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-[16px] text-[14px] text-ink"
              >
                <span className="hidden md:inline">{t("nav.close")}</span>
                <span className="flex h-[32px] w-[32px] items-center justify-center rounded-[2px] border border-line">
                  <CloseIcon />
                </span>
              </button>
            </div>

            <hr className="my-[24px] border-blush-100 md:my-[28px]" />

            <nav className="grid gap-y-[20px] md:grid-cols-2 md:gap-x-[32px] md:gap-y-[28px]">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="inline-block text-[18px] text-ink transition-all duration-300 hover:translate-x-[4px] hover:text-accent md:text-[20px]"
                >
                  {t(`nav.${item.key}`)}
                </a>
              ))}
            </nav>

            <hr className="my-[24px] border-blush-100 md:my-[28px]" />

            <div className="flex items-center justify-between gap-[16px]">
              <p className="text-[14px] text-muted">{t("nav.tagline")}</p>
              <LangSwitcher variant="inline" className="md:hidden" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function BurgerIcon() {
  return (
    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" aria-hidden>
      <path d="M0 1h20M0 6h20M0 11h20" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden>
      <path
        d="M1 1l10 10M11 1L1 11"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}
