import { setRequestLocale } from "next-intl/server";
import { getMedia, presentationFor } from "@/lib/media";
import { getContent } from "@/lib/content";
import { resolveImages } from "@/lib/images";
import type { Locale } from "@/i18n/routing";
import { Preloader } from "@/components/site/Preloader";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";
import { Stats } from "@/components/site/Stats";
import { Gallery } from "@/components/site/Gallery";
import { InvestBand } from "@/components/site/InvestBand";
import { Founder } from "@/components/site/Founder";
import { Market } from "@/components/site/Market";
import { Benefits } from "@/components/site/Benefits";
import { Formats } from "@/components/site/Formats";
import { Developers } from "@/components/site/Developers";
import { PackageSection } from "@/components/site/PackageSection";
import { CaseStudy } from "@/components/site/CaseStudy";
import { Steps } from "@/components/site/Steps";
import { LeadForm } from "@/components/site/LeadForm";
import { Footer } from "@/components/site/Footer";
import { CookieBanner } from "@/components/site/CookieBanner";
import { Analytics } from "@/components/site/Analytics";

// Страница статическая, но перепроверяется раз в минуту: после редеплоя
// она подхватит тексты из CONTENT_DIR, даже если сборка их не видела.
// Сохранение в админке обновляет страницу сразу, не дожидаясь этой минуты.
export const revalidate = 60;

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const media = await getMedia();
  const content = await getContent(locale as Locale);
  const images = resolveImages(
    media.images,
    content.alt as Record<string, string> | undefined,
  );

  return (
    <div id="top">
      <Preloader />
      <Header />
      <main>
        <Hero images={images} />
        <Stats />
        <Gallery images={images} />
        <InvestBand className="pt-[32px] md:pt-[40px] xl:pt-[52px]" />
        <Founder images={images} />
        <Market images={images} />
        <Benefits />
        <Formats />
        <InvestBand className="pt-[32px] md:pt-[40px] xl:pt-[52px]" />
        <Developers />
        <PackageSection images={images} />
        <CaseStudy slides={media.caseSlides} />
        <InvestBand className="pt-[32px] md:pt-[40px] xl:pt-[52px]" />
        <Steps images={images} />
        <LeadForm presentationUrl={presentationFor(media, locale)?.file} />
      </main>
      <Footer socialLinks={media.socialLinks ?? {}} />
      <CookieBanner />
      <Analytics />
    </div>
  );
}
