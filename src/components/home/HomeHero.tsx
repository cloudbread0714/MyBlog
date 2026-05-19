import Link from "next/link";
import { EditablePage } from "@/components/cms/EditablePage";
import { HomeAvatar } from "@/components/home/HomeAvatar";
import type { Dictionary } from "@/i18n/dictionary";
import type { Locale } from "@/i18n/config";
import type { PageSlug } from "@/lib/page-defaults";

type HomeHeroProps = {
  slug: PageSlug;
  initialContentKo: string;
  initialContentEn: string;
  locale: Locale;
  isAdmin: boolean;
  avatarUrl: string | null;
  editorLabels: Dictionary["editor"];
  homeLabels: Dictionary["home"];
};

export function HomeHero({
  slug,
  initialContentKo,
  initialContentEn,
  locale,
  isAdmin,
  avatarUrl,
  editorLabels,
  homeLabels,
}: HomeHeroProps) {
  return (
    <section className="mb-20">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-[11rem_minmax(0,1fr)] sm:items-stretch sm:gap-10">
        <div className="flex items-center justify-center sm:justify-start">
          <HomeAvatar avatarUrl={avatarUrl} isAdmin={isAdmin} labels={homeLabels} compact />
        </div>

        <div className="relative flex min-w-0 flex-col justify-center">
          <EditablePage
            slug={slug}
            initialContentKo={initialContentKo}
            initialContentEn={initialContentEn}
            locale={locale}
            isAdmin={isAdmin}
            labels={editorLabels}
            editPlacement="floating"
          />
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="btn-primary">
              {homeLabels.projectsBtn}
            </Link>
            <Link href="/about" className="btn-secondary">
              {homeLabels.aboutBtn}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
