import { revalidatePath } from "next/cache";
import { isAuthorized } from "@/lib/auth";
import { listSnapshots, restore } from "@/lib/history";
import { getAdminDict } from "@/lib/admin-lang";

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
  const [snapshots, dict] = await Promise.all([listSnapshots(), getAdminDict()]);

  return (
    <div className="flex max-w-[860px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.history.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">{dict.history.subtitle}</p>
      </header>

      {snapshots.length === 0 ? (
        <p className="rounded-[4px] bg-blush-50 px-[20px] py-[16px] text-[14px] text-ink/70">
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
              </div>

              <form action={restoreAction}>
                <input type="hidden" name="id" value={item.id} />
                <button
                  type="submit"
                  className="h-[36px] rounded-[4px] border border-line px-[18px] text-[13px] transition-colors hover:bg-paper"
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
