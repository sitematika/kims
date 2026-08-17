import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

type Variant = "dark" | "blush" | "accent";

const base =
  "inline-flex items-center justify-center rounded-[4px] text-center font-medium whitespace-nowrap transition-all duration-300 hover:-translate-y-[2px] hover:shadow-[0_10px_24px_rgba(30,30,30,0.16)] active:translate-y-0 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink";

const variants: Record<Variant, string> = {
  dark: "bg-ink text-white hover:bg-ink-soft",
  blush: "bg-blush-50 text-ink hover:bg-blush-200 backdrop-blur-[4px]",
  // Розовая кнопка с мраморной текстурой из макета
  accent:
    "relative text-white bg-blush-300 hover:bg-accent bg-[url('/img/button-texture.webp')] bg-cover bg-center",
};

const sizes = {
  sm: "h-[40px] px-[20px] text-[14px]",
  md: "h-[52px] px-[32px] text-[16px]",
  lg: "h-[56px] px-[32px] text-[16px] md:h-[76px] md:px-[48px] md:text-[18px] md:tracking-[-0.36px]",
} as const;

type Size = keyof typeof sizes;

type Props = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
} & Omit<ComponentProps<typeof Link>, "className" | "children">;

export function Button({
  variant = "dark",
  size = "lg",
  className = "",
  children,
  ...rest
}: Props) {
  return (
    <Link
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}

export const buttonClasses = (
  variant: Variant = "dark",
  size: Size = "lg",
  className = "",
) => `${base} ${variants[variant]} ${sizes[size]} ${className}`;
