import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { getLocale } from "@/i18n/locale";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Dev Blog | 개발 포트폴리오",
  description: "개발 실력, 프로젝트, 학습 기록을 보여주는 포트폴리오 블로그",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>
          <div className="bg-grid min-h-screen">
            <Header />
            <main className="mx-auto min-h-[calc(100vh-10rem)] max-w-3xl px-5 py-12 sm:px-8">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
