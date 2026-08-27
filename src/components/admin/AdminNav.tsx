"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import type { NavGroup } from "@/lib/admin-nav";
import { Icon, iconFor } from "./icons";

/**
 * Меню панели.
 *
 * Подсветка активного пункта переезжает плавно: один общий слой с layoutId
 * вместо мигающего фона у каждой ссылки. Так видно, куда переместился фокус,
 * а не просто «что-то поменялось».
 */
export function AdminNav({
  groups,
  openSite,
}: {
  groups: NavGroup[];
  openSite: string;
}) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-[18px] px-[12px] pb-[24px]">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-[1px]">
          <p className="px-[12px] pb-[6px] text-[10px] font-medium tracking-[1.2px] text-ink/30 uppercase">
            {group.title}
          </p>

          {group.links.map((link) => {
            // «/admin» активен только сам по себе, иначе подсветится всегда
            const active =
              link.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex items-center gap-[10px] rounded-[8px] px-[12px] py-[8px] text-[14px] transition-colors ${
                  active ? "text-ink" : "text-ink/65 hover:text-ink"
                }`}
              >
                {active && (
                  <motion.span
                    layoutId="admin-nav-active"
                    transition={{ type: "spring", stiffness: 420, damping: 34 }}
                    className="absolute inset-0 -z-10 rounded-[8px] bg-blush-50"
                  />
                )}
                <Icon
                  name={iconFor(link.href)}
                  className={active ? "text-accent" : "text-ink/35"}
                />
                <span className="truncate">{link.label}</span>
              </Link>
            );
          })}
        </div>
      ))}

      <Link
        href="/uk"
        target="_blank"
        className="mt-[4px] flex items-center gap-[10px] rounded-[8px] px-[12px] py-[8px] text-[14px] text-ink/45 transition-colors hover:text-ink"
      >
        <Icon name="site" className="text-ink/30" />
        {openSite}
      </Link>
    </nav>
  );
}
