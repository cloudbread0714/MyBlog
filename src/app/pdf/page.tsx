import { PdfLibrary } from "@/components/pdf/PdfLibrary";
import { getIsAdmin } from "@/lib/auth";
import { getDictionary } from "@/i18n/dictionary";
import { getLocale } from "@/i18n/locale";
import { createClient } from "@/lib/supabase/server";
import type { PdfFile } from "@/types/database";

export const metadata = {
  title: "자료 | Dev Blog",
  robots: { index: false, follow: false },
};

export default async function PdfPage() {
  const locale = await getLocale();
  const t = getDictionary(locale);
  const isAdmin = await getIsAdmin();
  const supabase = await createClient();

  const { data: files } = await supabase
    .from("pdf_files")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <>
      <header className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">{t.pdf.title}</h1>
      </header>

      <PdfLibrary
        files={(files ?? []) as PdfFile[]}
        isAdmin={isAdmin}
        locale={locale}
        labels={t.pdf}
      />
    </>
  );
}
