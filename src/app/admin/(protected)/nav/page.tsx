import { getAllContent } from "@/lib/content";
import { getAdminDict } from "@/lib/admin-lang";
import { fieldsOf } from "@/lib/admin-fields";
import { FieldsForm } from "@/components/admin/FieldsForm";

/** Шапка и подписи кнопок — короткие тексты, живут на одной странице */
export default async function NavPage() {
  const [all, dict] = await Promise.all([getAllContent(), getAdminDict()]);

  return (
    <FieldsForm
      section="nav"
      title={dict.sections.nav}
      groups={[
        { title: dict.sections.nav, fields: fieldsOf(all, "nav") },
        { title: dict.sections.cta, fields: fieldsOf(all, "cta") },
      ]}
    />
  );
}
