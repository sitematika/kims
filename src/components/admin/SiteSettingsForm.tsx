"use client";

import { useActionState } from "react";
import { updateSite } from "@/app/admin/settings-actions";

export function SiteSettingsForm({
  siteUrl,
  indexing,
  forcedByEnv,
}: {
  siteUrl: string;
  indexing: boolean;
  forcedByEnv: boolean;
}) {
  const [message, formAction, pending] = useActionState(updateSite, null);

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[20px] rounded-[4px] border border-line-soft bg-white p-[20px]"
    >
      <div>
        <h2 className="text-[16px]">Адрес и видимость сайта</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">
          Адрес подставляется в карту сайта, canonical и превью для соцсетей.
        </p>
      </div>

      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          АДРЕС САЙТА
        </span>
        <input
          name="siteUrl"
          defaultValue={siteUrl}
          placeholder="https://example.com"
          className="rounded-[4px] border border-line px-[12px] py-[10px] text-[14px] outline-none focus:border-ink"
        />
      </label>

      <label className="flex items-start gap-[12px]">
        <input
          type="checkbox"
          name="indexing"
          defaultChecked={indexing}
          disabled={forcedByEnv}
          className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-[#1e1e1e]"
        />
        <span className="text-[14px]">
          Разрешить поисковикам индексировать сайт
          <span className="mt-[4px] block text-[13px] text-ink/60">
            Пока галочка снята, сайт закрыт: в robots.txt стоит полный запрет,
            а в страницы добавлен noindex. Включать стоит перед запуском.
          </span>
          {forcedByEnv && (
            <span className="mt-[6px] block text-[13px] text-red-700">
              Сейчас индексация принудительно закрыта переменной SITE_NOINDEX —
              это технический домен, галочка на нём не действует.
            </span>
          )}
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          type="submit"
          disabled={pending}
          className="h-[42px] rounded-[4px] bg-ink px-[24px] text-[14px] font-medium text-white disabled:opacity-60"
        >
          {pending ? "Сохраняем…" : "Сохранить"}
        </button>
        {message && <span className="text-[13px] text-ink/60">{message}</span>}
      </div>
    </form>
  );
}
