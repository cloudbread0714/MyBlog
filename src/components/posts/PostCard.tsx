import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Locale } from "@/i18n/config";
import type { Post } from "@/types/database";
import { formatDate, readingTime } from "@/lib/utils";

type PostLabels = { readMin: string };

export function PostCard({
  post,
  locale,
  labels,
}: {
  post: Post;
  locale: Locale;
  labels: PostLabels;
}) {
  return (
    <article className="card group">
      <Link
        href={`/posts/${post.id}`}
        className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:justify-between"
      >
        <div className="min-w-0 flex-1">
          <time className="font-mono text-xs text-muted">
            {formatDate(post.created_at, locale)}
          </time>
          <h2 className="mt-1.5 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">
            {post.title}
          </h2>
          {post.tags.length > 0 && (
            <ul className="mt-3 flex flex-wrap gap-1.5">
              {post.tags.map((tag) => (
                <li
                  key={tag}
                  className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted"
                >
                  {tag}
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="flex shrink-0 items-center gap-1 font-mono text-xs text-muted sm:pt-6">
          {readingTime(post.content)} {labels.readMin}
          <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </span>
      </Link>
    </article>
  );
}
