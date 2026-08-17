/** Пункты меню и якоря секций — единый источник для шапки и разметки страницы. */
export const navItems = [
  { id: "kims", key: "kims" },
  { id: "brand", key: "brand" },
  { id: "benefits", key: "benefits" },
  { id: "formats", key: "formats" },
  { id: "developers", key: "developers" },
  { id: "package", key: "package" },
  { id: "case", key: "case" },
  { id: "steps", key: "steps" },
] as const;

export type NavItem = (typeof navItems)[number];
