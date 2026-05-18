"use client";

import dynamic from "next/dynamic";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProseContent } from "@/components/content/ProseContent";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/types/database";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-xl bg-card" /> },
);

export function EditablePost({ post, isAdmin }: { post: Post; isAdmin: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [content, setContent] = useState(post.content);
  const [tagsInput, setTagsInput] = useState(post.tags.join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const supabase = createClient();
    const { error: saveError } = await supabase
      .from("posts")
      .update({ title: title.trim(), content, tags })
      .eq("id", post.id);
    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    setEditing(false);
    router.refresh();
  };

  const cancel = () => {
    setTitle(post.title);
    setContent(post.content);
    setTagsInput(post.tags.join(", "));
    setEditing(false);
    setError("");
  };

  if (editing) {
    return (
      <div className="mt-6 space-y-4">
        <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-2xl font-bold focus:border-accent focus:outline-none" />
        <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} placeholder="태그 (쉼표 구분)" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <TiptapEditor content={content} onChange={setContent} uploadContext={{ type: "post", id: post.id }} />
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "저장 중…" : "저장"}</button>
          <button type="button" onClick={cancel} className="rounded-lg border border-border px-4 py-2 text-sm">취소</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAdmin && (
        <button type="button" onClick={() => setEditing(true)} className="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-accent/50 bg-accent-soft/50 px-3 py-1.5 text-sm text-accent">
          <Pencil className="h-3.5 w-3.5" /> 글 수정
        </button>
      )}
      <header className="mt-4 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{post.title}</h1>
      </header>
      <div className="mt-10"><ProseContent html={post.content} /></div>
    </>
  );
}
