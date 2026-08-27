"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentActor, destroySession, isAuthorized } from "@/lib/auth";
import { createUser, getUsers, removeUser } from "@/lib/users";
import { snapshot } from "@/lib/history";

export async function addUser(
  _state: string | null,
  formData: FormData,
): Promise<string | null> {
  if (!(await isAuthorized())) return "sessionExpired";

  const email = String(formData.get("email") ?? "");
  const name = String(formData.get("name") ?? "");
  const password = String(formData.get("password") ?? "");

  const hadUsers = (await getUsers()).length > 0;

  // снимок делаем до изменения — как и для текстов, и пока автор ещё виден:
  // после появления первой учётки общая сессия перестаёт им считаться
  await snapshot(`Доступ: додано ${name || email}`);

  const result = await createUser({ email, name, password });
  if (result !== "ok") return result;

  revalidatePath("/admin/users");

  // первая учётка закрывает вход по общему паролю — в том числе текущий,
  // поэтому сразу отправляем войти заново, чтобы не осталось битой сессии
  if (!hadUsers) {
    await destroySession();
    // остаться на странице нельзя — она уже закрыта для общей сессии
    redirect("/admin/login?started=1");
  }

  return "userAdded";
}

export async function deleteUser(formData: FormData) {
  if (!(await isAuthorized())) return;

  const id = String(formData.get("id") ?? "");
  const actor = await currentActor();
  // себя не удаляем: иначе можно случайно закрыть себе дверь
  if (!id || actor?.id === id) return;

  const user = (await getUsers()).find((u) => u.id === id);
  if (!(await removeUser(id))) return;

  await snapshot(`Доступ: видалено ${user?.name ?? id}`);
  revalidatePath("/admin/users");
}
