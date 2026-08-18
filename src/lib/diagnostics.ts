import { access, constants, mkdir } from "node:fs/promises";
import { contentDir, dataDir, uploadsDir } from "./paths";

export type DirStatus = {
  label: string;
  path: string;
  writable: boolean;
  note: string;
};

async function check(label: string, dir: string): Promise<DirStatus> {
  try {
    await access(dir, constants.W_OK);
    return { label, path: dir, writable: true, note: "доступна на запись" };
  } catch {
    // каталога может не быть — пробуем создать
  }

  try {
    await mkdir(dir, { recursive: true });
    return { label, path: dir, writable: true, note: "создана" };
  } catch (error) {
    const code = (error as NodeJS.ErrnoException).code;
    return {
      label,
      path: dir,
      writable: false,
      note:
        code === "EACCES" || code === "EPERM"
          ? "нет прав на запись — проверьте путь в переменных хостинга"
          : `недоступна (${code ?? "ошибка"})`,
    };
  }
}

/** Куда пишет админка и получается ли туда писать */
export async function checkDataDirs(): Promise<DirStatus[]> {
  return Promise.all([
    check("Тексты и настройки", contentDir),
    check("Загруженные файлы", uploadsDir),
    check("Заявки", dataDir),
  ]);
}
