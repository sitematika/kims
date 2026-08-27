import { currentActor } from "@/lib/auth";
import { getUsers } from "@/lib/users";
import { getAdminDict } from "@/lib/admin-lang";
import { AddUserForm } from "@/components/admin/UsersForm";
import { deleteUser } from "@/app/admin/users-actions";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const [users, actor, dict] = await Promise.all([
    getUsers(),
    currentActor(),
    getAdminDict(),
  ]);

  return (
    <div className="flex max-w-[860px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.users.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">{dict.users.subtitle}</p>
      </header>

      {users.length === 0 ? (
        <p className="rounded-[4px] bg-blush-50 px-[20px] py-[16px] text-[14px] text-ink/70">
          {dict.users.empty}
        </p>
      ) : (
        <div className="flex flex-col">
          {users.map((user) => {
            const self = actor?.id === user.id;
            return (
              <div
                key={user.id}
                className="flex flex-wrap items-center justify-between gap-[12px] border-b border-line-soft py-[14px] first:border-t"
              >
                <div>
                  <p className="text-[15px]">
                    {user.name}
                    {self && (
                      <span className="ml-[8px] rounded-[3px] bg-blush-50 px-[8px] py-[2px] text-[11px] text-ink/60">
                        {dict.users.you}
                      </span>
                    )}
                  </p>
                  <p className="mt-[2px] text-[13px] text-ink/50">
                    {user.email}
                    {user.lastLoginAt
                      ? ` · ${dict.users.lastLogin} ${new Date(
                          user.lastLoginAt,
                        ).toLocaleString("uk-UA")}`
                      : ` · ${dict.users.neverLogged}`}
                  </p>
                </div>

                {/* себя и последнюю запись удалить нельзя — иначе войти
                    будет некому */}
                {!self && users.length > 1 && (
                  <form action={deleteUser}>
                    <input type="hidden" name="id" value={user.id} />
                    <button
                      type="submit"
                      className="h-[36px] rounded-[4px] border border-line px-[18px] text-[13px] text-red-700 transition-colors hover:bg-red-50"
                    >
                      {dict.common.delete}
                    </button>
                  </form>
                )}
              </div>
            );
          })}
        </div>
      )}

      <AddUserForm first={users.length === 0} />
    </div>
  );
}
