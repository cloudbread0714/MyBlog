import Link from "next/link";
import { EditablePage } from "@/components/cms/EditablePage";
import { PostCard } from "@/components/posts/PostCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getIsAdmin } from "@/lib/auth";
import { PAGE_SLUGS } from "@/lib/page-defaults";
import { getPageContent } from "@/lib/pages";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const supabase = await createClient();
  const isAdmin = await getIsAdmin();
  const homeContent = await getPageContent(PAGE_SLUGS.home);

  const [{ data: posts }, { data: projects }] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .order("created_at", { ascending: false })
      .limit(2),
  ]);

  const featuredProjects =
    projects && projects.length > 0
      ? projects
      : (
          await supabase
            .from("projects")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(2)
        ).data;

  return (
    <>
      <section className="mb-16">
        <EditablePage
          slug={PAGE_SLUGS.home}
          initialContent={homeContent}
          isAdmin={isAdmin}
        />
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/projects"
            className="rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
          >
            프로젝트 보기
          </Link>
          <Link
            href="/about"
            className="rounded-lg border border-border px-5 py-2.5 text-sm font-medium hover:bg-card"
          >
            소개
          </Link>
        </div>
      </section>

      <section className="mb-16">
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">최신 글</h2>
          <Link href="/posts" className="text-sm text-accent hover:underline">
            전체 보기 →
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {(posts ?? []).map((post) => (
            <li key={post.id}>
              <PostCard post={post} />
            </li>
          ))}
        </ul>
        {!posts?.length && (
          <p className="text-sm text-muted">아직 작성된 글이 없습니다.</p>
        )}
      </section>

      <section>
        <div className="mb-6 flex items-end justify-between">
          <h2 className="text-2xl font-bold">대표 프로젝트</h2>
          <Link href="/projects" className="text-sm text-accent hover:underline">
            전체 보기 →
          </Link>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2">
          {(featuredProjects ?? []).map((project) => (
            <li key={project.id}>
              <ProjectCard project={project} />
            </li>
          ))}
        </ul>
        {!featuredProjects?.length && (
          <p className="text-sm text-muted">아직 등록된 프로젝트가 없습니다.</p>
        )}
      </section>
    </>
  );
}
