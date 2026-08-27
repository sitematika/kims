import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/auth";
import { changesOf, listSnapshots, restore } from "@/lib/history";
import { getAdminDict, getAdminLang } from "@/lib/admin-lang";
import { fieldLabel } from "@/lib/field-labels";
import { localeLabels } from "@/i18n/routing";

export const dynamic = "force-dynamic";

async function restoreAction(formData: FormData) {
  "use server";
  if (!(await isAuthorized())) return;

  const id = String(formData.get("id") ?? "");
  if (!id) return;

  await restore(id);
  revalidatePath("/", "layout");
  revalidatePath("/admin/history");
}

export default async function HistoryPage() {
  const [snapshots, dict, lang] = await Promise.all([
    listSnapshots(),
    getAdminDict(),
    getAdminLang(),
  ]);

  // разбор diff недешёвый, поэтому считаем только для свежих записей
  const diffs = new Map(
    await Promise.all(
      snapshots.slice(0, 8).map(
        async (item) => [item.id, await changesOf(item.id)] as const,
      ),
    ),
  );

  return (
    <div className="flex max-w-[860px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.history.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">{dict.history.subtitle}</p>
      </header>

      {snapshots.length === 0 ? (
        <p className="rounded-[10px] bg-blush-50 px-[20px] py-[16px] text-[14px] text-ink/70">
          {dict.history.empty}
        </p>
      ) : (
        <div className="flex flex-col">
          {snapshots.map((item, i) => (
            <div
              key={item.id}
              className="flex flex-wrap items-center justify-between gap-[12px] border-b border-line-soft py-[14px] first:border-t"
            >
              <div>
                <p className="text-[15px]">
                  {item.label}
                  {i === 0 && (
                    <span className="ml-[8px] rounded-[3px] bg-blush-50 px-[8px] py-[2px] text-[11px] text-ink/60">
                      {dict.history.latest}
                    </span>
                  )}
                </p>
                <p className="mt-[2px] text-[13px] text-ink/50">
                  {new Date(item.createdAt).toLocaleString("uk-UA")}
                  {item.actor && ` · ${item.actor}`}
                </p>

                {diffs.get(item.id)?.length ? (
                  <details className="mt-[8px]">
                    <summary className="cursor-pointer text-[13px] text-ink/60 hover:text-ink">
                      {dict.history.changed} {diffs.get(item.id)!.length}
                    </summary>
                    <ul className="mt-[8px] flex flex-col gap-[8px]">
                      {diffs
                        .get(item.id)!
                        .slice(0, 20)
                        .map((change) => (
                          <li
                            key={`${change.locale}-${change.path}`}
                            className="text-[13px]"
                          >
                            <span className="text-ink/45">
                              {localeLabels[change.locale]} ·{" "}
                              {fieldLabel(change.path, lang)}
                            </span>
                            <span className="mt-[2px] block text-red-700/70 line-through">
                              {change.before.slice(0, 120)}
                            </span>
                            <span className="block text-ink">
                              {change.after.slice(0, 120)}
                            </span>
                          </li>
                        ))}
                    </ul>
                  </details>
                ) : null}
              </div>

              <form action={restoreAction}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="h-[36px] rounded-[8px] border border-line px-[18px] text-[13px] transition-colors hover:bg-paper"
                >
                  {dict.history.restore}
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
