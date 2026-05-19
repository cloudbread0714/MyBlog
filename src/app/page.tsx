import { HomeHero } from "@/components/home/HomeHero";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { PostCard } from "@/components/posts/PostCard";
import { ProjectCard } from "@/components/projects/ProjectCard";
import { getIsAdmin } from "@/lib/auth";
import { getAboutProfile } from "@/lib/about-profile";
import { localizePost, localizeProject } from "@/i18n/content";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { getPostCategories } from "@/lib/post-categories.server";
import { PAGE_SLUGS } from "@/lib/page-defaults";
import { getPageContentForEdit } from "@/lib/pages";
import { createClient } from "@/lib/supabase/server";

export default async function HomePage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const supabase = await createClient();
  const isAdmin = await getIsAdmin();
  const [pageContent, profile, categories] = await Promise.all([
    getPageContentForEdit(PAGE_SLUGS.home),
    getAboutProfile(),
    getPostCategories(),
  ]);

  const [{ data: posts }, { data: featuredProjects }, { data: education }] = await Promise.all([
    supabase.from("posts").select("*").order("created_at", { ascending: false }).limit(4),
    supabase
      .from("projects")
      .select("*")
      .eq("featured", true)
      .eq("kind", "project")
      .order("created_at", { ascending: false })
      .limit(2),
    supabase
      .from("projects")
      .select("*")
      .eq("kind", "education")
      .order("created_at", { ascending: false })
      .limit(2),
  ]);

  const projects =
    featuredProjects && featuredProjects.length > 0
      ? featuredProjects
      : (
          await supabase
            .from("projects")
            .select("*")
            .eq("kind", "project")
            .order("created_at", { ascending: false })
            .limit(2)
        ).data;

  const projectLabels = {
    badgeEducation: t.projects.badgeEducation,
    period: t.projects.period,
  };

  const postLabels = { ...t.posts, categories };

  return (
    <>
      <HomeHero
        slug={PAGE_SLUGS.home}
        initialContentKo={pageContent.ko}
        initialContentEn={pageContent.en}
        locale={locale}
        isAdmin={isAdmin}
        avatarUrl={profile.avatar_url}
        editorLabels={t.editor}
        homeLabels={t.home}
      />

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
              <PostCard post={localizePost(post, locale)} locale={locale} labels={postLabels} />
            </li>
          ))}
        </ul>
        {!posts?.length && <p className="font-mono text-sm text-muted">{t.home.noPosts}</p>}
      </section>

      <section className="mb-20">
        <SectionHeader
          label={t.projects.label}
          title={t.home.featuredProjects}
          href="/projects"
          linkText={t.home.viewAll}
        />
        <ul className="flex flex-col gap-3">
          {(projects ?? []).map((project) => (
            <li key={project.id}>
              <ProjectCard project={localizeProject(project, locale)} labels={projectLabels} />
            </li>
          ))}
        </ul>
        {!projects?.length && <p className="font-mono text-sm text-muted">{t.home.noProjects}</p>}
      </section>

      {(education?.length ?? 0) > 0 && (
        <section>
          <SectionHeader
            label={t.projects.label}
            title={t.home.featuredEducation}
            href="/projects?tab=education"
            linkText={t.home.viewAll}
          />
          <ul className="flex flex-col gap-3">
            {education!.map((item) => (
              <li key={item.id}>
                <ProjectCard project={localizeProject(item, locale)} labels={projectLabels} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  );
}
