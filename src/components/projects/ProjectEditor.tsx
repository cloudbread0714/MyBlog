"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/database";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-xl bg-card" /> },
);

type ProjectEditorProps = {
  project?: Project;
};

export function ProjectEditor({ project }: ProjectEditorProps) {
  const router = useRouter();
  const draftId = useId().replace(/:/g, "");
  const projectId = project?.id ?? `draft-${draftId}`;

  const [name, setName] = useState(project?.name ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [role, setRole] = useState(project?.role ?? "");
  const [stackInput, setStackInput] = useState(project?.stack.join(", ") ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [content, setContent] = useState(project?.content ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      setMessage("프로젝트 이름을 입력해 주세요.");
      return;
    }

    setSaving(true);
    setMessage("");

    const supabase = createClient();
    const stack = stackInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      name: name.trim(),
      description: description.trim(),
      role: role.trim(),
      stack,
      content,
      github_url: githubUrl.trim() || null,
      featured,
      images: project?.images ?? [],
    };

    if (project) {
      const { error } = await supabase.from("projects").update(payload).eq("id", project.id);
      setSaving(false);
      if (error) {
        setMessage(error.message);
        return;
      }
      router.push(`/projects/${project.id}`);
    } else {
      const { data, error } = await supabase.from("projects").insert(payload).select("id").single();
      setSaving(false);
      if (error) {
        setMessage(error.message);
        return;
      }
      router.push(`/projects/${data.id}`);
    }
    router.refresh();
  }, [name, description, role, stackInput, githubUrl, content, featured, project, router]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">{project ? "프로젝트 수정" : "새 프로젝트"}</h1>
      <p className="mt-2 text-sm text-muted">
        개요, 기술 스택, 문제 해결 과정, 결과 이미지를 정리하세요.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">프로젝트명</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">한 줄 소개</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">역할</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
            placeholder="프론트엔드 개발"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">기술 스택 (쉼표 구분)</label>
          <input
            value={stackInput}
            onChange={(e) => setStackInput(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
            placeholder="Next.js, Supabase"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">GitHub URL</label>
          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
            placeholder="https://github.com/..."
          />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={featured}
            onChange={(e) => setFeatured(e.target.checked)}
            className="rounded border-border"
          />
          홈에 대표 프로젝트로 표시
        </label>
        <div>
          <label className="mb-1.5 block text-sm font-medium">상세 내용</label>
          <TiptapEditor
            content={content}
            onChange={setContent}
            uploadContext={{ type: "project", id: projectId }}
            placeholder="개요, 핵심 기능, 문제 해결 과정을 작성하세요…"
          />
        </div>
      </div>

      {message && <p className="text-sm text-red-500">{message}</p>}

      <div className="mt-6">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="rounded-lg bg-accent px-6 py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
          {saving ? "저장 중…" : "저장"}
        </button>
      </div>
    </div>
  );
}
