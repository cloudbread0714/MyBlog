import { ProjectEditor } from "@/components/projects/ProjectEditor";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";

export const metadata = {
  title: "새 프로젝트 | Dev Blog",
};

export default async function NewProjectPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  return <ProjectEditor labels={{ ...t.editor, ...t.projects }} />;
}
