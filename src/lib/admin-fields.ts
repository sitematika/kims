import { locales, type Locale } from "@/i18n/routing";
import { flattenFields, readPath, type ContentNode } from "@/lib/content";
import type { EditorField } from "@/components/admin/FieldsForm";

/** Собирает поля одного раздела контента для редактора */
export function fieldsOf(
  all: Record<Locale, ContentNode>,
  section: string,
): EditorField[] {
  const source = all.uk[section];
  if (source === undefined) return [];

  return flattenFields(source, section).map((field) => ({
    path: field.path,
    values: Object.fromEntries(
      locales.map((locale) => {
        const value = readPath(all[locale], field.path);
        return [locale, typeof value === "string" ? value : ""];
      }),
    ) as Record<Locale, string>,
  }));
}

/** Значения одного поля по всем языкам */
export function fieldAt(
  all: Record<Locale, ContentNode>,
  path: string,
): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => {
      const value = readPath(all[locale], path);
      return [locale, typeof value === "string" ? value : ""];
    }),
  ) as Record<Locale, string>;
}
