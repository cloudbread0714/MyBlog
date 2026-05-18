import { createClient } from "@/lib/supabase/server";

export async function getIsAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
}
