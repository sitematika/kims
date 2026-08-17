import Link from "next/link";
import { redirect } from "next/navigation";
import { isAuthorized } from "@/lib/auth";
import { getContent, sectionLabels } from "@/lib/content";
import { logout } from "../actions";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!(await isAuthorized())) redirect("/admin/login");

  const uk = await getContent("uk");
  const sections = Object.keys(uk);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <aside className="shrink-0 border-b border-line-soft bg-white lg:min-h-screen lg:w-[280px] lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between px-[24px] py-[20px]">
          <p className="text-[16px] tracking-[2px]">KIMS</p>
          <form action={logout}>
            <button
              type="submit"
              className="text-[13px] text-ink/50 transition-colors hover:text-ink"
            >
              Выйти
            </button>
          </form>
        </div>

        <nav className="flex flex-wrap gap-[4px] px-[16px] pb-[16px] lg:flex-col lg:gap-[2px]">
          {sections.map((section) => (
            <Link
              key={section}
              href={`/admin/${section}`}
              className="rounded-[4px] px-[12px] py-[10px] text-[14px] transition-colors hover:bg-blush-50"
            >
              {sectionLabels[section] ?? section}
            </Link>
          ))}

          <Link
            href="/admin/case-slides"
            className="mt-[8px] rounded-[4px] px-[12px] py-[10px] text-[14px] transition-colors hover:bg-blush-50"
          >
            Слайдер кейса
          </Link>
          <Link
            href="/admin/leads"
            className="rounded-[4px] bg-blush-50 px-[12px] py-[10px] text-[14px] transition-colors hover:bg-blush-200"
          >
            Заявки
          </Link>
          <Link
            href="/uk"
            target="_blank"
            className="rounded-[4px] px-[12px] py-[10px] text-[14px] text-ink/50 transition-colors hover:text-ink"
          >
            Открыть сайт ↗
          </Link>
        </nav>
      </aside>

      <main className="flex-1 px-[20px] py-[28px] lg:px-[40px] lg:py-[40px]">
        {children}
      </main>
    </div>
  );
}
