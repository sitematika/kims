import path from "node:path";

/**
 * Где лежат данные, которые правит админка.
 *
 * По умолчанию — внутри проекта (удобно локально). На сервере эти папки
 * выносятся наружу через переменные окружения, иначе каждый редеплой из
 * гита перезатирал бы тексты и загруженные файлы.
 */

const root = process.cwd();

/** Тексты сайта: content/{locale}.json и media.json */
export const contentDir = process.env.CONTENT_DIR
  ? path.resolve(process.env.CONTENT_DIR)
  : path.join(root, "content");

/** Эталонные тексты из репозитория — ими заполняется пустой CONTENT_DIR */
export const seedDir = path.join(root, "content");

/** Загруженные через админку файлы: фото слайдера, презентация */
export const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(root, "var", "uploads");

/** Локальный журнал заявок */
export const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(root, "var", "data");

/** Публичный префикс, по которому отдаются загруженные файлы */
export const mediaUrlPrefix = "/media";
