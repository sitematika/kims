"use client";

import { useRouter } from "next/navigation";
import {
  ADMIN_LANG_COOKIE,
  adminLangs,
  adminLangLabels,
  type AdminLang,
} from "@/lib/admin-lang-shared";

/**
 * Переключатель языка панели.
 *
 * Метку ставим прямо в браузере, а не серверным действием: раньше выбор
 * зависел от того, доедет ли заголовок Set-Cookie через прокси хостинга,
 * и на боевом иногда не срабатывал. Здесь переключение видно сразу и
 * ни от чего по дороге не зависит.
 */
export function AdminLangSwitch({ current }: { current: AdminLang }) {
  const router = useRouter();

  const choose = (lang: AdminLang) => {
    if (lang === current) return;

    const year = 60 * 60 * 24 * 365;
    document.cookie = `${ADMIN_LANG_COOKIE}=${lang}; path=/admin; max-age=${year}; samesite=lax`;
    router.refresh();
  };

  return (
    <div className="flex items-center gap-[4px]">
      {adminLangs.map((lang) => (
        <button
          key={lang}
          type="button"
          onClick={() => choose(lang)}
          className={`rounded-[3px] px-[8px] py-[4px] text-[12px] tracking-[1px] transition-colors ${
            lang === current
              ? "bg-ink text-white"
              : "text-ink/40 hover:text-ink"
          }`}
        >
          {adminLangLabels[lang]}
        </button>
      ))}
    </div>
  );
}
