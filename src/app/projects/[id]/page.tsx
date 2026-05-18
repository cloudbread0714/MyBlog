import Link from "next/link";
import { notFound } from "next/navigation";
import { EditableProject } from "@/components/cms/EditableProject";
import { getIsAdmin } from "@/lib/auth";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("name, name_en")
    .eq("id", id)
    .single();
  const locale = await getLocale();
  const name =
    locale === "en" && data?.name_en?.trim() ? data.name_en : data?.name;
  return { title: name ? `${name} | Dev Blog` : "프로젝트 | Dev Blog" };
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const [isAdmin, { data: project }] = await Promise.all([
    getIsAdmin(),
    supabase.from("projects").select("*").eq("id", id).single(),
  ]);

  if (!project) notFound();

  return (
    <article className="max-w-3xl">
      <Link
        href="/projects"
        className="inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-accent"
      >
        ← {t.projects.back}
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

      <EditableProject
        project={project}
        locale={locale}
        isAdmin={isAdmin}
        labels={{ ...t.editor, ...t.projects }}
      />
    </article>
  );
}
