/**
 * Куда вести кнопку «Подивитись на сайті» из редактора раздела.
 * Ключ — раздел контента, значение — якорь блока на украинской версии.
 */
export const sectionAnchors: Record<string, string> = {
  hero: "/uk#kims",
  stats: "/uk#stats",
  gallery: "/uk#gallery",
  founder: "/uk#founder",
  market: "/uk#brand",
  benefits: "/uk#benefits",
  formats: "/uk#formats",
  developers: "/uk#developers",
  package: "/uk#package",
  case: "/uk#case",
  steps: "/uk#steps",
  lead: "/uk#lead",
  invest: "/uk#kims",
  nav: "/uk#top",
  footer: "/uk#footer",
  meta: "/uk",
};

/**
 * Где раздел реально редактируется. У части разделов своя страница:
 * alt лежит рядом с картинками, служебные тексты — на одной странице,
 * meta — вместе с настройками SEO.
 */
const ownPage: Record<string, string> = {
  meta: "/admin/seo",
  alt: "/admin/images",
  cookies: "/admin/service",
  privacy: "/admin/service",
  notFound: "/admin/service",
  cta: "/admin/nav",
};

export function sectionHref(section: string) {
  return ownPage[section] ?? `/admin/${section}`;
}
