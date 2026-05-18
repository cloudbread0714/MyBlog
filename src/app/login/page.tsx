import { LoginForm } from "@/components/auth/LoginForm";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";

export const metadata = {
  title: "로그인 | Dev Blog",
};

export default async function LoginPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return <LoginForm labels={t.auth} />;
}
