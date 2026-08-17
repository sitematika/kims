import type { Metadata } from "next";
import { Onest } from "next/font/google";
import "../globals.css";

const onest = Onest({
  subsets: ["latin", "cyrillic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-onest",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KIMS — админка",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru" className={`${onest.variable} antialiased`}>
      <body className="bg-paper">{children}</body>
    </html>
  );
}
