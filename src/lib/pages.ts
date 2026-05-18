import { createClient } from "@/lib/supabase/server";
import {
  PAGE_DEFAULTS,
  type PageSlug,
} from "@/lib/page-defaults";

export async function getPageContent(slug: PageSlug): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_contents")
    .select("content")
    .eq("slug", slug)
    .maybeSingle();

  return data?.content?.trim() ? data.content : PAGE_DEFAULTS[slug];
}
