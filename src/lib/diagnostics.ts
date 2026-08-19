import { access, constants, mkdir } from "node:fs/promises";
import { contentDir, dataDir, uploadsDir } from "./paths";

export type DirStatus = {
  labelKey: "dirContent" | "dirUploads" | "dirLeads";
  path: string;
  writable: boolean;
  noteKey: "dirWritable" | "dirCreated" | "dirDenied";
};

async function check(labelKey: DirStatus["labelKey"], dir: string): Promise<DirStatus> {
  try {
    await access(dir, constants.W_OK);
    return { labelKey, path: dir, writable: true, noteKey: "dirWritable" };
  } catch {
    // каталога может не быть — пробуем создать
  }

  try {
    await mkdir(dir, { recursive: true });
    return { labelKey, path: dir, writable: true, noteKey: "dirCreated" };
  } catch {
    return { labelKey, path: dir, writable: false, noteKey: "dirDenied" };
  }
}

/** Куда пишет админка и получается ли туда писать */
export async function checkDataDirs(): Promise<DirStatus[]> {
  return Promise.all([
    check("dirContent", contentDir),
    check("dirUploads", uploadsDir),
    check("dirLeads", dataDir),
  ]);
}
