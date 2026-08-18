import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Onest } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeHtmlLang, routing, type Locale } from "@/i18n/routing";
import { getMedia } from "@/lib/media";
import { isIndexable, siteUrl } from "@/lib/site";
import "../globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-onest",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const { ogImage } = await getMedia();

  const title = t("title");
  const description = t("description");
  // отдельные заголовок и описание для соцсетей — если их не задали,
  // берутся обычные
  const ogTitle = t.has("ogTitle") && t("ogTitle") ? t("ogTitle") : title;
  const ogDescription =
    t.has("ogDescription") && t("ogDescription")
      ? t("ogDescription")
      : description;

  return {
    metadataBase: new URL(siteUrl),
    title,
    description,
    robots: isIndexable ? undefined : { index: false, follow: false },
    alternates: {
      canonical: `/${locale}`,
      languages: Object.fromEntries(
        routing.locales.map((l) => [localeHtmlLang[l], `/${l}`]),
      ),
    },
    openGraph: {
      type: "website",
      siteName: "KIMS",
      url: `${siteUrl}/${locale}`,
      locale: localeHtmlLang[locale as Locale],
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();

  setRequestLocale(locale);

  return (
    <html
      lang={localeHtmlLang[locale as Locale]}
      className={`${onest.variable} antialiased`}
    >
      <body>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
