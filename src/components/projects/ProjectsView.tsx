"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import type { Dictionary } from "@/i18n/dictionary";
import type { Project, ProjectKind } from "@/types/database";
import { cn } from "@/lib/utils";

export function ProjectsView({
  projects,
  labels,
  isAdmin,
  initialTab = "project",
}: {
  projects: Project[];
  labels: Dictionary["projects"];
  isAdmin: boolean;
  initialTab?: ProjectKind;
}) {
  const [tab, setTab] = useState<ProjectKind>(initialTab);

  const filtered = useMemo(
    () => projects.filter((p) => (p.kind ?? "project") === tab),
    [projects, tab],
  );

  const tabs: { id: ProjectKind; label: string }[] = [
    { id: "project", label: labels.tabProjects },
    { id: "education", label: labels.tabEducation },
  ];

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-1 rounded-lg border border-border p-1">
          {tabs.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={cn(
                "rounded-md px-3 py-1.5 font-mono text-xs transition-colors",
                tab === id
                  ? "bg-foreground text-background"
                  : "text-muted hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {isAdmin && (
          <Link
            href={tab === "education" ? "/projects/new?kind=education" : "/projects/new"}
            className="btn-primary shrink-0 !text-xs"
          >
            {tab === "education" ? labels.newEducation : labels.new}
          </Link>
        )}
      </div>

      <ul className="flex flex-col gap-3">
        {filtered.map((project) => (
          <li key={project.id}>
            <ProjectCard project={project} labels={labels} />
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="py-12 text-center font-mono text-sm text-muted">
          {tab === "education" ? labels.noEducation : labels.noProjects}
        </p>
      )}
    </>
  );
}
