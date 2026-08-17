import { setRequestLocale } from "next-intl/server";
import { Header } from "@/components/site/Header";
import { Hero } from "@/components/site/Hero";

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
      </main>
    </div>
  );
}
