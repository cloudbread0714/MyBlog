import { CategoryManager } from "@/components/posts/CategoryManager";
import { PostEditor } from "@/components/write/PostEditor";
import { getIsAdmin } from "@/lib/auth";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { getPostCategories } from "@/lib/post-categories.server";

export const metadata = {
  title: "글 작성 | Dev Blog",
};

export default async function WritePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const isAdmin = await getIsAdmin();
  const categories = await getPostCategories();

  return (
    <>
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
      <PostEditor
        categories={categories}
        labels={{ ...t.editor, categoryLabel: t.editor.category }}
      />
    </>
  );
}
