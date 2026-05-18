import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Dictionary } from "@/i18n/dictionary";
import type { Project } from "@/types/database";

export function ProjectCard({
  project,
  labels,
}: {
  project: Project;
  labels: Pick<Dictionary["projects"], "badgeEducation" | "period">;
}) {
  const isEducation = (project.kind ?? "project") === "education";

  return (
    <article className="card group">
      <Link href={`/projects/${project.id}`} className="block p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              {isEducation && (
                <span className="rounded border border-accent/40 bg-accent-soft px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-accent">
                  {labels.badgeEducation}
                </span>
              )}
              {project.period && (
                <span className="font-mono text-xs text-muted">{project.period}</span>
              )}
            </div>
            <h2 className="text-lg font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent">
              {project.name}
            </h2>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>
        <p className="mt-2 line-clamp-2 text-base leading-relaxed text-foreground/85">
          {project.description}
        </p>
        {project.stack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded border border-border bg-background px-2 py-0.5 font-mono text-xs uppercase tracking-wide text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>
        )}
      </Link>
    </article>
  );
}
