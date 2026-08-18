import { Onest } from "next/font/google";
import { routing } from "@/i18n/routing";
import "./globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500"],
  variable: "--font-onest",
  display: "swap",
});

/**
 * 404 для адресов без языкового префикса. Корневой layout сквозной,
 * поэтому разметку html/body страница рисует сама.
 */
export default function NotFound() {
  return (
    <html lang="uk" className={`${onest.variable} antialiased`}>
      <body>
        <main className="shell flex min-h-screen flex-col justify-center py-[64px]">
          <p className="text-[72px] leading-none font-light text-blush-300 md:text-[96px]">
            404
          </p>
          <h1 className="mt-[16px] text-[24px] tracking-[-0.5px] uppercase md:text-[32px]">
            Сторінку не знайдено
          </h1>
          <a
            href={`/${routing.defaultLocale}`}
            className="mt-[32px] w-fit rounded-[4px] bg-ink px-[32px] py-[14px] text-[16px] font-medium text-white"
          >
            KIMS
          </a>
        </main>
      </body>
    </html>
  );
}
