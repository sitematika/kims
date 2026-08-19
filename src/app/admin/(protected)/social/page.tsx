import { getContent, type ContentNode } from "@/lib/content";
import { getMedia } from "@/lib/media";
import {
  SocialLinksForm,
  type SocialRow,
} from "@/components/admin/SocialLinksForm";

export const dynamic = "force-dynamic";

type Column = { title: string; links: Record<string, string> };

export default async function SocialPage() {
  const media = await getMedia();
  const content = await getContent("uk");
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
        <h1 className="text-[24px]">Ссылки на соцсети</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">
          Адреса общие для всех языков. Подписи переводятся в разделе «Футер».
          Пока адрес не заполнен, в футере остаётся неактивная подпись.
        </p>
      </header>

      <SocialLinksForm rows={rows} />
    </div>
  );
}
