import { EditablePage } from "@/components/cms/EditablePage";
import { CategoryManager } from "@/components/posts/CategoryManager";
import { PostsList } from "@/components/posts/PostsList";
import { getIsAdmin } from "@/lib/auth";
import { localizePost } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { getPostCategories } from "@/lib/post-categories";
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
  const [pageContent, categories] = await Promise.all([
    getPageContentForEdit(PAGE_SLUGS.posts),
    getPostCategories(),
  ]);

  const { data: posts } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  const localized = (posts ?? []).map((p) => localizePost(p, locale));
  const postLabels = { ...t.posts, categories };

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
      {isAdmin && (
        <CategoryManager
          categories={categories}
          labels={{
            title: t.posts.manageCategories,
            hint: t.posts.manageCategoriesHint,
            nameKo: t.posts.categoryNameKo,
            nameEn: t.posts.categoryNameEn,
            slug: t.posts.categorySlug,
            add: t.posts.addCategory,
            saving: t.editor.saving,
            delete: t.posts.deleteCategory,
          }}
        />
      )}
      <PostsList posts={localized} locale={locale} labels={postLabels} />
    </>
  );
}
