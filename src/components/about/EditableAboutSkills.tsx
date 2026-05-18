"use client";

import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { createClient } from "@/lib/supabase/client";
import type { AboutProfile } from "@/types/database";

type FieldKey = keyof Pick<
  AboutProfile,
  "languages" | "frontend" | "backend_database" | "cloud_infra" | "currently_learning"
>;

function parseList(value: string) {
  return value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function joinList(items: string[]) {
  return items.join(", ");
}

export function EditableAboutSkills({
  profile,
  labels,
}: {
  profile: AboutProfile;
  labels: Dictionary["about"];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [languages, setLanguages] = useState(joinList(profile.languages));
  const [frontend, setFrontend] = useState(joinList(profile.frontend));
  const [backendDatabase, setBackendDatabase] = useState(joinList(profile.backend_database));
  const [cloudInfra, setCloudInfra] = useState(joinList(profile.cloud_infra));
  const [currentlyLearning, setCurrentlyLearning] = useState(joinList(profile.currently_learning));
  const [githubUrl, setGithubUrl] = useState(profile.github_url ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const fields: { key: FieldKey; label: string; value: string; set: (v: string) => void }[] = [
    { key: "languages", label: labels.languages, value: languages, set: setLanguages },
    { key: "frontend", label: labels.frontend, value: frontend, set: setFrontend },
    {
      key: "backend_database",
      label: labels.backendDatabase,
      value: backendDatabase,
      set: setBackendDatabase,
    },
    { key: "cloud_infra", label: labels.cloudInfra, value: cloudInfra, set: setCloudInfra },
    {
      key: "currently_learning",
      label: labels.currentlyLearning,
      value: currentlyLearning,
      set: setCurrentlyLearning,
    },
  ];

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const payload = {
      id: 1,
      languages: parseList(languages),
      frontend: parseList(frontend),
      backend_database: parseList(backendDatabase),
      cloud_infra: parseList(cloudInfra),
      currently_learning: parseList(currentlyLearning),
      github_url: githubUrl.trim() || null,
    };

    const { error: saveError } = await supabase.from("about_profile").upsert(payload);
    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setEditing(false);
    router.refresh();
  };

  const cancel = () => {
    setLanguages(joinList(profile.languages));
    setFrontend(joinList(profile.frontend));
    setBackendDatabase(joinList(profile.backend_database));
    setCloudInfra(joinList(profile.cloud_infra));
    setCurrentlyLearning(joinList(profile.currently_learning));
    setGithubUrl(profile.github_url ?? "");
    setEditing(false);
    setError("");
  };

  if (editing) {
    return (
      <div className="mt-12 space-y-6 border-t border-border pt-12">
        <h2 className="text-xl font-semibold">{labels.editStack}</h2>
        <p className="font-mono text-xs text-muted">{labels.stackHint}</p>
        {fields.map((field) => (
          <div key={field.key}>
            <label className="mb-1.5 block font-mono text-xs text-muted">{field.label}</label>
            <input
              value={field.value}
              onChange={(e) => field.set(e.target.value)}
              placeholder={labels.stackPlaceholder}
              className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
            />
          </div>
        ))}
        <div>
          <label className="mb-1.5 block font-mono text-xs text-muted">{labels.githubUrl}</label>
          <input
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            placeholder="https://github.com/..."
            className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm focus:border-accent focus:outline-none"
          />
        </div>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <div className="flex gap-2">
          <button type="button" onClick={handleSave} disabled={saving} className="btn-primary disabled:opacity-50">
            {labels.save}
          </button>
          <button type="button" onClick={cancel} className="btn-secondary">
            {labels.cancel}
          </button>
        </div>
      </div>
    );
  }

  const displaySections = fields.map((f) => ({
    label: f.label,
    items: parseList(f.value),
  }));

  return (
    <div className="mt-12 space-y-10 border-t border-border pt-12">
      <button
        type="button"
        onClick={() => setEditing(true)}
        className="inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1 font-mono text-xs uppercase tracking-wide text-muted hover:border-accent hover:text-accent"
      >
        <Pencil className="h-3 w-3" />
        {labels.editStack}
      </button>
      <h2 className="text-xl font-semibold tracking-tight">{labels.stackTitle}</h2>
      <dl className="space-y-8">
        {displaySections.map(({ label, items }) => {
          if (!items.length) return null;
          return (
            <div key={label}>
              <dt className="section-label mb-3">{label}</dt>
              <dd>
                <ul className="flex flex-wrap gap-2">
                  {items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full border border-border bg-card px-3 py-1 text-sm font-medium"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
          );
        })}
      </dl>
      {githubUrl && (
        <section className="border-t border-border pt-8">
          <h2 className="section-label mb-4">{labels.links}</h2>
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            GitHub →
          </a>
        </section>
      )}
    </div>
  );
}
