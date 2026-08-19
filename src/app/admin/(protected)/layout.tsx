import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthorized } from "@/lib/auth";
import { getIndexable } from "@/lib/site";
import { buildNav } from "@/lib/admin-nav";
import { getAdminDict, getAdminLang } from "@/lib/admin-lang";
import { AdminLangProvider } from "@/components/admin/AdminLangProvider";
import { AdminLangSwitch } from "@/components/admin/AdminLangSwitch";
import { logout } from "../actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthorized())) redirect("/admin/login");

  const [indexable, dict, lang] = await Promise.all([
    getIndexable(),
    getAdminDict(),
    getAdminLang(),
  ]);

  const groups = buildNav(dict);

  return (
    <AdminLangProvider dict={dict}>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <aside className="shrink-0 border-b border-line-soft bg-white lg:min-h-screen lg:w-[286px] lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between px-[24px] py-[20px]">
            <Link href="/admin" className="text-[16px] tracking-[2px]">
              KIMS
            </Link>
            <form action={logout}>
              <button
                type="submit"
                className="text-[13px] text-ink/50 transition-colors hover:text-ink"
              >
                {dict.common.logout}
              </button>
            </form>
          </div>

          <div className="flex items-center justify-between px-[24px] pb-[16px]">
            <span className="text-[12px] text-ink/40">
              {dict.common.interfaceLang}
            </span>
            <AdminLangSwitch current={lang} />
          </div>

          {/* Видимость для поиска — состояние, которое важно не потерять из виду */}
          <Link
            href="/admin/seo"
            className={`mx-[16px] mb-[16px] flex items-center gap-[10px] rounded-[4px] px-[12px] py-[10px] text-[13px] transition-opacity hover:opacity-80 ${
              indexable ? "bg-blush-50 text-ink" : "bg-ink text-white"
            }`}
          >
            <span
              className={`h-[8px] w-[8px] shrink-0 rounded-full ${
                indexable ? "bg-green-600" : "bg-accent"
              }`}
            />
            {indexable ? dict.indexing.open : dict.indexing.hidden}
          </Link>

          <nav className="flex flex-col gap-[20px] px-[16px] pb-[24px]">
            {groups.map((group) => (
              <div key={group.title} className="flex flex-col gap-[2px]">
                <p className="px-[12px] pb-[4px] text-[11px] tracking-[1px] text-ink/35 uppercase">
                  {group.title}
                </p>
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-[4px] px-[12px] py-[8px] text-[14px] transition-colors hover:bg-blush-50"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            ))}

            <Link
              href="/uk"
              target="_blank"
              className="rounded-[4px] px-[12px] py-[8px] text-[14px] text-ink/50 transition-colors hover:text-ink"
            >
              {dict.common.openSite}
            </Link>
          </nav>
        </aside>

        <main className="flex-1 px-[20px] py-[28px] lg:px-[40px] lg:py-[40px]">
          {children}
        </main>
      </div>
    </AdminLangProvider>
  );
}
