// Корневой layout — сквозной. Разметку html/body рендерит src/app/[locale]/layout.tsx,
// чтобы атрибут lang зависел от языка, а /admin жил вне локализованных маршрутов.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
