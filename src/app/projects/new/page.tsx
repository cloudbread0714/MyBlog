import { ProjectEditor } from "@/components/projects/ProjectEditor";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import type { ProjectKind } from "@/types/database";

export const metadata = {
  title: "새 항목 | Dev Blog",
};

type Props = { searchParams: Promise<{ kind?: string }> };

export default async function NewProjectPage({ searchParams }: Props) {
  const { kind } = await searchParams;
  const locale = await getLocale();
  const t = getDictionary(locale);
  const initialKind: ProjectKind = kind === "education" ? "education" : "project";

  return (
    <ProjectEditor
      initialKind={initialKind}
      labels={{ ...t.editor, ...t.projects }}
    />
  );
}
