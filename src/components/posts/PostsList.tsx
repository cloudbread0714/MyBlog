"use client";

import { useMemo, useState } from "react";
import { PostCard } from "@/components/posts/PostCard";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import type { PostCategoryRow } from "@/lib/post-categories";
import type { Post } from "@/types/database";

export function PostsList({
  posts,
  locale,
  labels,
}: {
  posts: Post[];
  locale: Locale;
  labels: Dictionary["posts"] & { categories: PostCategoryRow[] };
}) {
  const [query, setQuery] = useState("");
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const allTags = useMemo(
    () => Array.from(new Set(posts.flatMap((p) => p.tags))).sort(),
    [posts],
  );

  const filtered = useMemo(() => {
    return posts.filter((post) => {
      const matchQuery =
        !query ||
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.content.toLowerCase().includes(query.toLowerCase());
      const matchTag = !activeTag || post.tags.includes(activeTag);
      const matchCategory = !activeCategory || (post.category ?? "study") === activeCategory;
      return matchQuery && matchTag && matchCategory;
    });
  }, [posts, query, activeTag, activeCategory]);

  const chipClass = (active: boolean) =>
    `rounded border px-2.5 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
      active
        ? "border-foreground bg-foreground text-background"
        : "border-border text-muted hover:border-muted hover:text-foreground"
    }`;

  const categoryLabel = (slug: string) => {
    const row = labels.categories.find((c) => c.slug === slug);
    return locale === "en" ? row?.label_en ?? slug : row?.label_ko ?? slug;
  };

  return (
    <div>
      <div className="mb-8 space-y-4">
        <input
          type="search"
          placeholder={labels.search}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 font-mono text-sm placeholder:text-muted focus:border-accent focus:outline-none focus:ring-2 focus:ring-[var(--ring)] sm:max-w-sm"
        />
        {labels.categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <button type="button" onClick={() => setActiveCategory(null)} className={chipClass(!activeCategory)}>
              {labels.all}
            </button>
            {labels.categories.map((cat) => (
              <button
                key={cat.slug}
                type="button"
                onClick={() => setActiveCategory(cat.slug)}
                className={chipClass(activeCategory === cat.slug)}
              >
                {categoryLabel(cat.slug)}
              </button>
            ))}
          </div>
        )}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            <span className="sr-only">tags</span>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                className={`rounded border px-2.5 py-1 font-mono text-xs uppercase tracking-wide transition-colors ${
                  activeTag === tag
                    ? "border-accent bg-accent-soft text-accent"
                    : "border-border text-muted hover:border-muted hover:text-foreground"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {filtered.map((post) => (
          <li key={post.id}>
            <PostCard post={post} locale={locale} labels={labels} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="py-16 text-center font-mono text-sm text-muted">{labels.noResults}</p>
      )}
    </div>
  );
}
