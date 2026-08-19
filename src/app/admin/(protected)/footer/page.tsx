import { getAllContent, type ContentNode } from "@/lib/content";
import { getMedia } from "@/lib/media";
import { getAdminDict } from "@/lib/admin-lang";
import { fieldsOf } from "@/lib/admin-fields";
import { FieldsForm } from "@/components/admin/FieldsForm";
import {
  SocialLinksForm,
  type SocialRow,
} from "@/components/admin/SocialLinksForm";

export const dynamic = "force-dynamic";

type Column = { title: string; links: Record<string, string> };

/** Тексты футера и адреса соцсетей вместе: подпись и ссылка рядом */
export default async function FooterPage() {
  const [all, media, dict] = await Promise.all([
    getAllContent(),
    getMedia(),
    getAdminDict(),
  ]);

  const footer = all.uk.footer as ContentNode;
  const columns = (footer?.columns ?? []) as unknown as Column[];

  const rows: SocialRow[] = columns.flatMap((column) =>
    Object.entries(column.links ?? {}).map(([id, label]) => ({
      id,
      group: column.title,
      label,
      url: media.socialLinks?.[id] ?? "",
    })),
  );

  return (
    <div className="flex max-w-[1100px] flex-col gap-[32px]">
      <FieldsForm
        section="footer"
        title={dict.sections.footer}
        groups={[{ fields: fieldsOf(all, "footer") }]}
      />

      <section className="flex flex-col gap-[16px] border-t border-line-soft pt-[32px]">
        <div>
          <h2 className="text-[18px]">{dict.social.title}</h2>
          <p className="mt-[4px] text-[14px] text-ink/60">
            {dict.social.subtitle}
          </p>
        </div>
        <SocialLinksForm rows={rows} />
      </section>
    </div>
  );
}
