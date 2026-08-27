import { getAdminDict } from "@/lib/admin-lang";
import {
  isResetTokenValid,
  maskEmail,
  recoveryRecipients,
} from "@/lib/password-reset";
import {
  ResetPasswordForm,
  ResetRequestForm,
} from "@/components/admin/ResetForm";

export const dynamic = "force-dynamic";

export default async function ResetPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const [{ token }, dict] = await Promise.all([searchParams, getAdminDict()]);

  // ссылка из письма ведёт сюда же — по токену показываем второй шаг
  if (token && (await isResetTokenValid(token))) {
    return <ResetPasswordForm dict={dict} token={token} />;
  }

  const to = await recoveryRecipients();
  return (
    <ResetRequestForm
      dict={dict}
      maskedTo={to.map(maskEmail).join(", ")}
      // по ссылке пришли, а токен уже не годится — так и скажем
      expired={Boolean(token)}
    />
  );
}
