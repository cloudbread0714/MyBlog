"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useId, useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { createClient } from "@/lib/supabase/client";
import type { Project } from "@/types/database";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-80 animate-pulse rounded-xl bg-card" /> },
);

type ProjectEditorProps = {
  project?: Project;
  labels: Dictionary["editor"] & Dictionary["projects"];
};

export function ProjectEditor({ project, labels }: ProjectEditorProps) {
  const router = useRouter();
  const draftId = useId().replace(/:/g, "");
  const projectId = project?.id ?? `draft-${draftId}`;

  const [name, setName] = useState(project?.name ?? "");
  const [nameEn, setNameEn] = useState(project?.name_en ?? "");
  const [description, setDescription] = useState(project?.description ?? "");
  const [descriptionEn, setDescriptionEn] = useState(project?.description_en ?? "");
  const [role, setRole] = useState(project?.role ?? "");
  const [roleEn, setRoleEn] = useState(project?.role_en ?? "");
  const [stackInput, setStackInput] = useState(project?.stack.join(", ") ?? "");
  const [githubUrl, setGithubUrl] = useState(project?.github_url ?? "");
  const [content, setContent] = useState(project?.content ?? "");
  const [contentEn, setContentEn] = useState(project?.content_en ?? "");
  const [featured, setFeatured] = useState(project?.featured ?? false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const handleSave = useCallback(async () => {
    if (!name.trim()) {
      setMessage(labels.title);
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
      name_en: nameEn.trim() || null,
      description: description.trim(),
      description_en: descriptionEn.trim() || null,
      role: role.trim(),
      role_en: roleEn.trim() || null,
      stack,
      content,
      content_en: contentEn.trim() || null,
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
  }, [
    name,
    nameEn,
    description,
    descriptionEn,
    role,
    roleEn,
    stackInput,
    githubUrl,
    content,
    contentEn,
    featured,
    project,
    router,
    labels.title,
  ]);

  return (
    <div className="max-w-3xl">
      <h1 className="text-3xl font-bold">{project ? labels.editProject : labels.new}</h1>
      <p className="mt-2 text-sm text-muted">{labels.fallbackNote}</p>

      <div className="mt-8 space-y-5">
        <div>
          <label className="mb-1.5 block text-sm font-medium">{labels.title}</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{labels.englishTitle}</label>
          <input
            value={nameEn}
            onChange={(e) => setNameEn(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{labels.summary}</label>
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{labels.englishOptional}</label>
          <input
            value={descriptionEn}
            onChange={(e) => setDescriptionEn(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{labels.role}</label>
          <input
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
          />
        </div>
        <input
          value={roleEn}
          onChange={(e) => setRoleEn(e.target.value)}
          placeholder={labels.englishOptional}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 focus:border-accent focus:outline-none"
        />
        <div>
          <label className="mb-1.5 block text-sm font-medium">Stack</label>
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
          Featured
        </label>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{labels.body}</label>
          <TiptapEditor
            content={content}
            onChange={setContent}
            uploadContext={{ type: "project", id: projectId }}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium">{labels.englishBody}</label>
          <TiptapEditor
            content={contentEn}
            onChange={setContentEn}
            uploadContext={{ type: "project", id: `${projectId}-en` }}
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
          {saving ? labels.saving : labels.save}
        </button>
      </div>
    </div>
  );
}
