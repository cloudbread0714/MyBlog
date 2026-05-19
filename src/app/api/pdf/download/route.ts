import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request) {
  const id = new URL(request.url).searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }

  const supabase = await createClient();
  const { data: file, error } = await supabase
    .from("pdf_files")
    .select("file_name, file_url, mime_type")
    .eq("id", id)
    .single();

  if (error || !file) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const upstream = await fetch(file.file_url);
  if (!upstream.ok) {
    return NextResponse.json({ error: "Failed to fetch file" }, { status: 502 });
  }

  const buffer = await upstream.arrayBuffer();
  const safeName = file.file_name.replace(/[/\\"]/g, "_");
  const encoded = encodeURIComponent(safeName);

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": file.mime_type || "application/octet-stream",
      "Content-Disposition": `attachment; filename="${safeName}"; filename*=UTF-8''${encoded}`,
      "Cache-Control": "private, no-cache",
    },
  });
}
