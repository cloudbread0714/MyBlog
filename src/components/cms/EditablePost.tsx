"use client";

import dynamic from "next/dynamic";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProseContent } from "@/components/content/ProseContent";
import { pickLocalized } from "@/i18n/content";
import type { Locale } from "@/i18n/config";
import type { Dictionary } from "@/i18n/dictionary";
import { createClient } from "@/lib/supabase/client";
import type { Post } from "@/types/database";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-xl bg-card" /> },
);

export function EditablePost({
  post,
  locale,
  isAdmin,
  labels,
}: {
  post: Post;
  locale: Locale;
  isAdmin: boolean;
  labels: Dictionary["editor"] & Dictionary["posts"];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(post.title);
  const [titleEn, setTitleEn] = useState(post.title_en ?? "");
  const [content, setContent] = useState(post.content);
  const [contentEn, setContentEn] = useState(post.content_en ?? "");
  const [tagsInput, setTagsInput] = useState(post.tags.join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const displayTitle = pickLocalized(title, titleEn, locale);
  const displayContent = pickLocalized(content, contentEn, locale);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const supabase = createClient();
    const { error: saveError } = await supabase
      .from("posts")
      .update({
        title: title.trim(),
        title_en: titleEn.trim() || null,
        content,
        content_en: contentEn.trim() || null,
        tags,
      })
      .eq("id", post.id);
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setEditing(false);
    router.refresh();
  };

  const cancel = () => {
    setTitle(post.title);
    setTitleEn(post.title_en ?? "");
    setContent(post.content);
    setContentEn(post.content_en ?? "");
    setTagsInput(post.tags.join(", "));
    setEditing(false);
    setError("");
  };

  if (editing) {
    return (
      <div className="mt-6 space-y-4">
        <p className="font-mono text-xs text-muted">{labels.fallbackNote}</p>
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">{labels.title}</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-xl font-bold focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">{labels.englishTitle}</label>
          <input
            value={titleEn}
            onChange={(e) => setTitleEn(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        <input
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          placeholder={labels.tags}
          className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">{labels.body}</label>
          <TiptapEditor content={content} onChange={setContent} uploadContext={{ type: "post", id: post.id }} />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">{labels.englishBody}</label>
          <TiptapEditor
            content={contentEn}
            onChange={setContentEn}
            uploadContext={{ type: "post", id: `${post.id}-en` }}
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? labels.saving : labels.save}
          </button>
          <button type="button" onClick={cancel} className="btn-secondary">
            {labels.cancel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAdmin && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="mt-6 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted hover:border-accent hover:text-accent"
        >
          <Pencil className="h-3 w-3" />
          {labels.editPost}
        </button>
      )}
      <header className="mt-4 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{displayTitle}</h1>
      </header>
      <div className="mt-10">
        <ProseContent html={displayContent} />
      </div>
    </>
  );
}
