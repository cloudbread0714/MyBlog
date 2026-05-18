import Link from "next/link";
import { EditablePage } from "@/components/cms/EditablePage";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PostCard } from "@/components/posts/PostCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getIsAdmin } from "@/lib/auth";
import { localizePost, localizeProject } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { PAGE_SLUGS } from "@/lib/page-defaults";
import { getPageContentForEdit } from "@/lib/pages";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const isAdmin = await getIsAdmin();
  const pageContent = await getPageContentForEdit(PAGE_SLUGS.home);

  const [{ data: posts }, { data: projects }] = await Promise.all([
    supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(4),
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
      <section className="mb-20">
        <EditablePage
          slug={PAGE_SLUGS.home}
          initialContentKo={pageContent.ko}
          initialContentEn={pageContent.en}
          locale={locale}
          isAdmin={isAdmin}
          labels={t.editor}
        />
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href="/projects" className="btn-primary">
            {t.home.projectsBtn}
          </Link>
          <Link href="/about" className="btn-secondary">
            {t.home.aboutBtn}
          </Link>
        </div>
      </section>

      <section className="mb-20">
        <SectionHeader
          label={t.posts.label}
          title={t.home.recentPosts}
          href="/posts"
          linkText={t.home.viewAll}
        />
        <ul className="flex flex-col gap-3">
          {(posts ?? []).map((post) => (
            <li key={post.id}>
              <PostCard
                post={localizePost(post, locale)}
                locale={locale}
                labels={{ readMin: t.posts.readMin }}
              />
            </li>
          ))}
        </ul>
        {!posts?.length && (
          <p className="font-mono text-sm text-muted">{t.home.noPosts}</p>
        )}
      </section>

      <section>
        <SectionHeader
          label={t.projects.label}
          title={t.home.featuredProjects}
          href="/projects"
          linkText={t.home.viewAll}
        />
        <ul className="flex flex-col gap-3">
          {(featuredProjects ?? []).map((project) => (
            <li key={project.id}>
              <ProjectCard project={localizeProject(project, locale)} />
            </li>
          ))}
        </ul>
        {!featuredProjects?.length && (
          <p className="font-mono text-sm text-muted">{t.home.noProjects}</p>
        )}
      </section>
    </>
  );
}
