export type Post = {
  id: string;
  title: string;
  title_en?: string | null;
  content: string;
  content_en?: string | null;
  tags: string[];
  thumbnail: string | null;
  views: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  name_en?: string | null;
  description: string;
  description_en?: string | null;
  stack: string[];
  role: string;
  role_en?: string | null;
  content: string;
  content_en?: string | null;
  images: string[];
  github_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type PageContent = {
  slug: string;
  content: string;
  content_en: string;
  updated_at: string;
};

export type PostInsert = Pick<Post, "title" | "content" | "tags" | "thumbnail">;
export type ProjectInsert = Pick<
  Project,
  "name" | "description" | "stack" | "role" | "content" | "images" | "github_url" | "featured"
>;
