import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const BUCKET = "documents";

function contentDisposition(fileName: string): string {
  const encoded = encodeURIComponent(fileName);
  const ascii = fileName.replace(/[^\x20-\x7E]/g, "_").replace(/[/\\"]/g, "_") || "download";
  return `attachment; filename="${ascii}"; filename*=UTF-8''${encoded}`;
}

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const { data: file, error } = await supabase
      .from("pdf_files")
      .select("file_name, file_path, file_url, mime_type")
      .eq("id", id)
      .single();

    if (error || !file) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    let buffer: ArrayBuffer;

    const { data: blob, error: storageError } = await supabase.storage
      .from(BUCKET)
      .download(file.file_path);

    if (!storageError && blob) {
      buffer = await blob.arrayBuffer();
    } else {
      const upstream = await fetch(file.file_url);
      if (!upstream.ok) {
        return NextResponse.json(
          { error: storageError?.message ?? "Failed to fetch file" },
          { status: 502 },
        );
      }
      buffer = await upstream.arrayBuffer();
    }

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.mime_type || "application/octet-stream",
        "Content-Disposition": contentDisposition(file.file_name),
        "Cache-Control": "private, no-cache",
      },
    });
  } catch (e) {
    console.error("[pdf/download]", e);
    return NextResponse.json({ error: "Download failed" }, { status: 500 });
  }
}
