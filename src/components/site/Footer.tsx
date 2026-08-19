import { useTranslations } from "next-intl";
import { Logo } from "@/components/ui/Logo";

type Column = { title: string; links: Record<string, string> };

export function Footer({ socialLinks }: { socialLinks: Record<string, string> }) {
  const t = useTranslations("footer");
  const columns = t.raw("columns") as Column[];

  return (
    <footer className="mt-[56px] bg-ink text-white md:mt-[80px] xl:mt-[110px]">
      <div className="shell py-[40px] md:py-[56px] xl:py-[64px]">
        <div className="flex flex-col gap-[24px] md:flex-row md:items-center md:justify-between">
          <Logo className="h-[28px] w-auto text-white md:h-[36px] xl:h-[46px]" />
          <p className="text-[24px] leading-none font-light text-white/25 italic md:text-[36px] xl:text-[48px]">
            {t("tagline")}
          </p>
        </div>

        <div className="mt-[32px] grid grid-cols-2 gap-[16px] md:mt-[40px] md:grid-cols-4 md:gap-[20px]">
          {columns.map((column) => (
            <div
              key={column.title}
              className="flex flex-col gap-[12px] rounded-[4px] bg-ink-soft px-[20px] py-[24px] md:px-[24px] md:py-[28px]"
            >
              <p className="text-[14px] tracking-[1px] text-white/45 uppercase md:text-[16px]">
                {column.title}
              </p>
              <ul className="flex flex-col gap-[10px]">
                {Object.entries(column.links).map(([id, label]) => {
                  const href = socialLinks[id];
                  // пока адрес не задан, показываем подпись без ссылки —
                  // лучше, чем ссылка в никуда
                  return (
                    <li key={id}>
                      {href ? (
                        <a
                          href={href}
                          target="_blank"
                          rel="noreferrer noopener"
                          className="inline-block text-[14px] transition-all duration-300 hover:translate-x-[4px] hover:text-accent md:text-[16px]"
                        >
                          {label}
                        </a>
                      ) : (
                        <span className="inline-block text-[14px] text-white/40 md:text-[16px]">
                          {label}
                        </span>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <hr className="mt-[32px] border-white/15 md:mt-[40px]" />

        <div className="flex flex-col gap-[8px] pt-[20px] text-[13px] text-white/45 md:flex-row md:justify-between md:text-[14px]">
          <p>{t("signature")}</p>
          <p>{t("copyright")}</p>
        </div>
      </div>
    </footer>
  );
}
