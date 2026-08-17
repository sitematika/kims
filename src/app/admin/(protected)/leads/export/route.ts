import { readFile } from "node:fs/promises";
import path from "node:path";
import { isAuthorized } from "@/lib/auth";

export const runtime = "nodejs";

function cell(value: unknown) {
  const text = String(value ?? "").replace(/"/g, '""');
  return `"${text}"`;
}

export async function GET() {
  if (!(await isAuthorized())) {
    return new Response("Unauthorized", { status: 401 });
  }

  let lines: string[] = [];
  try {
    const raw = await readFile(
      path.join(process.cwd(), "data", "leads.jsonl"),
      "utf8",
    );
    lines = raw.split("\n").filter(Boolean);
  } catch {
    lines = [];
  }

  const header = ["createdAt", "name", "phone", "city", "locale"];
  const rows = lines.map((line) => {
    const lead = JSON.parse(line) as Record<string, unknown>;
    return header.map((key) => cell(lead[key])).join(",");
  });

  // BOM, чтобы Excel не ломал кириллицу
  const csv = `﻿${header.join(",")}\n${rows.join("\n")}\n`;

  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": 'attachment; filename="kims-leads.csv"',
    },
  });
}
