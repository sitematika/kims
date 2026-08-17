import { useTranslations } from "next-intl";

/** Ячейка с одним крупным числом */
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
    <div
      className={`flex flex-col gap-[32px] border border-ink/20 px-[24px] py-[16px] md:gap-[52px] md:px-[32px] ${className}`}
    >
      <p className="text-[14px] leading-[1.2] font-light text-ink/60 md:text-[16px]">
        {label}
      </p>
      <p className="text-[48px] leading-none font-medium tracking-[-1.28px] md:text-[56px] xl:text-[64px]">
        {value}
        {unit ? (
          <span className="ml-[8px] text-[20px] font-medium tracking-normal md:text-[24px]">
            {unit}
          </span>
        ) : null}
      </p>
    </div>
  );
}

/** Ячейка с парой «цехи / пункты» */
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
    <div
      className={`flex flex-col gap-[32px] border border-ink/20 px-[24px] py-[16px] md:gap-[52px] md:px-[32px] ${className}`}
    >
      <p className="text-[14px] leading-[1.2] font-light text-ink/60 md:text-[16px]">
        {label}
      </p>
      <div className="flex flex-wrap items-baseline gap-x-[40px] gap-y-[8px]">
        {[
          [a, aUnit],
          [b, bUnit],
        ].map(([value, unit]) => (
          <p key={unit} className="flex items-baseline gap-[8px]">
            <span className="text-[40px] leading-none font-medium tracking-[-0.8px] md:text-[48px]">
              {value}
            </span>
            <span className="text-[16px] md:text-[18px]">{unit}</span>
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
      {/* На десктопе 3×2, на планшете 2×3, на мобильном одна колонка —
          сетка склеивает соседние рамки, поэтому используем отрицательные отступы */}
      <div className="grid grid-cols-1 [&>*]:-mr-px [&>*]:-mb-px md:grid-cols-2 xl:grid-cols-3">
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
