"use client";

import { useState, useTransition } from "react";
import { sendTestLead } from "@/app/admin/lead-actions";

export function TestLeadButton() {
  const [result, setResult] = useState<string | null>(null);
  const [pending, start] = useTransition();

  return (
    <div className="flex flex-wrap items-center gap-[16px]">
      <button
        type="button"
        disabled={pending}
        onClick={() => start(async () => setResult(await sendTestLead()))}
        className="h-[38px] rounded-[4px] border border-line px-[18px] text-[13px] transition-colors hover:bg-paper disabled:opacity-60"
      >
        {pending ? "Отправляем…" : "Отправить тестовую заявку"}
      </button>

      {result && (
        <span
          className={`text-[13px] ${
            result.includes("ошибка") || result.includes("не настроен")
              ? "text-red-700"
              : "text-ink/60"
          }`}
        >
          {result}
        </span>
      )}
    </div>
  );
}
