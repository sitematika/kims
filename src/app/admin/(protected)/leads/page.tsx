import { readFile } from "node:fs/promises";
import path from "node:path";
import { dataDir } from "@/lib/paths";

type Lead = {
  name: string;
  phone: string;
  city: string;
  locale: string;
  createdAt: string;
};

async function readLeads(): Promise<Lead[]> {
  try {
    const raw = await readFile(
      path.join(dataDir, "leads.jsonl"),
      "utf8",
    );
    return raw
      .split("\n")
      .filter(Boolean)
      .map((line) => JSON.parse(line) as Lead)
      .reverse();
  } catch {
    return [];
  }
}

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const leads = await readLeads();

  return (
    <div className="flex max-w-[1100px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">Заявки</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">
          {leads.length === 0
            ? "Пока пусто. Заявки попадают сюда, если включён LEADS_SAVE_LOCAL=1."
            : `Всего: ${leads.length}`}
        </p>
      </header>

      {leads.length > 0 && (
        <div className="overflow-x-auto rounded-[4px] border border-line-soft bg-white">
          <table className="w-full min-w-[720px] text-[14px]">
            <thead>
              <tr className="border-b border-line-soft text-left text-[12px] tracking-[1px] text-ink/50 uppercase">
                <th className="px-[16px] py-[12px]">Дата</th>
                <th className="px-[16px] py-[12px]">Имя</th>
                <th className="px-[16px] py-[12px]">Телефон</th>
                <th className="px-[16px] py-[12px]">Город</th>
                <th className="px-[16px] py-[12px]">Язык</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, i) => (
                <tr
                  key={`${lead.createdAt}-${i}`}
                  className="border-b border-line-soft last:border-b-0"
                >
                  <td className="px-[16px] py-[12px] whitespace-nowrap text-ink/60">
                    {new Date(lead.createdAt).toLocaleString("uk-UA")}
                  </td>
                  <td className="px-[16px] py-[12px]">{lead.name}</td>
                  <td className="px-[16px] py-[12px] whitespace-nowrap">
                    <a href={`tel:${lead.phone}`}>{lead.phone}</a>
                  </td>
                  <td className="px-[16px] py-[12px]">{lead.city}</td>
                  <td className="px-[16px] py-[12px] uppercase">
                    {lead.locale}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <a
        href="/admin/leads/export"
        className="inline-flex h-[44px] w-fit items-center rounded-[4px] border border-line px-[24px] text-[14px] transition-colors hover:bg-white"
      >
        Выгрузить CSV
      </a>
    </div>
  );
}
