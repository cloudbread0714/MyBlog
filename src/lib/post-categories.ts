export const POST_CATEGORIES = [
  "study",
  "devlog",
  "project",
  "troubleshooting",
  "etc",
] as const;

export type PostCategory = (typeof POST_CATEGORIES)[number];

export const DEFAULT_POST_CATEGORY: PostCategory = "study";

export function isPostCategory(value: string): value is PostCategory {
  return (POST_CATEGORIES as readonly string[]).includes(value);
}
