import Link from "next/link";
import { notFound } from "next/navigation";
import { EditablePost } from "@/components/cms/EditablePost";
import { getIsAdmin } from "@/lib/auth";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { getPostCategories } from "@/lib/post-categories";
import { createClient } from "@/lib/supabase/server";
import { formatDate, readingTime } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("title, title_en").eq("id", id).single();
  const locale = await getLocale();
  const title =
    locale === "en" && data?.title_en?.trim() ? data.title_en : data?.title;
  return { title: title ? `${title} | Dev Blog` : "글 | Dev Blog" };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const isAdmin = await getIsAdmin();
  const categories = await getPostCategories();

  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();

  if (!post) notFound();

  await supabase
    .from("posts")
    .update({ views: (post.views ?? 0) + 1 })
    .eq("id", id);

  return (
    <article className="max-w-3xl">
      <Link
        href="/posts"
        className="inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-accent"
      >
        ← {t.posts.back}
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
        <time dateTime={post.created_at}>{formatDate(post.created_at, locale)}</time>
        <span>·</span>
        <span>
          {readingTime(post.content)} {t.posts.readMin}
        </span>
        <span>·</span>
        <span>
          {t.posts.views} {post.views + 1}
        </span>
        {post.tags.length > 0 && (
          <ul className="flex flex-wrap gap-2">
            {post.tags.map((tag: string) => (
              <li
                key={tag}
                className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
      </div>
      <EditablePost
        post={post}
        locale={locale}
        isAdmin={isAdmin}
        labels={{ ...t.editor, ...t.posts }}
        categories={categories}
      />
    </article>
  );
}
