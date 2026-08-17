import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n/routing";
import {
  flattenFields,
  getAllContent,
  readPath,
  sectionLabels,
} from "@/lib/content";
import {
  SectionEditor,
  type EditorField,
} from "@/components/admin/SectionEditor";

export default async function SectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const all = await getAllContent();

  const source = all.uk[section];
  if (source === undefined) notFound();

  const fields: EditorField[] = flattenFields(source, section).map((field) => {
    const values = Object.fromEntries(
      locales.map((locale) => {
        const value = readPath(all[locale], field.path);
        return [locale, typeof value === "string" ? value : ""];
      }),
    ) as Record<Locale, string>;

    return { path: field.path, values };
  });

  return (
    <SectionEditor
      section={section}
      title={sectionLabels[section] ?? section}
      fields={fields}
    />
  );
}
