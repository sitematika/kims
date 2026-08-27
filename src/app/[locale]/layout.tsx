import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Onest } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { localeHtmlLang, routing, type Locale } from "@/i18n/routing";
import { getSettings } from "@/lib/settings";
import { getMedia } from "@/lib/media";
import { getIndexable, getSiteUrl } from "@/lib/site";
import "../globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-onest",
  display: "swap",
});

/**
 * Разбирает вставленные мета-теги в пары «имя — значение».
 * Их нужно отдавать в исходном HTML, поэтому скриптом их не вставить.
 */
function parseVerificationTags(raw?: string) {
  if (!raw) return undefined;

  const pairs: Record<string, string> = {};
  const tag = /<meta\s+name=["']([^"']+)["']\s+content=["']([^"']+)["']/gi;
  for (const match of raw.matchAll(tag)) pairs[match[1]] = match[2];

  return Object.keys(pairs).length ? pairs : undefined;
}

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
  const [siteUrl, isIndexable, settings] = await Promise.all([
    getSiteUrl(),
    getIndexable(),
    getSettings(),
  ]);

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
    // подтверждение прав в Search Console работает и при закрытой индексации
    verification: settings.googleVerification
      ? { google: settings.googleVerification }
      : undefined,
    // прочие подтверждения — Bing, Facebook и т.п. — вставленными тегами
    other: parseVerificationTags(settings.verificationTags),
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
