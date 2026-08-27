import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Склейка классов Tailwind с разрешением конфликтов.
 *
 * Нужна компонентам из внешних реестров (React Bits, shadcn): они принимают
 * className снаружи и ожидают, что он перебьёт их собственные классы, а не
 * встанет рядом. Без twMerge `px-[20px]` из пропса и `px-4` внутри компонента
 * дрались бы порядком в CSS, а не порядком в коде.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
