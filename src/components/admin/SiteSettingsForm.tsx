"use client";

import { useActionState, useState } from "react";
import { updateSite } from "@/app/admin/settings-actions";
import { useDict } from "./AdminLangProvider";

/**
 * Код уезжает на сервер в base64.
 *
 * Хостинг режет POST, в теле которого встречается тег script: соединение
 * обрывается ещё до приложения, и браузер показывает «страница не открылась».
 * Кодирование обходит фильтр, не ослабляя его для всего остального.
 */
function encode(value: string) {
  if (!value) return "";
  const bytes = new TextEncoder().encode(value);
  let binary = "";
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return `b64:${btoa(binary)}`;
}

export function SiteSettingsForm({
  siteUrl,
  indexing,
  forcedByEnv,
  gtmId,
  googleVerification,
  verificationTags,
  headCode,
  bodyCode,
  codeAfterConsent,
}: {
  siteUrl: string;
  indexing: boolean;
  forcedByEnv: boolean;
  gtmId: string;
  googleVerification: string;
  verificationTags: string;
  headCode: string;
  bodyCode: string;
  codeAfterConsent: boolean;
}) {
  const dict = useDict();
  const [message, formAction, pending] = useActionState(updateSite, null);
  const [head, setHead] = useState(headCode);
  const [body, setBody] = useState(bodyCode);
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

      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          {dict.settings.verificationTags}
        </span>
        <textarea
          name="verificationTags"
          defaultValue={verificationTags}
          rows={2}
          placeholder='<meta name="facebook-domain-verification" content="..." />'
          className="w-full rounded-[4px] border border-line px-[12px] py-[10px] font-mono text-[13px] leading-[1.5] outline-none focus:border-ink"
        />
        <span className="text-[13px] text-ink/60">
          {dict.settings.verificationTagsHint}
        </span>
      </label>

      <hr className="border-line-soft" />

      <div>
        <h2 className="text-[16px]">{dict.settings.codeBlock}</h2>
        <p className="mt-[4px] text-[13px] text-ink/60">
          {dict.settings.codeHint}
        </p>
      </div>

      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          {dict.settings.headCode}
        </span>
        <textarea
          value={head}
          onChange={(e) => setHead(e.target.value)}
          rows={4}
          spellCheck={false}
          className="w-full rounded-[4px] border border-line px-[12px] py-[10px] font-mono text-[13px] leading-[1.5] outline-none focus:border-ink"
        />
        <input type="hidden" name="headCode" value={encode(head)} />
      </label>

      <label className="flex flex-col gap-[8px]">
        <span className="text-[12px] tracking-[1px] text-ink/50">
          {dict.settings.bodyCode}
        </span>
        <textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          spellCheck={false}
          className="w-full rounded-[4px] border border-line px-[12px] py-[10px] font-mono text-[13px] leading-[1.5] outline-none focus:border-ink"
        />
        <input type="hidden" name="bodyCode" value={encode(body)} />
      </label>

      <label className="flex items-start gap-[12px]">
        <input
          type="checkbox"
          name="codeAfterConsent"
          defaultChecked={codeAfterConsent}
          className="mt-[3px] h-[18px] w-[18px] shrink-0 accent-[#1e1e1e]"
        />
        <span className="text-[14px]">
          {dict.settings.codeAfterConsent}
          <span className="mt-[4px] block text-[13px] text-ink/60">
            {dict.settings.codeAfterConsentHint}
          </span>
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
