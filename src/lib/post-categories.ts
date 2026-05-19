import type { Locale } from "@/i18n/config";

export type PostCategoryRow = {
  slug: string;
  label_ko: string;
  label_en: string;
  sort_order: number;
};

export const FALLBACK_CATEGORIES: PostCategoryRow[] = [
  { slug: "study", label_ko: "스터디", label_en: "Study", sort_order: 0 },
  { slug: "devlog", label_ko: "개발 일지", label_en: "Dev log", sort_order: 1 },
  { slug: "project", label_ko: "프로젝트 회고", label_en: "Project notes", sort_order: 2 },
  { slug: "etc", label_ko: "기타", label_en: "Other", sort_order: 99 },
];

export function getCategoryLabel(
  categories: PostCategoryRow[],
  slug: string,
  locale: Locale,
): string {
  const row = categories.find((c) => c.slug === slug);
  if (!row) return slug;
  return locale === "en" ? row.label_en : row.label_ko;
}

export function getDefaultCategorySlug(categories: PostCategoryRow[]): string {
  return categories[0]?.slug ?? "study";
}
