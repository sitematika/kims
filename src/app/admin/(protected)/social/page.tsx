import { getContent, type ContentNode } from "@/lib/content";
import { getMedia } from "@/lib/media";
import { getAdminDict } from "@/lib/admin-lang";
import {
  SocialLinksForm,
  type SocialRow,
} from "@/components/admin/SocialLinksForm";

export const dynamic = "force-dynamic";

type Column = { title: string; links: Record<string, string> };

export default async function SocialPage() {
  const [media, content, dict] = await Promise.all([
    getMedia(),
    getContent("uk"),
    getAdminDict(),
  ]);
  const footer = content.footer as ContentNode;
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
    <div className="flex max-w-[860px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.social.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">{dict.social.subtitle}</p>
      </header>

      <SocialLinksForm rows={rows} />
    </div>
  );
}
