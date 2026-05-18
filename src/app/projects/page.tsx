import { EditablePage } from "@/components/cms/EditablePage";
import { ProjectsView } from "@/components/projects/ProjectsView";
import { getIsAdmin } from "@/lib/auth";
import { localizeProject } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { PAGE_SLUGS } from "@/lib/page-defaults";
import { getPageContentForEdit } from "@/lib/pages";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "프로젝트 | Dev Blog",
};

type Props = { searchParams: Promise<{ tab?: string }> };

export default async function ProjectsPage({ searchParams }: Props) {
  const { tab } = await searchParams;
  const initialTab = tab === "education" ? "education" : "project";
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const isAdmin = await getIsAdmin();
  const pageContent = await getPageContentForEdit(PAGE_SLUGS.projects);

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  const localized = (projects ?? []).map((p) => localizeProject(p, locale));

  return (
    <>
      <div className="mb-8">
        <EditablePage
          slug={PAGE_SLUGS.projects}
          initialContentKo={pageContent.ko}
          initialContentEn={pageContent.en}
          locale={locale}
          isAdmin={isAdmin}
          labels={t.editor}
        />
      </div>
      <ProjectsView
        projects={localized}
        labels={t.projects}
        isAdmin={isAdmin}
        initialTab={initialTab}
      />
    </>
  );
}
