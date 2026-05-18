import { Github } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProseContent } from "@/components/content/ProseContent";
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
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  return (
    <article className="max-w-3xl">
      <Link href="/projects" className="text-sm text-accent hover:underline">
        ← 프로젝트 목록
      </Link>

      <header className="mt-6 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{project.name}</h1>
        <p className="mt-4 text-lg text-muted">{project.description}</p>

        {project.role && (
          <p className="mt-3 text-sm">
            <span className="font-medium">역할</span> · {project.role}
          </p>
        )}

        {project.stack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech: string) => (
              <li
                key={tech}
                className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-4 flex flex-wrap gap-4">
          {project.github_url && (
            <a
              href={project.github_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-accent hover:underline"
            >
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
          {user && (
            <Link
              href={`/projects/${id}/edit`}
              className="text-sm text-muted hover:text-foreground"
            >
              수정
            </Link>
          )}
        </div>
      </header>

      {project.images.length > 0 && (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
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

      <div className="mt-10">
        <ProseContent html={project.content} />
      </div>
    </article>
  );
}
