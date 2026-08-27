import { getSettings } from "@/lib/settings";
import { checkDataDirs } from "@/lib/diagnostics";
import { getAdminDict } from "@/lib/admin-lang";
import { PasswordForm } from "@/components/admin/PasswordForm";
import { RecoveryEmailForm } from "@/components/admin/RecoveryEmailForm";
import { leadRecipients } from "@/lib/notify";

export const dynamic = "force-dynamic";

/** Пароль и место хранения данных */
export default async function AccessPage() {
  const [settings, dirs, dict, fallback] = await Promise.all([
    getSettings(),
    checkDataDirs(),
    getAdminDict(),
    leadRecipients(),
  ]);

  return (
    <div className="flex max-w-[860px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.nav.access}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">
          {dict.settings.subtitle}
        </p>
      </header>

      <PasswordForm usingEnv={!settings.passwordHash} />

      <RecoveryEmailForm
        recoveryEmail={settings.recoveryEmail ?? ""}
        fallback={fallback}
      />

      <section className="flex flex-col gap-[12px] rounded-[4px] border border-line-soft bg-white p-[20px]">
        <div>
          <h2 className="text-[16px]">{dict.settings.dataBlock}</h2>
          <p className="mt-[4px] text-[13px] text-ink/60">
            {dict.settings.dataHint}
          </p>
        </div>

        <ul className="flex flex-col gap-[10px]">
          {dirs.map((dir) => (
            <li key={dir.path} className="text-[13px]">
              <span className="text-ink/50">{dict.settings[dir.labelKey]}: </span>
              <span className="font-mono">{dir.path}</span>
              <span className={dir.writable ? "text-ink/60" : "text-red-700"}>
                {" "}
                — {dict.settings[dir.noteKey]}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
