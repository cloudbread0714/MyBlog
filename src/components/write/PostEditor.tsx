"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  {
    ssr: false,
    loading: () => <div className="h-80 animate-pulse rounded-xl bg-card" />,
  },
);

const DRAFT_KEY = "post-draft";

export function PostEditor() {
  const router = useRouter();
  const draftId = useId().replace(/:/g, "");
  const postId = `draft-${draftId}`;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [tagsInput, setTagsInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (saved) {
      try {
        const draft = JSON.parse(saved) as {
          title: string;
          content: string;
          tagsInput: string;
        };
        setTitle(draft.title);
        setContent(draft.content);
        setTagsInput(draft.tagsInput);
      } catch {
        /* ignore */
      }
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ title, content, tagsInput }),
      );
    }, 1500);
    return () => clearTimeout(timer);
  }, [title, content, tagsInput]);

  const handleSave = useCallback(async () => {
    if (!title.trim()) {
      setMessage("제목을 입력해 주세요.");
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
      .insert({ title: title.trim(), content, tags, thumbnail: null })
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
  }, [title, content, tagsInput, router]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">글 작성</h1>
      <p className="mt-2 text-sm text-muted">
        이미지는 버튼, 드래그 앤 드롭, Ctrl+V 붙여넣기로 삽입할 수 있습니다.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">제목</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
            placeholder="글 제목"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">
            태그 (쉼표로 구분)
          </label>
          <input
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
            placeholder="React, TypeScript"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium">본문</label>
          <TiptapEditor
            content={content}
            onChange={setContent}
            uploadContext={{ type: "post", id: postId }}
          />
        </div>
      </div>

      {message && <p className="text-sm text-red-500">{message}</p>}

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "저장 중…" : "발행하기"}
        </button>
      </div>
    </div>
  );
}
