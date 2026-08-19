import { getSettings } from "@/lib/settings";
import { checkDataDirs } from "@/lib/diagnostics";
import { getAdminDict } from "@/lib/admin-lang";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { PasswordForm } from "@/components/admin/PasswordForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const [settings, dirs, dict] = await Promise.all([
    getSettings(),
    checkDataDirs(),
    getAdminDict(),
  ]);
  const forcedByEnv = process.env.SITE_NOINDEX === "1";

  return (
    <div className="flex max-w-[860px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.settings.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">{dict.settings.subtitle}</p>
      </header>

      <SiteSettingsForm
        siteUrl={settings.siteUrl}
        indexing={settings.indexing}
        forcedByEnv={forcedByEnv}
      />

      <PasswordForm usingEnv={!settings.passwordHash} />

      <section className="flex flex-col gap-[12px] rounded-[4px] border border-line-soft bg-white p-[20px]">
        <div>
          <h2 className="text-[16px]">{dict.settings.dataBlock}</h2>
          <p className="mt-[4px] text-[13px] text-ink/60">{dict.settings.dataHint}</p>
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
