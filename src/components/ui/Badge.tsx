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
      className={`inline-flex w-fit items-center rounded-[4px] px-[20px] py-[12px] text-[14px] leading-none md:px-[28px] md:text-[16px] xl:h-[48px] xl:px-[37px] xl:py-0 xl:text-[18px] xl:tracking-[-0.36px] ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
