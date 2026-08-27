import { readFile } from "node:fs/promises";
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

export async function readLeads(): Promise<Lead[]> {
  try {
    const raw = await readFile(path.join(dataDir, "leads.jsonl"), "utf8");
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Lead)
      .reverse();
  } catch {
    return [];
  }
}
