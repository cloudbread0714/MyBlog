"use client";

import dynamic from "next/dynamic";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProseContent } from "@/components/content/ProseContent";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/database";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-xl bg-card" /> },
);

export function EditableProject({ project, isAdmin }: { project: Project; isAdmin: boolean }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [description, setDescription] = useState(project.description);
  const [role, setRole] = useState(project.role);
  const [stackInput, setStackInput] = useState(project.stack.join(", "));
  const [githubUrl, setGithubUrl] = useState(project.github_url ?? "");
  const [content, setContent] = useState(project.content);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const stack = stackInput.split(",").map((s) => s.trim()).filter(Boolean);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("projects").update({
      name: name.trim(), description: description.trim(), role: role.trim(),
      stack, content, github_url: githubUrl.trim() || null,
    }).eq("id", project.id);
    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    setEditing(false);
    router.refresh();
  };

  const cancel = () => {
    setName(project.name);
    setDescription(project.description);
    setRole(project.role);
    setStackInput(project.stack.join(", "));
    setGithubUrl(project.github_url ?? "");
    setContent(project.content);
    setEditing(false);
    setError("");
  };

  if (editing) {
    return (
      <div className="mt-6 space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="프로젝트명" className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-2xl font-bold focus:border-accent focus:outline-none" />
        <input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="한 줄 소개" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder="역할" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <input value={stackInput} onChange={(e) => setStackInput(e.target.value)} placeholder="기술 스택 (쉼표)" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="GitHub URL" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <TiptapEditor content={content} onChange={setContent} uploadContext={{ type: "project", id: project.id }} />
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
          <Pencil className="h-3.5 w-3.5" /> 프로젝트 수정
        </button>
      )}
      <header className="mt-4 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{project.name}</h1>
        <p className="mt-4 text-lg text-muted">{project.description}</p>
        {project.role && <p className="mt-3 text-sm"><span className="font-medium">역할</span> · {project.role}</p>}
        {project.stack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <li key={tech} className="rounded-full bg-accent-soft px-2.5 py-0.5 text-xs font-medium text-accent">{tech}</li>
            ))}
          </ul>
        )}
        {project.github_url && (
          <a href={project.github_url} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm text-accent hover:underline">GitHub</a>
        )}
      </header>
      <div className="mt-10"><ProseContent html={project.content} /></div>
    </>
  );
}
