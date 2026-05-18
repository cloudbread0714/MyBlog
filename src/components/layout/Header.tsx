import Link from "next/link";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { createClient } from "@/lib/supabase/server";

const nav = [
  { href: "/", label: "Home" },
  { href: "/posts", label: "Posts" },
  { href: "/projects", label: "Projects" },
  { href: "/about", label: "About" },
];

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/80 backdrop-blur-lg">
      <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="group flex items-center gap-2 font-mono text-sm font-medium tracking-tight"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-md border border-border bg-card text-xs text-accent transition-colors group-hover:border-accent/40">
            {"</>"}
          </span>
          <span className="hidden sm:inline">yujin.dev</span>
        </Link>
        <nav className="flex items-center gap-0.5">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="hidden rounded-md px-2.5 py-1.5 font-mono text-xs text-muted transition-colors hover:bg-card hover:text-foreground sm:inline-block"
            >
              {item.label}
            </Link>
          ))}
          {user && (
            <Link href="/write" className="btn-primary ml-1 !py-1.5 !text-xs">
              Write
            </Link>
          )}
          <ThemeToggle />
          {user ? (
            <form action="/auth/signout" method="post" className="ml-0.5">
              <button
                type="submit"
                className="rounded-md px-2 py-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
              >
                Out
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="ml-0.5 rounded-md px-2 py-1.5 font-mono text-xs text-muted transition-colors hover:text-foreground"
            >
              In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
