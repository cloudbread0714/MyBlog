import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { href: "/", label: "홈" },
  { href: "/posts", label: "글" },
  { href: "/projects", label: "프로젝트" },
  { href: "/about", label: "소개" },
];

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-sm font-semibold tracking-tight">
          Dev Blog
        </Link>
        <nav className="flex items-center gap-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-md px-3 py-1.5 text-sm text-muted transition-colors hover:bg-accent-soft hover:text-accent sm:inline-block"
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <Link
              href="/write"
              className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              글쓰기
            </Link>
          )}
          <ThemeToggle />
          {user ? (
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-md px-3 py-1.5 text-sm text-muted hover:text-foreground"
              >
                로그아웃
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-md px-3 py-1.5 text-sm text-muted hover:text-foreground"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
