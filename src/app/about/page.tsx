import { EditablePage } from "@/components/cms/EditablePage";
import { getIsAdmin } from "@/lib/auth";
import { PAGE_SLUGS } from "@/lib/page-defaults";
import { getPageContent } from "@/lib/pages";

export const metadata = {
  title: "소개 | Dev Blog",
};

export default async function AboutPage() {
  const [isAdmin, content] = await Promise.all([
    getIsAdmin(),
    getPageContent(PAGE_SLUGS.about),
  ]);

  return (
    <article className="max-w-2xl">
      <EditablePage slug={PAGE_SLUGS.about} initialContent={content} isAdmin={isAdmin} />
    </article>
  );
}
