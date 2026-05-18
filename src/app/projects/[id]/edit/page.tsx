import { notFound } from "next/navigation";
import { ProjectEditor } from "@/components/projects/ProjectEditor";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { createClient } from "@/lib/supabase/server";

type Props = { params: Promise<{ id: string }> };

export default async function EditProjectPage({ params }: Props) {
  const { id } = await params;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (!project) notFound();

  return <ProjectEditor project={project} labels={{ ...t.editor, ...t.projects }} />;
}
