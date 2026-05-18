import { Github } from "lucide-react";
import Link from "next/link";

const stack = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "Supabase",
  "Tailwind CSS",
];

export const metadata = {
  title: "소개 | Dev Blog",
};

export default function AboutPage() {
  return (
    <article className="max-w-2xl">
      <h1 className="text-3xl font-bold tracking-tight">개발자 소개</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted">
        사용자 경험과 코드 품질을 함께 고민하는 프론트엔드 개발자입니다. 이
        블로그는 프로젝트 경험, 기술 학습, 문제 해결 과정을 기록하는
        포트폴리오 공간입니다.
      </p>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">기술 스택</h2>
        <ul className="mt-4 flex flex-wrap gap-2">
          {stack.map((tech) => (
            <li
              key={tech}
              className="rounded-full border border-border bg-card px-3 py-1 text-sm"
            >
              {tech}
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="text-xl font-semibold">링크</h2>
        <Link
          href="https://github.com/YOUR_USERNAME"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 inline-flex items-center gap-2 text-accent hover:underline"
        >
          <Github className="h-5 w-5" />
          GitHub
        </Link>
      </section>
    </article>
  );
}
