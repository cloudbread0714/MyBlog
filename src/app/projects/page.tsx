import Link from "next/link";
import { EditablePage } from "@/components/cms/EditablePage";
import { ProjectCard } from "@/components/projects/ProjectCard";
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

export default async function ProjectsPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const isAdmin = await getIsAdmin();
  const pageContent = await getPageContentForEdit(PAGE_SLUGS.projects);

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <EditablePage
          slug={PAGE_SLUGS.projects}
          initialContentKo={pageContent.ko}
          initialContentEn={pageContent.en}
          locale={locale}
          isAdmin={isAdmin}
          labels={t.editor}
          className="flex-1"
        />
        {isAdmin && (
          <Link
            href="/projects/new"
            className="btn-primary shrink-0 !text-xs"
          >
            {t.projects.new}
          </Link>
        )}
      </div>
      <ul className="flex flex-col gap-3">
        {(projects ?? []).map((project) => (
          <li key={project.id}>
            <ProjectCard project={localizeProject(project, locale)} />
          </li>
        ))}
      </ul>
      {!projects?.length && (
        <p className="py-12 text-center font-mono text-sm text-muted">
          {t.projects.noProjects}
        </p>
      )}
    </>
  );
}
