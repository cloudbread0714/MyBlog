import Link from "next/link";
import { EditablePage } from "@/components/cms/EditablePage";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getIsAdmin } from "@/lib/auth";
import { PAGE_SLUGS } from "@/lib/page-defaults";
import { getPageContent } from "@/lib/pages";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "프로젝트 | Dev Blog",
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const [isAdmin, headerContent, { data: projects }] = await Promise.all([
    getIsAdmin(),
    getPageContent(PAGE_SLUGS.projects),
    supabase.from("projects").select("*").order("created_at", { ascending: false }),
  ]);

  return (
    <>
      <div className="mb-8 flex items-end justify-between gap-4">
        <EditablePage
          slug={PAGE_SLUGS.projects}
          initialContent={headerContent}
          isAdmin={isAdmin}
          className="flex-1"
        />
        {isAdmin && (
          <Link
            href="/projects/new"
            className="shrink-0 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            + 새 프로젝트
          </Link>
        )}
      </div>
      <ul className="grid gap-4 sm:grid-cols-2">
        {(projects ?? []).map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} />
          </li>
        ))}
      </ul>
      {!projects?.length && (
        <p className="py-12 text-center text-muted">아직 등록된 프로젝트가 없습니다.</p>
      )}
    </>
  );
}
