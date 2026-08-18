import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";
import { buttonClasses } from "@/components/ui/Button";

export default function LocaleNotFound() {
  const t = useTranslations("notFound");

  return (
    <main className="shell flex min-h-screen flex-col justify-center py-[64px]">
      <Logo className="h-[24px] w-auto text-ink" />

      <p className="mt-[48px] text-[72px] leading-none font-light text-blush-300 md:text-[96px]">
        {t("code")}
      </p>

      <h1 className="mt-[16px] text-[24px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[32px]">
        {t("title")}
      </h1>

      <p className="mt-[12px] max-w-[520px] text-[15px] text-ink/70 md:text-[16px]">
        {t("text")}
      </p>

      <Link href="/" className={buttonClasses("dark", "md", "mt-[32px] w-fit")}>
        {t("action")}
      </Link>
    </main>
  );
}
