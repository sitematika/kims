import Link from "next/link";
import { redirect } from "next/navigation";
import { currentActor, isAuthorized } from "@/lib/auth";
import { getIndexable } from "@/lib/site";
import { buildNav } from "@/lib/admin-nav";
import { getAdminDict, getAdminLang } from "@/lib/admin-lang";
import { AdminLangProvider } from "@/components/admin/AdminLangProvider";
import { AdminLangSwitch } from "@/components/admin/AdminLangSwitch";
import { AdminNav } from "@/components/admin/AdminNav";
import { Icon } from "@/components/admin/icons";
import { logout } from "../actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthorized())) redirect("/admin/login");

  const [indexable, dict, lang, actor] = await Promise.all([
    getIndexable(),
    getAdminDict(),
    getAdminLang(),
    currentActor(),
  ]);

  const groups = buildNav(dict);

  return (
    <AdminLangProvider dict={dict} lang={lang}>
      <div className="flex min-h-screen flex-col bg-paper/60 lg:flex-row">
        {/* меню стоит на месте при прокрутке; разделов много, поэтому
            при нехватке высоты оно прокручивается внутри себя */}
        <aside className="shrink-0 border-b border-line-soft bg-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:w-[286px] lg:shrink-0 lg:flex-col lg:overflow-y-auto lg:border-r lg:border-b-0">
          <div className="flex items-center justify-between px-[20px] pt-[20px] pb-[14px]">
            <Link
              href="/admin"
              className="text-[15px] tracking-[3px] transition-opacity hover:opacity-70"
            >
              KIMS
            </Link>
            <AdminLangSwitch current={lang} />
          </div>

          <div className="mx-[12px] mb-[12px] flex items-center gap-[10px] rounded-[10px] bg-paper px-[12px] py-[10px]">
            <span className="flex h-[28px] w-[28px] shrink-0 items-center justify-center rounded-full bg-ink text-[12px] font-medium text-white">
              {(actor?.name ?? "?").trim().charAt(0).toUpperCase()}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[13px]">{actor?.name}</span>
              {actor?.email && (
                <span className="block truncate text-[11px] text-ink/45">
                  {actor.email}
                </span>
              )}
            </span>
            <form action={logout}>
              <button
                type="submit"
                title={dict.common.logout}
                aria-label={dict.common.logout}
                className="flex h-[28px] w-[28px] items-center justify-center rounded-[7px] text-ink/40 transition-colors hover:bg-white hover:text-ink"
              >
                <Icon name="logout" />
              </button>
            </form>
          </div>

          {/* Видимость для поиска — состояние, которое важно не потерять из виду */}
          <Link
            href="/admin/seo"
            className={`mx-[12px] mb-[16px] flex items-center gap-[10px] rounded-[10px] px-[12px] py-[10px] text-[13px] transition-opacity hover:opacity-80 ${
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

          <AdminNav groups={groups} openSite={dict.common.openSite} />

        </aside>

        <main className="flex-1 px-[20px] py-[28px] lg:px-[44px] lg:py-[40px]">
          {children}
        </main>
      </div>
    </AdminLangProvider>
  );
}
