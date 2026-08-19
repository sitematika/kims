import type { Metadata } from "next";
import { Onest } from "next/font/google";
import { getAdminDict, getAdminLang } from "@/lib/admin-lang";
import "../globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-onest",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getAdminDict();
  return { title: dict.login.title, robots: { index: false, follow: false } };
}

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const lang = await getAdminLang();

  return (
    <html lang={lang} className={`${onest.variable} antialiased`}>
      <body className="bg-paper">{children}</body>
    </html>
  );
}
