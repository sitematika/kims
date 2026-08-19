/**
 * Структура меню админки.
 *
 * Разделы контента идут в том же порядке, что и блоки на странице, —
 * так проще найти нужный текст, не помня названий.
 */

export type NavLink = { href: string; label: string };
export type NavGroup = { title: string; links: NavLink[] };

const section = (key: string, label: string): NavLink => ({
  href: `/admin/${key}`,
  label,
});

export const navGroups: NavGroup[] = [
  {
    title: "Тексты страницы",
    links: [
      section("hero", "Первый экран"),
      section("stats", "Цифры"),
      section("gallery", "Галерея"),
      section("founder", "От основателя"),
      section("market", "О бренде и рынке"),
      section("benefits", "Что вы получаете"),
      section("formats", "Форматы"),
      section("developers", "Для девелоперов"),
      section("package", "Пакет партнёра"),
      section("case", "Кейс Риги"),
      section("steps", "Шаги"),
      section("lead", "Форма заявки"),
      section("invest", "Полоса «Инвестиции»"),
    ],
  },
  {
    title: "Общее по сайту",
    links: [
      section("nav", "Меню и шапка"),
      section("cta", "Кнопки"),
      section("footer", "Футер"),
      { href: "/admin/social", label: "Ссылки на соцсети" },
    ],
  },
  {
    title: "Фото и файлы",
    links: [
      { href: "/admin/images", label: "Картинки сайта" },
      section("alt", "Alt-тексты картинок"),
      { href: "/admin/case-slides", label: "Слайдер кейса" },
      { href: "/admin/presentation", label: "Презентация" },
    ],
  },
  {
    title: "SEO и видимость",
    links: [
      { href: "/admin/settings", label: "Настройки и доступ" },
      section("meta", "Заголовки и описания"),
    ],
  },
  {
    title: "Служебные страницы",
    links: [
      section("cookies", "Cookie-баннер"),
      section("privacy", "Политика конфиденциальности"),
      section("notFound", "Страница 404"),
    ],
  },
  {
    title: "Работа с сайтом",
    links: [
      { href: "/admin/leads", label: "Заявки" },
      { href: "/admin/history", label: "История изменений" },
    ],
  },
];
