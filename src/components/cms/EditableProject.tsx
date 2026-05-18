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
import type { Project } from "@/types/database";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-xl bg-card" /> },
);

export function EditableProject({
  project,
  locale,
  isAdmin,
  labels,
}: {
  project: Project;
  locale: Locale;
  isAdmin: boolean;
  labels: Dictionary["editor"] & Dictionary["projects"];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(project.name);
  const [nameEn, setNameEn] = useState(project.name_en ?? "");
  const [description, setDescription] = useState(project.description);
  const [descriptionEn, setDescriptionEn] = useState(project.description_en ?? "");
  const [role, setRole] = useState(project.role);
  const [roleEn, setRoleEn] = useState(project.role_en ?? "");
  const [stackInput, setStackInput] = useState(project.stack.join(", "));
  const [githubUrl, setGithubUrl] = useState(project.github_url ?? "");
  const [content, setContent] = useState(project.content);
  const [contentEn, setContentEn] = useState(project.content_en ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const stack = stackInput.split(",").map((s) => s.trim()).filter(Boolean);
    const supabase = createClient();
    const { error: saveError } = await supabase.from("projects").update({
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
    }).eq("id", project.id);
    setSaving(false);
    if (saveError) { setError(saveError.message); return; }
    setEditing(false);
    router.refresh();
  };

  const cancel = () => {
    setName(project.name);
    setNameEn(project.name_en ?? "");
    setDescription(project.description);
    setDescriptionEn(project.description_en ?? "");
    setRole(project.role);
    setRoleEn(project.role_en ?? "");
    setStackInput(project.stack.join(", "));
    setGithubUrl(project.github_url ?? "");
    setContent(project.content);
    setContentEn(project.content_en ?? "");
    setEditing(false);
    setError("");
  };

  const displayName = pickLocalized(name, nameEn, locale);
  const displayDescription = pickLocalized(description, descriptionEn, locale);
  const displayRole = pickLocalized(role, roleEn, locale);
  const displayContent = pickLocalized(content, contentEn, locale);

  if (editing) {
    return (
      <div className="mt-6 space-y-4">
        <p className="font-mono text-xs text-muted">{labels.fallbackNote}</p>
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">{labels.title}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-2xl font-bold focus:border-accent focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">{labels.englishTitle}</label>
          <input value={nameEn} onChange={(e) => setNameEn(e.target.value)} className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        </div>
        <input value={description} onChange={(e) => setDescription(e.target.value)} className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <input value={descriptionEn} onChange={(e) => setDescriptionEn(e.target.value)} placeholder={labels.englishOptional} className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <input value={role} onChange={(e) => setRole(e.target.value)} placeholder={labels.role} className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <input value={roleEn} onChange={(e) => setRoleEn(e.target.value)} className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <input value={stackInput} onChange={(e) => setStackInput(e.target.value)} className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="GitHub URL" className="w-full rounded-lg border border-border bg-card px-4 py-2 text-sm focus:border-accent focus:outline-none" />
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">{labels.body}</label>
          <TiptapEditor content={content} onChange={setContent} uploadContext={{ type: "project", id: project.id }} />
        </div>
        <div>
          <label className="mb-1 block font-mono text-xs text-muted">{labels.englishBody}</label>
          <TiptapEditor content={contentEn} onChange={setContentEn} uploadContext={{ type: "project", id: `${project.id}-en` }} />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">{saving ? labels.saving : labels.save}</button>
          <button type="button" onClick={cancel} className="btn-secondary">{labels.cancel}</button>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAdmin && (
        <button type="button" onClick={() => setEditing(true)} className="mt-6 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-accent/50 bg-accent-soft/50 px-3 py-1.5 text-sm text-accent">
          <Pencil className="h-3.5 w-3.5" /> {labels.editProject}
        </button>
      )}
      <header className="mt-4 border-b border-border pb-8">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{displayName}</h1>
        <p className="mt-4 text-lg text-foreground/85">{displayDescription}</p>
        {displayRole && (
          <p className="mt-3 text-sm">
            <span className="font-medium">{labels.role}</span> · {displayRole}
          </p>
        )}
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
      <div className="mt-10"><ProseContent html={displayContent} /></div>
    </>
  );
}
