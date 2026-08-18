"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const KEY = "kims-cookie-consent";

/**
 * Счётчики подключаются только после согласия. Пока идентификаторы не заданы
 * в окружении, компонент не делает ничего.
 */
export function Analytics() {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const read = () => setAllowed(window.localStorage.getItem(KEY) === "all");
    read();
    window.addEventListener("kims-consent", read);
    return () => window.removeEventListener("kims-consent", read);
  }, []);

  if (!gaId || !allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${gaId}');`}
      </Script>
    </>
  );
}
