import Link from "next/link";
import { notFound } from "next/navigation";
import { ProseContent } from "@/components/content/ProseContent";
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

  const { data: post } = await supabase.from("posts").select("*").eq("id", id).single();

  if (!post) notFound();

  await supabase
    .from("posts")
    .update({ views: (post.views ?? 0) + 1 })
    .eq("id", id);

  return (
    <article className="max-w-3xl">
      <Link href="/posts" className="text-sm text-accent hover:underline">
        ← 글 목록
      </Link>
      <header className="mt-6 border-b border-border pb-8">
        <time className="text-sm text-muted">{formatDate(post.created_at)}</time>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-3 text-sm text-muted">
          약 {readingTime(post.content)}분 읽기 · 조회 {post.views + 1}
        </p>
        {post.tags.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
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
      </header>
      <div className="mt-10">
        <ProseContent html={post.content} />
      </div>
    </article>
  );
}
