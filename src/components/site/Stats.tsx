import { useTranslations } from "next-intl";
import { CountUp } from "@/components/ui/CountUp";

/**
 * Ячейки одинаковой высоты, подпись занимает фиксированные две строки,
 * а числа прижаты к низу — тогда строка цифр выравнивается одинаково
 * на всех языках, даже когда перевод подписи длиннее украинского.
 */
const cell =
  "flex flex-col border border-ink/20 px-[24px] py-[20px] transition-colors duration-300 hover:bg-blush-50/60 md:py-[24px]";
const caption =
  "min-h-[2.4em] text-[14px] leading-[1.2] font-light text-ink/60 md:text-[16px]";

function Single({
  label,
  value,
  unit,
  className = "",
}: {
  label: string;
  value: string;
  unit?: string;
  className?: string;
}) {
  return (
    <div className={`${cell} ${className}`}>
      <p className={caption}>{label}</p>
      <p className="mt-[32px] flex items-baseline gap-[8px] text-[48px] leading-none font-medium tracking-[-1.28px] md:mt-[52px] md:text-[56px] xl:text-[64px]">
        <CountUp>{value}</CountUp>
        {unit ? (
          <span className="text-[20px] font-medium tracking-normal md:text-[24px]">
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}

function Pair({
  label,
  a,
  aUnit,
  b,
  bUnit,
  className = "",
}: {
  label: string;
  a: string;
  aUnit: string;
  b: string;
  bUnit: string;
  className?: string;
}) {
  return (
    <div className={`${cell} ${className}`}>
      <p className={caption}>{label}</p>
      {/* Пары не режутся пополам, а стоят по содержимому: длинные единицы
          вроде «drop-off points» остаются в одну строку. Если места совсем
          нет — вторая пара уходит на строку ниже, а не рвётся посередине */}
      <div className="mt-[32px] flex flex-wrap gap-x-[16px] gap-y-[12px] md:mt-[52px]">
        {[
          [a, aUnit],
          [b, bUnit],
        ].map(([value, unit]) => (
          <p
            key={unit}
            className="flex items-baseline gap-[8px] whitespace-nowrap"
          >
            <span className="text-[40px] leading-none font-medium tracking-[-0.8px] md:text-[44px]">
              <CountUp>{value}</CountUp>
            </span>
            <span className="text-[15px] leading-[1.2] md:text-[18px]">
              {unit}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}

export function Stats() {
  const t = useTranslations("stats");

  return (
    <section className="shell pt-[48px] md:pt-[64px] xl:pt-[80px]">
      {/* auto-rows-fr держит ячейки одной строки одинаковыми по высоте */}
      <div className="grid auto-rows-fr grid-cols-1 [&>*]:-mr-px [&>*]:-mb-px md:grid-cols-2 xl:grid-cols-3">
        <Single
          label={t("network.label")}
          value={t("network.value")}
          className="xl:col-start-1 xl:row-start-1"
        />
        <Pair
          label={t("ownUa.label")}
          a={t("ownUa.a")}
          aUnit={t("ownUa.aUnit")}
          b={t("ownUa.b")}
          bUnit={t("ownUa.bUnit")}
          className="xl:col-start-1 xl:row-start-2"
        />
        <Single
          label={t("clients.label")}
          value={t("clients.value")}
          unit={t("clients.unit")}
          className="xl:col-start-2 xl:row-start-1"
        />
        <Pair
          label={t("franchiseUa.label")}
          a={t("franchiseUa.a")}
          aUnit={t("franchiseUa.aUnit")}
          b={t("franchiseUa.b")}
          bUnit={t("franchiseUa.bUnit")}
          className="xl:col-start-2 xl:row-start-2"
        />
        <Single
          label={t("years.label")}
          value={t("years.value")}
          className="xl:col-start-3 xl:row-start-1"
        />
        <Pair
          label={t("ownEu.label")}
          a={t("ownEu.a")}
          aUnit={t("ownEu.aUnit")}
          b={t("ownEu.b")}
          bUnit={t("ownEu.bUnit")}
          className="xl:col-start-3 xl:row-start-2"
        />
      </div>
    </section>
  );
}
