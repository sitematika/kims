"use client";

import { useEffect, useState } from "react";

const KEY = "kims-cookie-consent";

/**
 * Произвольный код из админки: виджеты, чаты, пиксели.
 *
 * Источник кода — не посетитель, а владелец сайта из закрытой панели: тот,
 * кто и так может менять любую разметку. Санитайзер здесь бессмысленен —
 * подключить сторонний скрипт как раз и есть задача поля.
 *
 * Разметка разбирается через DOMParser (он ничего не выполняет), а теги
 * script пересобираются заново: перенесённый как есть узел браузер не
 * запустит. Из-за этого код срабатывает после загрузки страницы — виджетам
 * и счётчикам это подходит, а для мета-тегов подтверждения прав есть
 * отдельное поле: их поисковик должен увидеть в исходном HTML.
 */
function inject(target: HTMLElement, code: string) {
  const parsed = new DOMParser().parseFromString(code, "text/html");
  const source = [...parsed.head.childNodes, ...parsed.body.childNodes];

  const added: ChildNode[] = [];
  for (const node of source) {
    if (node.nodeName === "SCRIPT") {
      const original = node as HTMLScriptElement;
      const script = document.createElement("script");
      for (const attr of Array.from(original.attributes)) {
        script.setAttribute(attr.name, attr.value);
      }
      script.text = original.text;
      target.appendChild(script);
      added.push(script);
    } else {
      target.appendChild(node);
      added.push(node as ChildNode);
    }
  }

  return () => added.forEach((node) => node.remove());
}

export function CustomCode({
  head,
  body,
  afterConsent,
}: {
  head?: string;
  body?: string;
  /** Ждать согласия на cookie — так подключают счётчики и пиксели */
  afterConsent?: boolean;
}) {
  const [allowed, setAllowed] = useState(!afterConsent);

  useEffect(() => {
    if (!afterConsent) return;
    const read = () => setAllowed(window.localStorage.getItem(KEY) === "all");
    read();
    window.addEventListener("kims-consent", read);
    return () => window.removeEventListener("kims-consent", read);
  }, [afterConsent]);

  useEffect(() => {
    if (!allowed || !head) return;
    return inject(document.head, head);
  }, [allowed, head]);

  useEffect(() => {
    if (!allowed || !body) return;
    return inject(document.body, body);
  }, [allowed, body]);

  return null;
}
