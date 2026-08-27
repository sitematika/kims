"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const KEY = "kims-cookie-consent";

/**
 * Счётчики подключаются только после согласия: пока посетитель не нажал
 * «Принять», на страницу не попадает ни один сторонний скрипт. Это строже
 * Consent Mode — GTM просто не грузится, а не грузится с урезанными правами.
 *
 * Идентификатор контейнера задаётся в админке; NEXT_PUBLIC_GA_ID остаётся
 * запасным путём для прямого подключения GA без диспетчера тегов.
 */
export function Analytics({ gtmId }: { gtmId?: string }) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const read = () => setAllowed(window.localStorage.getItem(KEY) === "all");
    read();
    window.addEventListener("kims-consent", read);
    return () => window.removeEventListener("kims-consent", read);
  }, []);

  if (!allowed) return null;

  return (
    <>
      {gtmId && (
        <Script id="gtm-init" strategy="afterInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');`}
        </Script>
      )}

      {/* Прямой GA — только если диспетчер тегов не подключён,
          иначе счётчик задвоится */}
      {!gtmId && gaId && (
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
      )}
    </>
  );
}
