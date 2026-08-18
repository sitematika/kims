import { getSettings } from "@/lib/settings";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { PasswordForm } from "@/components/admin/PasswordForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const settings = await getSettings();
  const forcedByEnv = process.env.SITE_NOINDEX === "1";

  return (
    <div className="flex max-w-[860px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">Настройки и доступ</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">
          Хранятся вместе с текстами сайта, поэтому не сбрасываются при
          обновлении кода.
        </p>
      </header>

      <SiteSettingsForm
        siteUrl={settings.siteUrl}
        indexing={settings.indexing}
        forcedByEnv={forcedByEnv}
      />

      <PasswordForm usingEnv={!settings.passwordHash} />
    </div>
  );
}
