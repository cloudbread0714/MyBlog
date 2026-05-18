"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { createClient } from "@/lib/supabase/client";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  {
    ssr: false,
    loading: () => <div className="h-80 animate-pulse rounded-xl bg-card" />,
  },
);

const DRAFT_KEY = "post-draft-v2";

export function PostEditor({ labels }: { labels: Dictionary["editor"] }) {
  const router = useRouter();
  const draftId = useId().replace(/:/g, "");
  const postId = `draft-${draftId}`;

  const [title, setTitle] = useState("");
  const [titleEn, setTitleEn] = useState("");
  const [content, setContent] = useState("");
  const [contentEn, setContentEn] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved) as Record<string, string>;
        setTitle(draft.title ?? "");
        setTitleEn(draft.titleEn ?? "");
        setContent(draft.content ?? "");
        setContentEn(draft.contentEn ?? "");
        setTagsInput(draft.tagsInput ?? "");
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, titleEn, content, contentEn, tagsInput }),
      );
    }, 1500);
    return () => clearTimeout(timer);
  }, [title, titleEn, content, contentEn, tagsInput]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setMessage(labels.title);
      return;
    }

    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { data, error } = await supabase
      .from("posts")
      .insert({
        title: title.trim(),
        title_en: titleEn.trim() || null,
        content,
        content_en: contentEn.trim() || null,
        tags,
        thumbnail: null,
      })
      .select("id")
      .single();

    setSaving(false);

    if (error) {
      setMessage(error.message);
      return;
    }

    localStorage.removeItem(DRAFT_KEY);
    router.push(`/posts/${data.id}`);
    router.refresh();
  }, [title, titleEn, content, contentEn, tagsInput, router, labels.title]);

  const inputClass =
    "w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none";

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">{labels.writeTitle}</h1>
      <p className="mt-2 text-sm text-muted">{labels.writeHint}</p>
      <p className="mt-1 font-mono text-xs text-muted">{labels.fallbackNote}</p>

      <div className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block font-mono text-xs text-muted">{labels.title}</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs text-muted">{labels.englishTitle}</label>
          <input value={titleEn} onChange={(e) => setTitleEn(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs text-muted">{labels.tags}</label>
          <input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs text-muted">{labels.body}</label>
          <TiptapEditor content={content} onChange={setContent} uploadContext={{ type: "post", id: postId }} />
        </div>
        <div>
          <label className="mb-1.5 block font-mono text-xs text-muted">{labels.englishBody}</label>
          <TiptapEditor
            content={contentEn}
            onChange={setContentEn}
            uploadContext={{ type: "post", id: `${postId}-en` }}
          />
        </div>
      </div>

      {message && <p className="text-sm text-red-500">{message}</p>}

      <div className="mt-6">
        <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
          {saving ? labels.saving : labels.publish}
        </button>
      </div>
    </div>
  );
}
