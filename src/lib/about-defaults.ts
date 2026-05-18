import type { AboutProfile } from "@/types/database";

export const DEFAULT_ABOUT_PROFILE: Omit<AboutProfile, "updated_at"> = {
  id: 1,
  languages: ["TypeScript", "JavaScript"],
  frontend: ["React", "Next.js", "Tailwind CSS"],
  backend_database: ["Node.js", "Supabase", "PostgreSQL"],
  cloud_infra: ["Vercel"],
  currently_learning: [],
  github_url: "https://github.com/cloudbread0714",
  avatar_url: null,
};
