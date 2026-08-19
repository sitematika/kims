import { getAllContent } from "@/lib/content";
import { getMedia } from "@/lib/media";
import { imageSlots } from "@/lib/images";
import { getAdminDict } from "@/lib/admin-lang";
import { fieldAt } from "@/lib/admin-fields";
import { ImagesEditor, type ImageRow } from "@/components/admin/ImagesEditor";

export const dynamic = "force-dynamic";

export default async function ImagesPage() {
  const [media, all, dict] = await Promise.all([
    getMedia(),
    getAllContent(),
    getAdminDict(),
  ]);

  const rows: ImageRow[] = imageSlots.map((slot) => ({
    id: slot.id,
    label: dict.imageSlots[slot.id],
    src: media.images?.[slot.id] || slot.src,
    custom: Boolean(media.images?.[slot.id]),
    alts: fieldAt(all, `alt.${slot.id}`),
  }));

  return <ImagesEditor rows={rows} />;
}
