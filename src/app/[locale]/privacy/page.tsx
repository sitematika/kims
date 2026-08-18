import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Logo } from "@/components/ui/Logo";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "privacy" });
  return { title: t("title"), robots: { index: false, follow: true } };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("privacy");
  const tNotFound = await getTranslations("notFound");

  return (
    <main className="shell flex min-h-screen flex-col py-[40px] md:py-[64px]">
      <Link href="/" aria-label="KIMS" className="w-fit">
        <Logo className="h-[22px] w-auto text-ink md:h-[26px]" />
      </Link>

      <h1 className="mt-[40px] text-[24px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[32px]">
        {t("title")}
      </h1>

      {/* Текст политики заказчик правит в админке — тут он выводится как есть,
          с сохранением переносов строк */}
      <div className="mt-[24px] max-w-[720px] text-[15px] leading-[1.6] whitespace-pre-line md:text-[16px]">
        {t("body")}
      </div>

      <Link
        href="/"
        className="mt-[40px] w-fit text-[15px] underline underline-offset-[6px] transition-opacity hover:opacity-70"
      >
        {tNotFound("action")}
      </Link>
    </main>
  );
}
