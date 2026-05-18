import { PostEditor } from "@/components/write/PostEditor";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";

export const metadata = {
  title: "글 작성 | Dev Blog",
};

export default async function WritePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return <PostEditor labels={{ ...t.editor, categories: t.posts.categories }} />;
}
