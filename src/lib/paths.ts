import path from "node:path";

/**
 * Где лежат данные, которые правит админка.
 *
 * По умолчанию — внутри проекта (удобно локально). На сервере эти папки
 * выносятся наружу через переменные окружения, иначе каждый редеплой из
 * гита перезатирал бы тексты и загруженные файлы.
 */

const root = process.cwd();

/**
 * Куда складывать данные, если каталоги не заданы явно.
 *
 * В разработке — папка внутри проекта. На сервере — домашний каталог
 * пользователя: он лежит выше папки приложения, поэтому переживает редеплой.
 * Фактический путь и права на запись видно в админке, раздел «Настройки и доступ».
 */
const home = process.env.HOME;
const defaultRoot =
  process.env.NODE_ENV === "production" && home && home !== root
    ? path.join(home, "kims-data")
    : path.join(root, "var");

/** Тексты сайта: content/{locale}.json и media.json */
export const contentDir = process.env.CONTENT_DIR
  ? path.resolve(process.env.CONTENT_DIR)
  : process.env.NODE_ENV === "production"
    ? path.join(defaultRoot, "content")
    : path.join(root, "content");

/** Эталонные тексты из репозитория — ими заполняется пустой CONTENT_DIR */
export const seedDir = path.join(root, "content");

/** Загруженные через админку файлы: фото слайдера, презентация */
export const uploadsDir = process.env.UPLOADS_DIR
  ? path.resolve(process.env.UPLOADS_DIR)
  : path.join(defaultRoot, "uploads");

/** Локальный журнал заявок */
export const dataDir = process.env.DATA_DIR
  ? path.resolve(process.env.DATA_DIR)
  : path.join(defaultRoot, "leads");

/** Публичный префикс, по которому отдаются загруженные файлы */
export const mediaUrlPrefix = "/media";
