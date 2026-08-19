import { getAllContent } from "@/lib/content";
import { getMedia } from "@/lib/media";
import { fieldAt } from "@/lib/admin-fields";
import { SlidesEditor, type SlideRow } from "@/components/admin/SlidesEditor";

export const dynamic = "force-dynamic";

export default async function CaseSlidesPage() {
  const [media, all] = await Promise.all([getMedia(), getAllContent()]);

  const rows: SlideRow[] = media.caseSlides.map((slide) => ({
    id: slide.id,
    image: slide.image,
    captions: fieldAt(all, `case.slides.${slide.id}`),
  }));

  return <SlidesEditor rows={rows} />;
}
