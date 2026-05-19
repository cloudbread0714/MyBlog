import { createClient } from "@/lib/supabase/client";

const BUCKET = "documents";

/** Supabase Storage는 ASCII 파일명만 허용 (한글 등은 InvalidKey 오류) */
function storageObjectPath(file: File): string {
  const rawExt = file.name.includes(".") ? file.name.slice(file.name.lastIndexOf(".")) : "";
  const ext = rawExt.toLowerCase().replace(/[^a-z0-9.]/g, "") || ".bin";
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
  return `files/${id}${ext}`;
}

export async function uploadDocument(file: File): Promise<{ url: string; path: string }> {
  const supabase = createClient();
  const path = storageObjectPath(file);

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
