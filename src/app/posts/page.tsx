import { EditablePage } from "@/components/cms/EditablePage";
import { PostsList } from "@/components/posts/PostsList";
import { getIsAdmin } from "@/lib/auth";
import { PAGE_SLUGS } from "@/lib/page-defaults";
import { getPageContent } from "@/lib/pages";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "글 목록 | Dev Blog",
};

export default async function PostsPage() {
  const supabase = await createClient();
  const [isAdmin, headerContent, { data: posts }] = await Promise.all([
    getIsAdmin(),
    getPageContent(PAGE_SLUGS.posts),
    supabase.from("posts").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <EditablePage
        slug={PAGE_SLUGS.posts}
        initialContent={headerContent}
        isAdmin={isAdmin}
        className="mb-8"
      />
      <PostsList posts={posts ?? []} />
    </>
  );
}
