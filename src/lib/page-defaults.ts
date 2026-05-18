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
