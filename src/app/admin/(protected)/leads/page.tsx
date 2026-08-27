import { readLeads } from "@/lib/leads";
import { notifyStatus } from "@/lib/notify";
import { getAdminDict } from "@/lib/admin-lang";
import { TestLeadButton } from "@/components/admin/TestLeadButton";
import { LeadEmailsForm } from "@/components/admin/LeadEmailsForm";

export const dynamic = "force-dynamic";

export default async function LeadsPage() {
  const [leads, channels, dict] = await Promise.all([
    readLeads(),
    notifyStatus(),
    getAdminDict(),
  ]);

  return (
    <div className="flex max-w-[1100px] flex-col gap-[24px]">
      <header>
        <h1 className="text-[24px]">{dict.leads.title}</h1>
        <p className="mt-[4px] text-[14px] text-ink/60">
          {leads.length === 0
            ? dict.leads.empty
            : `${dict.leads.total} ${leads.length}`}
        </p>
      </header>

      <section className="flex flex-col gap-[14px] rounded-[4px] border border-line-soft bg-white p-[20px] text-[13px]">
        <p className="text-[16px]">{dict.leads.channels}</p>

        <p>
          <span className="text-ink/50">{dict.leads.telegram} </span>
          {channels.telegram ? (
            dict.leads.configured
          ) : (
            <span className="text-red-700">{dict.leads.telegramMissing}</span>
          )}
        </p>

        <div className="flex flex-col gap-[10px]">
          <p>
            <span className="text-ink/50">{dict.leads.email} </span>
            {channels.smtpReady ? (
              dict.leads.configured
            ) : (
              <span className="text-red-700">{dict.leads.smtpMissing}</span>
            )}
          </p>

          <p className="text-ink/50">{dict.leads.recipients}</p>
          <LeadEmailsForm emails={channels.recipients} />
        </div>

        <div className="pt-[4px]">
          <TestLeadButton />
        </div>
      </section>

      {leads.length > 0 && (
        <div className="overflow-x-auto rounded-[4px] border border-line-soft bg-white">
          <table className="w-full min-w-[720px] text-[14px]">
            <thead>
              <tr className="border-b border-line-soft text-left text-[12px] tracking-[1px] text-ink/50 uppercase">
                <th className="px-[16px] py-[12px]">{dict.leads.date}</th>
                <th className="px-[16px] py-[12px]">{dict.leads.name}</th>
                <th className="px-[16px] py-[12px]">{dict.leads.phone}</th>
                <th className="px-[16px] py-[12px]">{dict.leads.city}</th>
                <th className="px-[16px] py-[12px]">{dict.leads.lang}</th>
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
        {dict.leads.csv}
      </a>
    </div>
  );
}
