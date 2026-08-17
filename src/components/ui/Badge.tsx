export function Badge({
  children,
  tone = "blush",
  className = "",
}: {
  children: React.ReactNode;
  tone?: "blush" | "dark";
  className?: string;
}) {
  const tones = {
    blush: "bg-blush-50 text-ink",
    dark: "bg-ink-soft text-white",
  };
  return (
    <span
      className={`inline-flex w-fit items-center rounded-[4px] px-[20px] py-[12px] text-[14px] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
