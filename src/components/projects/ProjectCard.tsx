import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/types/database";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="card group">
      <Link href={`/projects/${project.id}`} className="block p-5">
        <div className="flex items-start justify-between gap-3">
          <h2 className="text-base font-semibold leading-snug tracking-tight transition-colors group-hover:text-accent">
            {project.name}
          </h2>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100" />
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-foreground/80">
          {project.description}
        </p>
        {project.stack.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded border border-border bg-background px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted"
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
