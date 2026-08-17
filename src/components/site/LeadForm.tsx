"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState, type FormEvent } from "react";
import { Badge } from "@/components/ui/Badge";
import { buttonClasses } from "@/components/ui/Button";

type Errors = Partial<Record<"name" | "phone" | "city" | "form", string>>;

export function LeadForm() {
  const t = useTranslations("lead");
  const tCta = useTranslations("cta");
  const locale = useLocale();

  const [values, setValues] = useState({ name: "", phone: "", city: "" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done">("idle");

  const set = (key: keyof typeof values) => (value: string) => {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined, form: undefined }));
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();

    const next: Errors = {};
    if (values.name.trim().length < 2) next.name = t("errorRequired");
    if (values.phone.replace(/\D/g, "").length < 9) next.phone = t("errorPhone");
    if (values.city.trim().length < 2) next.city = t("errorRequired");

    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ ...values, locale }),
      });
      if (!res.ok) throw new Error(String(res.status));
      setStatus("done");
    } catch {
      setStatus("idle");
      setErrors({ form: t("errorServer") });
    }
  };

  return (
    <section id="lead" className="shell pt-[56px] md:pt-[80px] xl:pt-[110px]">
      <div className="grid grid-cols-1 overflow-hidden rounded-[4px] xl:grid-cols-[minmax(0,610px)_1fr]">
        <div className="flex flex-col gap-[24px] bg-ink px-[24px] py-[32px] text-white md:px-[48px] md:py-[48px]">
          <Badge tone="dark">{t("badge")}</Badge>

          <h2 className="text-[22px] leading-[1.2] tracking-[-0.5px] uppercase md:text-[28px] xl:text-[32px]">
            <span className="text-accent">{t("titleAccent")}</span>
            <br />
            {t("title")}
          </h2>

          <p className="text-[14px] text-white/80 md:text-[16px]">
            {t("text")}
          </p>

          <div className="mt-auto flex flex-col gap-[8px] pt-[24px] text-[14px] md:text-[16px]">
            <p>{t("contact")}</p>
            <a href={`tel:${t("phone").replace(/\s/g, "")}`}>{t("phone")}</a>
            <a href={`mailto:${t("email")}`} className="text-accent underline">
              {t("email")}
            </a>
          </div>
        </div>

        <div className="bg-blush-50 px-[24px] py-[32px] md:px-[48px] md:py-[48px]">
          {status === "done" ? (
            <div
              role="status"
              className="flex h-full flex-col justify-center gap-[12px]"
            >
              <p className="text-[20px] md:text-[24px]">{t("successTitle")}</p>
              <p className="text-[14px] text-ink/70 md:text-[16px]">
                {t("successText")}
              </p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate className="flex flex-col">
              <Field
                label={t("nameLabel")}
                placeholder={t("namePlaceholder")}
                value={values.name}
                onChange={set("name")}
                error={errors.name}
                autoComplete="name"
              />
              <Field
                label={t("phoneLabel")}
                placeholder={t("phonePlaceholder")}
                value={values.phone}
                onChange={set("phone")}
                error={errors.phone}
                type="tel"
                autoComplete="tel"
              />
              <Field
                label={t("cityLabel")}
                placeholder={t("cityPlaceholder")}
                value={values.city}
                onChange={set("city")}
                error={errors.city}
                autoComplete="address-level2"
              />

              {errors.form && (
                <p className="mt-[16px] text-[13px] text-red-700">
                  {errors.form}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "sending"}
                className={buttonClasses(
                  "accent",
                  "lg",
                  "mt-[32px] w-full disabled:opacity-70",
                )}
              >
                {status === "sending" ? t("sending") : tCta("presentation")}
              </button>

              <p className="mt-[16px] text-center text-[13px] text-ink/60 md:text-[14px]">
                {t("note")}
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function Field({
  label,
  placeholder,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
}) {
  return (
    <label className="flex flex-col gap-[12px] pt-[28px] first:pt-0">
      <span className="text-[13px] tracking-[1px] text-ink/70 uppercase md:text-[14px]">
        {label}
      </span>
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={Boolean(error)}
        className={`border-b bg-transparent pb-[12px] text-[16px] outline-none placeholder:text-ink/40 focus:border-ink ${
          error ? "border-red-600" : "border-ink/20"
        }`}
      />
      {error && <span className="text-[13px] text-red-700">{error}</span>}
    </label>
  );
}
