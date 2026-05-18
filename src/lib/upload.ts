import { createClient } from "@/lib/supabase/client";

export type UploadContext =
  | { type: "post"; id: string }
  | { type: "project"; id: string }
  | { type: "page"; slug: string };

function buildPath(ctx: UploadContext, file: File): string {
  const ext = file.name.split(".").pop() || "png";
  const ts = Date.now();

  if (ctx.type === "post") {
    return `posts/${ctx.id}/clipboard-${ts}.${ext}`;
  }
  if (ctx.type === "project") {
    return `projects/${ctx.id}/image-${ts}.${ext}`;
  }
  return `pages/${ctx.slug}/image-${ts}.${ext}`;
}

export async function uploadImage(
  file: File,
  ctx: UploadContext,
): Promise<string> {
  const supabase = createClient();
  const path = buildPath(ctx, file);

  const { error } = await supabase.storage.from("images").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) throw error;

  const { data } = supabase.storage.from("images").getPublicUrl(path);
  return data.publicUrl;
}

export function extractImageFiles(dataTransfer: DataTransfer | null): File[] {
  if (!dataTransfer) return [];

  const files: File[] = [];

  if (dataTransfer.files?.length) {
    Array.from(dataTransfer.files).forEach((f) => {
      if (f.type.startsWith("image/")) files.push(f);
    });
  }

  if (dataTransfer.items) {
    Array.from(dataTransfer.items).forEach((item) => {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (file) files.push(file);
      }
    });
  }

  return files;
}
