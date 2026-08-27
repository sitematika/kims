import { getAdminDict } from "@/lib/admin-lang";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ changed?: string }>;
}) {
  const [{ changed }, dict] = await Promise.all([searchParams, getAdminDict()]);
  return <LoginForm dict={dict} passwordChanged={changed === "1"} />;
}
