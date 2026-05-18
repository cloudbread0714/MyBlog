"use client";

import dynamic from "next/dynamic";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProseContent } from "@/components/content/ProseContent";
import { createClient } from "@/lib/supabase/client";
import type { PageSlug } from "@/lib/page-defaults";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-xl bg-card" /> },
);

type EditablePageProps = {
  slug: PageSlug;
  initialContent: string;
  isAdmin: boolean;
  className?: string;
};

export function EditablePage({
  slug,
  initialContent,
  isAdmin,
  className = "",
}: EditablePageProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: saveError } = await supabase
      .from("page_contents")
      .upsert({ slug, content }, { onConflict: "slug" });

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setEditing(false);
    router.refresh();
  };

  const handleCancel = () => {
    setContent(initialContent);
    setEditing(false);
    setError("");
  };

  if (editing) {
    return (
      <div className={className}>
        <TiptapEditor
          content={content}
          onChange={setContent}
          uploadContext={{ type: "page", slug }}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            {saving ? "저장 중…" : "저장"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm"
          >
            취소
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative ${className}`}>
      {isAdmin && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mb-6 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted transition-colors hover:border-accent hover:text-accent"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </button>
      )}
      <ProseContent html={content} />
    </div>
  );
}
