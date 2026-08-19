import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    // загруженные через админку файлы отдаёт маршрут /media/*
    localPatterns: [{ pathname: "/img/**" }, { pathname: "/media/**" }],
  },
  async redirects() {
    return [
      // На старом сайте было ровно две проиндексированные страницы.
      // Главная попадает на локаль сама, политику уводим на новую.
      {
        source: "/privacy-policy",
        destination: "/privacy",
        permanent: true,
      },
    ];
  },
  experimental: {
    serverActions: {
      // через админку грузятся фото с телефона и PDF-презентация,
      // дефолтного лимита в 1 МБ не хватает
      bodySizeLimit: "40mb",
    },
  },
};

export default withNextIntl(nextConfig);
