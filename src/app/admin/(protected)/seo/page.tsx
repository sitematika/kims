import { getAllContent } from "@/lib/content";
import { getMedia } from "@/lib/media";
import { getSettings } from "@/lib/settings";
import { getIndexable, getSiteUrl } from "@/lib/site";
import { getAdminDict } from "@/lib/admin-lang";
import { fieldsOf } from "@/lib/admin-fields";
import { FieldsForm } from "@/components/admin/FieldsForm";
import { SeoExtras } from "@/components/admin/SeoExtras";
import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";

export const dynamic = "force-dynamic";

/** Всё про то, как сайт выглядит в поиске и в соцсетях */
export default async function SeoPage() {
  const [all, media, settings, siteUrl, indexable, dict] = await Promise.all([
    getAllContent(),
    getMedia(),
    getSettings(),
    getSiteUrl(),
    getIndexable(),
    getAdminDict(),
  ]);

  const forcedByEnv = process.env.SITE_NOINDEX === "1";

  return (
    <div className="flex max-w-[1100px] flex-col gap-[24px]">
      <SiteSettingsForm
        siteUrl={settings.siteUrl}
        indexing={settings.indexing}
        forcedByEnv={forcedByEnv}
        gtmId={settings.gtmId ?? ""}
        googleVerification={settings.googleVerification ?? ""}
      />

      <SeoExtras
        ogImage={media.ogImage}
        siteUrl={siteUrl}
        indexable={indexable}
        dict={dict}
      />

      <FieldsForm
        section="meta"
        title={dict.sections.meta}
        groups={[{ fields: fieldsOf(all, "meta") }]}
      />
    </div>
  );
}
