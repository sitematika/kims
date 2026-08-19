import { getAllContent } from "@/lib/content";
import { getAdminDict } from "@/lib/admin-lang";
import { fieldsOf } from "@/lib/admin-fields";
import { FieldsForm } from "@/components/admin/FieldsForm";

/** Мелкие служебные тексты: баннер, политика, 404 — в одном месте */
export default async function ServicePage() {
  const [all, dict] = await Promise.all([getAllContent(), getAdminDict()]);

  return (
    <FieldsForm
      section="service"
      title={dict.nav.servicePages}
      groups={[
        { title: dict.sections.cookies, fields: fieldsOf(all, "cookies") },
        { title: dict.sections.privacy, fields: fieldsOf(all, "privacy") },
        { title: dict.sections.notFound, fields: fieldsOf(all, "notFound") },
      ]}
    />
  );
}
