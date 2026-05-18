import { EditablePage } from "@/components/cms/EditablePage";
import { PostsList } from "@/components/posts/PostsList";
import { getIsAdmin } from "@/lib/auth";
import { localizePost } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { PAGE_SLUGS } from "@/lib/page-defaults";
import { getPageContentForEdit } from "@/lib/pages";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "글 목록 | Dev Blog",
};

export default async function PostsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const isAdmin = await getIsAdmin();
  const pageContent = await getPageContentForEdit(PAGE_SLUGS.posts);

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const localized = (posts ?? []).map((p) => localizePost(p, locale));

  return (
    <>
      <EditablePage
        slug={PAGE_SLUGS.posts}
        initialContentKo={pageContent.ko}
        initialContentEn={pageContent.en}
        locale={locale}
        isAdmin={isAdmin}
        labels={t.editor}
        className="mb-8"
      />
      <PostsList posts={localized} locale={locale} labels={t.posts} />
    </>
  );
}
