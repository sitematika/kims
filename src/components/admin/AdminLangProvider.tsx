"use client";

import { createContext, useContext } from "react";
import type { AdminDict, AdminLang } from "@/lib/admin-lang";

type Value = { dict: AdminDict; lang: AdminLang };

const Ctx = createContext<Value | null>(null);

export function AdminLangProvider({
  dict,
  lang,
  children,
}: {
  dict: AdminDict;
  lang: AdminLang;
  children: React.ReactNode;
}) {
  return <Ctx.Provider value={{ dict, lang }}>{children}</Ctx.Provider>;
}

function useCtx() {
  const value = useContext(Ctx);
  if (!value) throw new Error("AdminLangProvider не найден");
  return value;
}

/** Словарь панели в клиентских компонентах */
export function useDict(): AdminDict {
  return useCtx().dict;
}

/** Текущий язык панели — нужен подписям полей */
export function useLang(): AdminLang {
  return useCtx().lang;
}
