import { notFound } from "next/navigation";
import { getAllContent } from "@/lib/content";
import { getAdminDict, type AdminDict } from "@/lib/admin-lang";
import { fieldsOf } from "@/lib/admin-fields";
import { FieldsForm } from "@/components/admin/FieldsForm";
import { sectionAnchors } from "@/lib/section-anchors";

/** Разделы, у которых есть собственная страница со своей логикой */
const custom = new Set([
  "images",
  "alt",
  "social",
  "case-slides",
  "presentation",
  "settings",
  "history",
  "leads",
  "footer",
  "nav",
  "meta",
  "service",
]);

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  if (custom.has(section)) notFound();

  const [all, dict] = await Promise.all([getAllContent(), getAdminDict()]);
  // подписи слайдов правятся рядом с самими кадрами, здесь их не показываем
  const fields = fieldsOf(all, section).filter(
    (field) => !field.path.startsWith("case.slides."),
  );
  if (!fields.length) notFound();

  return (
    <FieldsForm
      section={section}
      title={dict.sections[section as keyof AdminDict["sections"]] ?? section}
      groups={[{ fields }]}
      anchor={sectionAnchors[section]}
    />
  );
}
