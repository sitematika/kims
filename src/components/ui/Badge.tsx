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
      className={`inline-flex h-[36px] w-fit items-center rounded-[4px] px-[18px] text-[13px] leading-none md:h-[40px] md:px-[24px] md:text-[14px] xl:px-[28px] xl:text-[15px] xl:tracking-[-0.3px] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
