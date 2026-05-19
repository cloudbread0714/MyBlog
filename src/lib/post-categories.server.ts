import { createClient } from "@/lib/supabase/server";
import { FALLBACK_CATEGORIES, type PostCategoryRow } from "@/lib/post-categories";

export async function getPostCategories(): Promise<PostCategoryRow[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("post_categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (!error && data?.length) return data as PostCategoryRow[];
  return FALLBACK_CATEGORIES;
}
