import { getAdminDict } from "@/lib/admin-lang";
import { LoginForm } from "@/components/admin/LoginForm";
import { usersConfigured } from "@/lib/auth";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ changed?: string; started?: string }>;
}) {
  const [{ changed, started }, dict, withEmail] = await Promise.all([
    searchParams,
    getAdminDict(),
    usersConfigured(),
  ]);
  return (
    <LoginForm
      dict={dict}
      passwordChanged={changed === "1"}
      usersStarted={started === "1"}
      withEmail={withEmail}
    />
  );
}
