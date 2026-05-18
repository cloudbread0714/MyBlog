import Link from "next/link";
import { notFound } from "next/navigation";
import { EditablePost } from "@/components/cms/EditablePost";
import { getIsAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";
import { formatDate, readingTime } from "@/lib/utils";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("posts").select("title").eq("id", id).single();
  return { title: data ? `${data.title} | Dev Blog` : "글 | Dev Blog" };
}

export default async function PostDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const [isAdmin, { data: post }] = await Promise.all([
    getIsAdmin(),
    supabase.from("posts").select("*").eq("id", id).single(),
  ]);

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
        ← Posts
      </Link>
      <div className="mt-6 flex flex-wrap items-center gap-2 font-mono text-xs text-muted">
        <time dateTime={post.created_at}>{formatDate(post.created_at)}</time>
        <span>·</span>
        <span>약 {readingTime(post.content)}분 읽기</span>
        <span>·</span>
        <span>조회 {post.views + 1}</span>
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
      <EditablePost post={post} isAdmin={isAdmin} />
    </article>
  );
}
