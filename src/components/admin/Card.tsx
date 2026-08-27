/**
 * Общая поверхность панели.
 *
 * Раньше каждый блок описывал рамку и отступы сам, и они разъезжались.
 * Здесь один вид карточки на всю админку: мягкий угол, тонкая рамка,
 * тень почти незаметная — фон рабочей области и так приглушён.
 */
export function Card({
  title,
  aside,
  children,
  className = "",
}: {
  title?: string;
  /** Что показать справа от заголовка: счётчик, ссылка «Усі» */
  aside?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`rounded-[12px] border border-line-soft bg-white p-[20px] shadow-[0_1px_2px_rgba(30,30,30,0.04)] ${className}`}
    >
      {(title || aside) && (
        <div className="mb-[14px] flex flex-wrap items-baseline justify-between gap-[12px]">
          {title && <h2 className="text-[15px] font-medium">{title}</h2>}
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}
