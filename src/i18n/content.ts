import type { Locale } from "@/i18n/config";
import type { Post, Project } from "@/types/database";

export function pickLocalized(
  ko: string,
  en: string | null | undefined,
  locale: Locale,
): string {
  if (locale === "ko") return ko;
  const trimmed = en?.trim();
  return trimmed ? trimmed : ko;
}

export function localizePost(post: Post, locale: Locale): Post {
  return {
    ...post,
    title: pickLocalized(post.title, post.title_en, locale),
    content: pickLocalized(post.content, post.content_en, locale),
  };
}

export function localizeProject(project: Project, locale: Locale): Project {
  return {
    ...project,
    name: pickLocalized(project.name, project.name_en, locale),
    description: pickLocalized(project.description, project.description_en, locale),
    role: pickLocalized(project.role, project.role_en, locale),
    content: pickLocalized(project.content, project.content_en, locale),
  };
}
