import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { uploadsDir } from "@/lib/paths";

export const runtime = "nodejs";

const types: Record<string, string> = {
  ".webp": "image/webp",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".pdf": "application/pdf",
};

/**
 * Отдаёт файлы, загруженные через админку. Они лежат вне папки приложения
 * (UPLOADS_DIR), поэтому статикой Next их не отдать — нужен свой маршрут.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path: segments } = await params;

  // никаких переходов вверх по дереву
  const safe = segments.filter((s) => s && s !== "." && s !== "..");
  if (safe.length !== segments.length) {
    return new Response("Not found", { status: 404 });
  }

  const target = path.join(uploadsDir, ...safe);
  if (!target.startsWith(uploadsDir)) {
    return new Response("Not found", { status: 404 });
  }

  try {
    const info = await stat(target);
    if (!info.isFile()) return new Response("Not found", { status: 404 });

    const file = await readFile(target);
    const type = types[path.extname(target).toLowerCase()] ?? "application/octet-stream";

    return new Response(new Uint8Array(file), {
      headers: {
        "content-type": type,
        "content-length": String(info.size),
        "cache-control": "public, max-age=3600, must-revalidate",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
