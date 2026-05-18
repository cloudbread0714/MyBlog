export type Post = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  thumbnail: string | null;
  views: number;
  created_at: string;
  updated_at: string;
};

export type Project = {
  id: string;
  name: string;
  description: string;
  stack: string[];
  role: string;
  content: string;
  images: string[];
  github_url: string | null;
  featured: boolean;
  created_at: string;
  updated_at: string;
};

export type PostInsert = Pick<Post, "title" | "content" | "tags" | "thumbnail">;
export type ProjectInsert = Pick<
  Project,
  "name" | "description" | "stack" | "role" | "content" | "images" | "github_url" | "featured"
>;
