import { Github } from "lucide-react";
import { EditableAboutSkills } from "@/components/about/EditableAboutSkills";
import type { Dictionary } from "@/i18n/dictionary";
import type { AboutProfile } from "@/types/database";

type SkillSection = {
  key: keyof Pick<
    AboutProfile,
    "languages" | "frontend" | "backend_database" | "cloud_infra" | "currently_learning"
  >;
  label: string;
};

export function AboutSkills({
  profile,
  isAdmin,
  labels,
}: {
  profile: AboutProfile;
  isAdmin: boolean;
  labels: Dictionary["about"];
}) {
  const sections: SkillSection[] = [
    { key: "languages", label: labels.languages },
    { key: "frontend", label: labels.frontend },
    { key: "backend_database", label: labels.backendDatabase },
    { key: "cloud_infra", label: labels.cloudInfra },
    { key: "currently_learning", label: labels.currentlyLearning },
  ];

  if (isAdmin) {
    return <EditableAboutSkills profile={profile} labels={labels} />;
  }

  return (
    <div className="mt-12 space-y-10 border-t border-border pt-12">
      <h2 className="text-xl font-semibold tracking-tight">{labels.stackTitle}</h2>
      <dl className="space-y-8">
        {sections.map(({ key, label }) => {
          const items = profile[key];
          if (!items.length) return null;
          return (
            <div key={key}>
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

      {profile.github_url && (
        <section className="border-t border-border pt-8">
          <h2 className="section-label mb-4">{labels.links}</h2>
          <a
            href={profile.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-medium transition-colors hover:border-accent hover:text-accent"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
        </section>
      )}
    </div>
  );
}
