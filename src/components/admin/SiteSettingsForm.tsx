"use client";

import { useActionState } from "react";
import { updateSite } from "@/app/admin/settings-actions";
import { useDict } from "./AdminLangProvider";

export function SiteSettingsForm({
  siteUrl,
  indexing,
  forcedByEnv,
  gtmId,
  googleVerification,
}: {
  siteUrl: string;
  indexing: boolean;
  forcedByEnv: boolean;
  gtmId: string;
  googleVerification: string;
}) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(updateSite, null);
  const note = message
    ? (dict.msg[message as keyof typeof dict.msg] ?? message)
    : null;

  return (
    <form
      action={formAction}
      className="flex flex-col gap-[20px] rounded-[4px] border border-line-soft bg-white p-[20px]"
    >
      <div className={`-m-[20px] mb-0 flex items-center gap-[12px] rounded-t-[4px] px-[20px] py-[14px] text-[14px] ${
        indexing && !forcedByEnv ? "bg-blush-50" : "bg-ink text-white"
      }`}>
        <span className={`h-[10px] w-[10px] shrink-0 rounded-full ${
          indexing && !forcedByEnv ? "bg-green-600" : "bg-accent"
        }`} />
        {indexing && !forcedByEnv
          ? dict.indexing.openNow
          : dict.indexing.hiddenNow}
      </div>

      <div>
        <h2 className="text-[16px]">{dict.settings.siteBlock}</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">{dict.settings.siteHint}</p>
      </div>

      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          {dict.settings.siteUrl}
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
          {dict.settings.allowIndexing}
          <span className="mt-[4px] block text-[13px] text-ink/60">{dict.settings.indexingHint}</span>
          {forcedByEnv && (
            <span className="mt-[6px] block text-[13px] text-red-700">{dict.settings.forcedByEnv}</span>
          )}
        </span>
      </label>

      <hr className="border-line-soft" />

      <div>
        <h2 className="text-[16px]">{dict.settings.countersBlock}</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">
          {dict.settings.countersHint}
        </p>
      </div>

      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          {dict.settings.gtmId}
        </span>
        <input
          name="gtmId"
          defaultValue={gtmId}
          placeholder="GTM-XXXXXXX"
          className="rounded-[4px] border border-line px-[12px] py-[10px] text-[14px] outline-none focus:border-ink"
        />
        <span className="text-[13px] text-ink/60">{dict.settings.gtmHint}</span>
      </label>

      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          {dict.settings.googleVerification}
        </span>
        <input
          name="googleVerification"
          defaultValue={googleVerification}
          placeholder='<meta name="google-site-verification" content="..." />'
          className="rounded-[4px] border border-line px-[12px] py-[10px] text-[14px] outline-none focus:border-ink"
        />
        <span className="text-[13px] text-ink/60">
          {dict.settings.googleVerificationHint}
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-[16px]">
        <button
          type="submit"
          disabled={pending}
          className="h-[42px] rounded-[4px] bg-ink px-[24px] text-[14px] font-medium text-white disabled:opacity-60"
        >
          {pending ? dict.common.saving : dict.common.save}
        </button>
        {note && <span className="text-[13px] text-ink/60">{note}</span>}
      </div>
    </form>
  );
}
