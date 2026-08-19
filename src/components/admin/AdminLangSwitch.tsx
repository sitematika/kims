import { setAdminLang } from "@/app/admin/settings-actions";
import { adminLangs, adminLangLabels, type AdminLang } from "@/lib/admin-lang";

/** Переключатель языка панели */
export function AdminLangSwitch({ current }: { current: AdminLang }) {
  return (
    <div className="flex items-center gap-[4px]">
      {adminLangs.map((lang) => (
        <form key={lang} action={setAdminLang}>
          <input type="hidden" name="lang" value={lang} />
          <button
            type="submit"
            className={`rounded-[3px] px-[8px] py-[4px] text-[12px] tracking-[1px] transition-colors ${
              lang === current
                ? "bg-ink text-white"
                : "text-ink/40 hover:text-ink"
            }`}
          >
            {adminLangLabels[lang]}
          </button>
        </form>
      ))}
    </div>
  );
}
