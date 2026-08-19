import { getAdminDict } from "@/lib/admin-lang";
import { LoginForm } from "@/components/admin/LoginForm";

export default async function LoginPage() {
  return <LoginForm dict={await getAdminDict()} />;
}
