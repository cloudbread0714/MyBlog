import type { Locale } from "@/i18n/config";

export const PAGE_SLUGS = {
  home: "home",
  about: "about",
  posts: "posts",
  projects: "projects",
} as const;

export type PageSlug = (typeof PAGE_SLUGS)[keyof typeof PAGE_SLUGS];

export const PAGE_DEFAULTS: Record<PageSlug, string> = {
  home: `<p class="section-eyebrow">Developer Blog</p>
<h1>안녕하세요,<br/>개발자 Yujin입니다.</h1>
<p>프로젝트 경험, 문제 해결 과정, 학습 기록을 정리하는 공간입니다.</p>`,
  about: `<h1>개발자 소개</h1>
<p>사용자 경험과 코드 품질을 함께 고민하는 프론트엔드 개발자입니다. 이 블로그는 프로젝트 경험, 기술 학습, 문제 해결 과정을 기록하는 포트폴리오 공간입니다.</p>
<h2>기술 스택</h2>
<ul>
<li>TypeScript</li>
<li>React</li>
<li>Next.js</li>
<li>Node.js</li>
<li>Supabase</li>
<li>Tailwind CSS</li>
</ul>
<h2>링크</h2>
<p><a href="https://github.com/cloudbread0714" target="_blank" rel="noopener noreferrer">GitHub</a></p>`,
  posts: `<h1>글</h1>
<p>개발하며 배운 내용과 문제 해결 과정을 기록합니다.</p>`,
  projects: `<h1>프로젝트</h1>
<p>직접 만들고 참여한 프로젝트입니다.</p>`,
};

export const PAGE_DEFAULTS_EN: Record<PageSlug, string> = {
  home: `<p class="section-eyebrow">Developer Blog</p>
<h1>Hello,<br/>I'm Yujin.</h1>
<p>A portfolio of projects, problem-solving notes, and learning logs.</p>`,
  about: `<h1>About</h1>
<p>Frontend developer focused on user experience and code quality. This site documents projects, learning, and how I solve problems.</p>
<h2>Stack</h2>
<ul>
<li>TypeScript</li>
<li>React</li>
<li>Next.js</li>
<li>Node.js</li>
<li>Supabase</li>
<li>Tailwind CSS</li>
</ul>
<h2>Links</h2>
<p><a href="https://github.com/cloudbread0714" target="_blank" rel="noopener noreferrer">GitHub</a></p>`,
  posts: `<h1>Posts</h1>
<p>Notes on what I build and learn.</p>`,
  projects: `<h1>Projects</h1>
<p>Things I've built and contributed to.</p>`,
};

export function getPageDefault(slug: PageSlug, locale: Locale): string {
  return locale === "en" ? PAGE_DEFAULTS_EN[slug] : PAGE_DEFAULTS[slug];
}
