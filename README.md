# Dev Blog — 개발 포트폴리오 블로그

Next.js + TipTap + Supabase 기반 WYSIWYG 개발 블로그입니다.  
Markdown 없이 웹 에디터로 글·프로젝트를 작성하고, Ctrl+V 이미지 붙여넣기를 지원합니다.

## 기술 스택

- **Next.js** (App Router) + TypeScript + Tailwind CSS
- **TipTap** — 노션 스타일 WYSIWYG 에디터
- **Supabase** — DB, Auth, Storage
- **Vercel** — 배포

## 시작하기

### 1. Supabase 설정

1. [Supabase](https://supabase.com)에서 프로젝트 생성
2. SQL Editor에서 `supabase/schema.sql` 실행
3. Storage → `images` 버킷이 public인지 확인
4. Authentication → Users에서 관리자 계정 생성

### 2. 환경 변수

```bash
cp .env.example .env.local
```

`.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. 실행

```bash
npm install
npm run dev
```

http://localhost:3000

## 페이지

| 경로 | 설명 |
|------|------|
| `/` | 홈 (소개 + 최신 글 + 대표 프로젝트) |
| `/about` | 개발자 소개 |
| `/posts` | 글 목록 (검색·태그 필터) |
| `/posts/[id]` | 글 상세 |
| `/write` | 글 작성 (로그인 필요) |
| `/projects` | 프로젝트 목록 |
| `/projects/[id]` | 프로젝트 상세 |
| `/projects/new` | 프로젝트 등록 |
| `/login` | 관리자 로그인 |

## 이미지 업로드

- 업로드 버튼 / 드래그 앤 드롭 / **Ctrl+V 붙여넣기**
- 저장 경로: `posts/{postId}/clipboard-{timestamp}.png`, `projects/{projectId}/image-{timestamp}.png`

## GitHub + Vercel 배포 (추천)

코드는 GitHub, 배포는 Vercel, 데이터는 Supabase입니다.

```
GitHub (코드)  →  Vercel (자동 배포)  →  Supabase (DB·Auth·Storage)
```

### 1단계: Supabase 준비

1. [supabase.com](https://supabase.com)에서 프로젝트 생성
2. **SQL Editor** → `supabase/schema.sql` 붙여넣고 실행
3. **Storage** → `images` 버킷이 **Public**인지 확인
4. **Authentication** → **Users** → **Add user**로 관리자 계정 생성 (이메일/비밀번호)
5. **Project Settings** → **API**에서 아래 값 복사
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon` `public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2단계: GitHub에 올리기

GitHub에서 새 저장소를 만듭니다 (예: `dev-blog`). README 추가는 **체크 해제**해도 됩니다.

터미널에서 프로젝트 폴더로 이동 후:

```bash
cd /Users/yujin/Documents/MyHomepage

git init
git add .
git commit -m "Initial commit: dev blog with TipTap and Supabase"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/dev-blog.git
git push -u origin main
```

`YOUR_USERNAME`과 저장소 이름은 본인 GitHub에 맞게 바꿉니다.

### 3단계: Vercel 연결

1. [vercel.com](https://vercel.com) 로그인 (GitHub 계정 연동 권장)
2. **Add New…** → **Project**
3. 방금 push한 저장소 **Import**
4. Framework Preset: **Next.js** (자동 감지)
5. **Environment Variables**에 추가:

   | Name | Value |
   |------|--------|
   | `NEXT_PUBLIC_SUPABASE_URL` | Supabase Project URL |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key |

6. **Deploy** 클릭

1~2분 후 `https://프로젝트명.vercel.app` 주소가 생깁니다.

### 4단계: Supabase에 배포 URL 등록 (로그인 필수)

Vercel 배포가 끝나면 Supabase에서:

1. **Authentication** → **URL Configuration**
2. **Site URL**: `https://프로젝트명.vercel.app`
3. **Redirect URLs**에 추가:
   - `https://프로젝트명.vercel.app/**`
   - `http://localhost:3000/**` (로컬 개발용)

저장 후 `/login`에서 관리자 계정으로 로그인 → `/write`에서 글 작성을 테스트합니다.

### 5단계: 이후 업데이트

코드를 수정하고 push하면 Vercel이 **자동으로 다시 배포**합니다.

```bash
git add .
git commit -m "Update content"
git push
```

### 자주 하는 설정

| 항목 | 위치 |
|------|------|
| 환경 변수 수정 | Vercel → Project → **Settings** → **Environment Variables** |
| 커스텀 도메인 | Vercel → Project → **Settings** → **Domains** |
| 배포 로그 | Vercel → Project → **Deployments** |

### 주의

- `.env.local`은 Git에 올리지 마세요 (이미 `.gitignore`에 포함됨)
- Vercel에는 **Environment Variables**로만 키를 넣습니다
- 로그인이 안 되면 Supabase **Redirect URLs**에 Vercel 주소가 들어갔는지 확인하세요

## 폴더 구조

```
src/
├── app/              # 페이지 라우트
├── components/
│   ├── editor/       # TipTap 에디터
│   ├── layout/
│   ├── posts/
│   ├── projects/
│   └── write/
├── lib/
│   ├── supabase/
│   └── upload.ts     # Storage 업로드
└── types/
supabase/
└── schema.sql
```
