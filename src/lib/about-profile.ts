import { DEFAULT_ABOUT_PROFILE } from "@/lib/about-defaults";
import { createClient } from "@/lib/supabase/server";
import type { AboutProfile } from "@/types/database";

export async function getAboutProfile(): Promise<AboutProfile> {
  const supabase = await createClient();
  const { data } = await supabase.from("about_profile").select("*").eq("id", 1).single();

  if (!data) {
    return {
      ...DEFAULT_ABOUT_PROFILE,
      updated_at: new Date().toISOString(),
    };
  }

  return data as AboutProfile;
}
