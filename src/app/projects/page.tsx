import Link from "next/link";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { createClient } from "@/lib/supabase/server";

export const metadata = {
  title: "프로젝트 | Dev Blog",
};

export default async function ProjectsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: projects } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <div className="mb-8 flex items-end justify-between">
        <h1 className="text-3xl font-bold">프로젝트</h1>
        {user && (
          <Link
            href="/projects/new"
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white hover:opacity-90"
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
