import { PostsList } from "@/components/posts/PostsList";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "글 목록 | Dev Blog",
};

export default async function PostsPage() {
  const supabase = await createClient();
  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <h1 className="mb-8 text-3xl font-bold">글</h1>
      <PostsList posts={posts ?? []} />
    </>
  );
}
