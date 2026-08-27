/**
 * Иконки разделов панели.
 *
 * Свои, а не библиотека: их полтора десятка, все — линии на сетке 24×24
 * с одинаковой толщиной. Пакет ради этого тянуть незачем, а единый стиль
 * так держать проще.
 */

const base = {
  width: 18,
  height: 18,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const paths: Record<string, React.ReactNode> = {
  home: <path d="M4 10.5 12 4l8 6.5V20H4z" />,
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  hero: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 9h18" />
    </>
  ),
  stats: <path d="M5 20V10m7 10V4m7 16v-6" />,
  gallery: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="m4 16 4.5-4.5 4 4L16 12l4 4" />
      <circle cx="9" cy="9" r="1.4" />
    </>
  ),
  founder: (
    <>
      <circle cx="12" cy="8.5" r="3.5" />
      <path d="M5 20c0-3.6 3.1-6 7-6s7 2.4 7 6" />
    </>
  ),
  market: (
    <>
      <path d="M4 18 9 12l4 3.5L20 7" />
      <path d="M20 11V7h-4" />
    </>
  ),
  benefits: (
    <>
      <path d="m9 12.5 2 2 4.5-4.5" />
      <circle cx="12" cy="12" r="8.5" />
    </>
  ),
  formats: (
    <>
      <rect x="3" y="5" width="8" height="14" rx="1.6" />
      <rect x="13" y="5" width="8" height="14" rx="1.6" />
    </>
  ),
  developers: (
    <>
      <path d="M4 20V8l6-4 6 4v12" />
      <path d="M16 20V11h4v9" />
      <path d="M8 11h4M8 15h4" />
    </>
  ),
  package: (
    <>
      <path d="M3.5 7.5 12 4l8.5 3.5v9L12 20l-8.5-3.5z" />
      <path d="M3.5 7.5 12 11l8.5-3.5M12 11v9" />
    </>
  ),
  case: (
    <>
      <rect x="3" y="7" width="18" height="13" rx="2" />
      <path d="M8.5 7V5.5A1.5 1.5 0 0 1 10 4h4a1.5 1.5 0 0 1 1.5 1.5V7" />
    </>
  ),
  steps: (
    <>
      <path d="M4 19h4v-4H4zM10 19h4V9h-4zM16 19h4V5h-4z" />
    </>
  ),
  lead: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </>
  ),
  invest: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5v9M14.5 10c-.5-.9-1.4-1.2-2.5-1.2-1.4 0-2.3.7-2.3 1.7 0 2.4 5 1.3 5 3.8 0 1.1-1 1.9-2.5 1.9-1.2 0-2.2-.4-2.7-1.3" />
    </>
  ),
  nav: <path d="M4 7h16M4 12h16M4 17h10" />,
  footer: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M3 15h18" />
    </>
  ),
  images: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10" r="1.6" />
      <path d="m4 17 5-4.5 3.5 3L16 12l4 3.5" />
    </>
  ),
  slides: (
    <>
      <rect x="6" y="5" width="12" height="14" rx="2" />
      <path d="M3 8v8M21 8v8" />
    </>
  ),
  presentation: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
      <path d="M9 13h6M9 17h4" />
    </>
  ),
  seo: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2.2 2.4 3.3 5.4 3.3 8.5s-1.1 6.1-3.3 8.5c-2.2-2.4-3.3-5.4-3.3-8.5S9.8 5.9 12 3.5" />
    </>
  ),
  service: (
    <>
      <path d="M6 3h8l4 4v14H6z" />
      <path d="M14 3v4h4" />
    </>
  ),
  leads: (
    <>
      <path d="M4 19v-1.5A4.5 4.5 0 0 1 8.5 13h3A4.5 4.5 0 0 1 16 17.5V19" />
      <circle cx="10" cy="7.5" r="3.5" />
      <path d="M17.5 12.5 19 14l3-3" />
    </>
  ),
  history: (
    <>
      <path d="M3.5 12a8.5 8.5 0 1 0 2.6-6.1" />
      <path d="M3.5 4.5V9H8" />
      <path d="M12 8v4.5l3 1.8" />
    </>
  ),
  users: (
    <>
      <circle cx="9" cy="8" r="3.5" />
      <path d="M2.5 19c0-3.3 2.9-5.5 6.5-5.5s6.5 2.2 6.5 5.5" />
      <path d="M16.5 5.2a3.5 3.5 0 0 1 0 5.6M18 13.8c2.1.7 3.5 2.4 3.5 4.7" />
    </>
  ),
  access: (
    <>
      <rect x="4.5" y="10" width="15" height="10" rx="2" />
      <path d="M8 10V7.5a4 4 0 0 1 8 0V10" />
    </>
  ),
  logout: (
    <>
      <path d="M15 5V4a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-1" />
      <path d="M11 12h10M18 9l3 3-3 3" />
    </>
  ),
  site: (
    <>
      <path d="M14 4h6v6" />
      <path d="M20 4 10 14" />
      <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
    </>
  ),
};

export function Icon({ name, className }: { name: string; className?: string }) {
  const shape = paths[name];
  if (!shape) return <span className={`inline-block h-[18px] w-[18px] ${className ?? ""}`} />;

  return (
    <svg {...base} className={`shrink-0 ${className ?? ""}`}>
      {shape}
    </svg>
  );
}

/** Какая иконка какому пункту меню соответствует */
export function iconFor(href: string) {
  const key = href.replace("/admin", "").replace("/", "") || "home";
  const map: Record<string, string> = {
    "": "home",
    home: "home",
    search: "search",
    hero: "hero",
    stats: "stats",
    gallery: "gallery",
    founder: "founder",
    market: "market",
    benefits: "benefits",
    formats: "formats",
    developers: "developers",
    package: "package",
    case: "case",
    steps: "steps",
    lead: "lead",
    invest: "invest",
    nav: "nav",
    footer: "footer",
    images: "images",
    "case-slides": "slides",
    presentation: "presentation",
    seo: "seo",
    service: "service",
    leads: "leads",
    history: "history",
    users: "users",
    access: "access",
  };
  return map[key] ?? "hero";
}
