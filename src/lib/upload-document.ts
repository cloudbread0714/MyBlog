import { createClient } from "@/lib/supabase/client";

const BUCKET = "documents";

function sanitizeFileName(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-가-힣]/g, "_").slice(0, 120);
}

export async function uploadDocument(file: File): Promise<{ url: string; path: string }> {
  const supabase = createClient();
  const path = `files/${Date.now()}-${sanitizeFileName(file.name)}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
    contentType: file.type || undefined,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}

export async function deleteDocument(path: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}

export const DOCUMENT_ACCEPT =
  ".pdf,.ppt,.pptx,.doc,.docx,.xls,.xlsx,.zip,.hwp,.hwpx,.key,.pages,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";
