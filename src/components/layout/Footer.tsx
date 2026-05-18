import Link from "next/link";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";

export async function Footer() {
  const locale = await getLocale();
  const t = getDictionary(locale);

  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-3xl flex-col items-center justify-between gap-4 px-5 py-10 sm:flex-row sm:px-8">
        <p className="font-mono text-xs text-muted">
          © {new Date().getFullYear()} · {t.footer.built}
        </p>
        <nav className="flex gap-4 font-mono text-xs text-muted">
          <Link href="/posts" className="transition-colors hover:text-foreground">
            {t.nav.posts}
          </Link>
          <Link href="/projects" className="transition-colors hover:text-foreground">
            {t.nav.projects}
          </Link>
          <Link
            href="https://github.com/cloudbread0714"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-foreground"
          >
            GitHub
          </Link>
        </nav>
      </div>
    </footer>
  );
}
