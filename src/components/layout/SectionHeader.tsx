import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export function SectionHeader({
  label,
  title,
  href,
  linkText = "View all",
}: {
  label: string;
  title: string;
  href?: string;
  linkText?: string;
}) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-4">
      <div>
        <p className="section-label">{label}</p>
        <h2 className="mt-1 text-xl font-semibold tracking-tight">{title}</h2>
      </div>
      {href && (
        <Link
          href={href}
          className="group inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-accent"
        >
          {linkText}
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}
