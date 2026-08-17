import { setRequestLocale } from "next-intl/server";
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

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div id="top">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Gallery />
        <InvestBand className="pt-[56px] md:pt-[80px] xl:pt-[110px]" />
        <Founder />
        <Market />
        <Benefits />
        <Formats />
        <InvestBand className="pt-[56px] md:pt-[80px] xl:pt-[110px]" />
        <Developers />
        <PackageSection />
        <CaseStudy />
        <InvestBand className="pt-[56px] md:pt-[80px] xl:pt-[110px]" />
        <Steps />
        <LeadForm />
      </main>
      <Footer />
    </div>
  );
}
