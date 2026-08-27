import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { dataDir } from "./paths";

/** Локальный журнал заявок: по строке JSON на заявку, свежие сверху */
export type Lead = {
  name: string;
  phone: string;
  city: string;
  locale: string;
  createdAt: string;
};

const file = () => path.join(dataDir, "leads.jsonl");

/** Политика обещает хранить заявки до двух лет — столько и храним */
const KEEP = 2 * 365 * 24 * 60 * 60 * 1000;

export async function readLeads(): Promise<Lead[]> {
  try {
    const raw = await readFile(file(), "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Lead)
      .reverse();
  } catch {
    return [];
  }
}

/**
 * Записывает заявку и заодно вычищает всё старше двух лет.
 *
 * Чистка на записи, а не по расписанию: заявок на лендинге единицы,
 * перечитать файл дешевле, чем заводить отдельную задачу. Обещание из
 * политики конфиденциальности должно выполняться само, без напоминаний.
 */
export async function appendLead(lead: Record<string, unknown>) {
  await mkdir(dataDir, { recursive: true });

  const edge = Date.now() - KEEP;
  const kept: string[] = [];

  try {
    const raw = await readFile(file(), "utf8");
    for (const line of raw.split("\n").filter(Boolean)) {
      try {
        const item = JSON.parse(line) as { createdAt?: string };
        if (new Date(item.createdAt ?? 0).getTime() >= edge) kept.push(line);
      } catch {
        // битую строку не тащим дальше
      }
    }
  } catch {
    // журнала ещё нет
  }

  kept.push(JSON.stringify(lead));
  await writeFile(file(), `${kept.join("\n")}\n`, "utf8");
}
