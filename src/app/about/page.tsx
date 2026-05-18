import { EditablePage } from "@/components/cms/EditablePage";
import { getIsAdmin } from "@/lib/auth";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { PAGE_SLUGS } from "@/lib/page-defaults";
import { getPageContentForEdit } from "@/lib/pages";

export const metadata = {
  title: "소개 | Dev Blog",
};

export default async function AboutPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const isAdmin = await getIsAdmin();
  const pageContent = await getPageContentForEdit(PAGE_SLUGS.about);

  return (
    <article className="max-w-2xl">
      <EditablePage
        slug={PAGE_SLUGS.about}
        initialContentKo={pageContent.ko}
        initialContentEn={pageContent.en}
        locale={locale}
        isAdmin={isAdmin}
        labels={t.editor}
      />
    </article>
  );
}
