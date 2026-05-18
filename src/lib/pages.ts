import { pickLocalized } from "@/i18n/content";
import type { Locale } from "@/i18n/config";
import { getPageDefault, type PageSlug } from "@/lib/page-defaults";
import { createClient } from "@/lib/supabase/server";

export async function getPageContent(
  slug: PageSlug,
  locale: Locale,
): Promise<string> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_contents")
    .select("content, content_en")
    .eq("slug", slug)
    .maybeSingle();

  const ko = data?.content?.trim() ? data.content : getPageDefault(slug, "ko");
  const en = data?.content_en?.trim()
    ? data.content_en
    : getPageDefault(slug, "en");

  return pickLocalized(ko, en, locale);
}

export async function getPageContentForEdit(slug: PageSlug) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("page_contents")
    .select("content, content_en")
    .eq("slug", slug)
    .maybeSingle();

  return {
    ko: data?.content?.trim() ? data.content : getPageDefault(slug, "ko"),
    en: data?.content_en?.trim() ? data.content_en : "",
  };
}
