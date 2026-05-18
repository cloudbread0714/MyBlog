import Link from "next/link";
import { notFound } from "next/navigation";
import { EditableProject } from "@/components/cms/EditableProject";
import { getIsAdmin } from "@/lib/auth";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("name").eq("id", id).single();
  return { title: data ? `${data.name} | Dev Blog` : "프로젝트 | Dev Blog" };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const [isAdmin, { data: project }] = await Promise.all([
    getIsAdmin(),
    supabase.from("projects").select("*").eq("id", id).single(),
  ]);

  if (!project) notFound();

  return (
    <article className="max-w-3xl">
      <Link href="/projects" className="text-sm text-accent hover:underline">
        ← 프로젝트 목록
      </Link>

      {project.images.length > 0 && (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {project.images.map((src: string) => (
            <img
              key={src}
              src={src}
              alt={project.name}
              className="w-full rounded-xl shadow-md"
            />
          ))}
        </div>
      )}

      <EditableProject project={project} isAdmin={isAdmin} />
    </article>
  );
}
