"use client";

import { createContext, useContext } from "react";
import type { AdminDict } from "@/lib/admin-lang";

const Ctx = createContext<AdminDict | null>(null);

export function AdminLangProvider({
  dict,
  children,
}: {
  dict: AdminDict;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={dict}>{children}</Ctx.Provider>;
}

/** Словарь панели в клиентских компонентах */
export function useDict(): AdminDict {
  const dict = useContext(Ctx);
  if (!dict) throw new Error("AdminLangProvider не найден");
  return dict;
}
