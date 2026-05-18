import Link from "next/link";
import type { Post } from "@/types/database";
import { formatDate, readingTime } from "@/lib/utils";

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group rounded-xl border border-border bg-card p-5 transition-shadow hover:shadow-md">
      <Link href={`/posts/${post.id}`} className="block">
        <time className="text-xs text-muted">{formatDate(post.created_at)}</time>
        <h2 className="mt-1 text-lg font-semibold group-hover:text-accent">
          {post.title}
        </h2>
        {post.tags.length > 0 && (
          <ul className="mt-3 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-muted">약 {readingTime(post.content)}분 읽기</p>
      </Link>
    </article>
  );
}
