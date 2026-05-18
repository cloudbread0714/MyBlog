import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import type { Post, PostCategory } from "@/types/database";
import { formatDate, readingTime } from "@/lib/utils";

export function PostCard({
  post,
  locale,
  labels,
}: {
  post: Post;
  locale: Locale;
  labels: Dictionary["posts"];
}) {
  const category = (post.category ?? "study") as PostCategory;
  const categoryLabel = labels.categories[category] ?? category;

  return (
    <article className="card group">
      <Link
        href={`/posts/${post.id}`}
        className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <time className="font-mono text-sm text-muted">
              {formatDate(post.created_at, locale)}
            </time>
            <span className="rounded border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-xs text-accent">
              {categoryLabel}
            </span>
          </div>
          <h2 className="mt-2 text-lg font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
            {post.title}
          </h2>
          {post.tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded border border-border bg-background px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-1 font-mono text-sm text-muted sm:pt-6">
          {readingTime(post.content)} {labels.readMin}
          <ArrowRight className="h-4 w-4 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </span>
      </Link>
    </article>
  );
}
