import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Blog | 개발 포트폴리오",
  description: "개발 실력, 프로젝트, 학습 기록을 보여주는 포트폴리오 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${geist.variable} min-h-screen antialiased`}>
        <ThemeProvider>
          <Header />
          <main className="mx-auto min-h-[calc(100vh-8rem)] max-w-5xl px-4 py-10 sm:px-6">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
