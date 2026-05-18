"use client";

import dynamic from "next/dynamic";
import { Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ProseContent } from "@/components/content/ProseContent";
import { createClient } from "@/lib/supabase/client";
import type { Locale } from "@/i18n/config";
import type { PageSlug } from "@/lib/page-defaults";
import { pickLocalized } from "@/i18n/content";

const TiptapEditor = dynamic(
  () => import("@/components/editor/TiptapEditor").then((m) => m.TiptapEditor),
  { ssr: false, loading: () => <div className="h-40 animate-pulse rounded-xl bg-card" /> },
);

type EditablePageProps = {
  slug: PageSlug;
  initialContentKo: string;
  initialContentEn: string;
  locale: Locale;
  isAdmin: boolean;
  labels: { editSection: string; save: string; saving: string; cancel: string; korean: string; english: string; fallbackNote: string };
  className?: string;
  editPlacement?: "block" | "floating";
};

export function EditablePage({
  slug,
  initialContentKo,
  initialContentEn,
  locale,
  isAdmin,
  labels,
  className = "",
  editPlacement = "block",
}: EditablePageProps) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [editLocale, setEditLocale] = useState<Locale>("ko");
  const [contentKo, setContentKo] = useState(initialContentKo);
  const [contentEn, setContentEn] = useState(initialContentEn);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const displayHtml = pickLocalized(contentKo, contentEn, locale);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    const supabase = createClient();
    const { error: saveError } = await supabase
      .from("page_contents")
      .upsert(
        { slug, content: contentKo, content_en: contentEn },
        { onConflict: "slug" },
      );

    setSaving(false);
    if (saveError) {
      setError(saveError.message);
      return;
    }
    setEditing(false);
    router.refresh();
  };

  const handleCancel = () => {
    setContentKo(initialContentKo);
    setContentEn(initialContentEn);
    setEditing(false);
    setError("");
  };

  if (editing) {
    return (
      <div className={className}>
        <div className="mb-4 flex gap-1 rounded-md border border-border p-0.5 font-mono text-[10px]">
          {(["ko", "en"] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => setEditLocale(code)}
              className={`rounded px-3 py-1 uppercase ${editLocale === code ? "bg-foreground text-background" : "text-muted"}`}
            >
              {code === "ko" ? labels.korean : labels.english}
            </button>
          ))}
        </div>
        <p className="mb-3 font-mono text-xs text-muted">{labels.fallbackNote}</p>
        <TiptapEditor
          key={editLocale}
          content={editLocale === "ko" ? contentKo : contentEn}
          onChange={editLocale === "ko" ? setContentKo : setContentEn}
          uploadContext={{ type: "page", slug: `${slug}-${editLocale}` }}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={handleSave} disabled={saving} className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white disabled:opacity-50">
            {saving ? labels.saving : labels.save}
          </button>
          <button type="button" onClick={handleCancel} className="rounded-lg border border-border px-4 py-2 text-sm">
            {labels.cancel}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`group relative ${className}`}>
      {isAdmin && (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={
            editPlacement === "floating"
              ? "absolute right-0 top-0 z-10 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border bg-background/90 px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted backdrop-blur-sm transition-colors hover:border-accent hover:text-accent"
              : "mb-6 inline-flex items-center gap-1.5 rounded-md border border-dashed border-border px-2.5 py-1 font-mono text-[11px] uppercase tracking-wide text-muted transition-colors hover:border-accent hover:text-accent"
          }
        >
          <Pencil className="h-3 w-3" />
          {labels.editSection}
        </button>
      )}
      <ProseContent html={displayHtml} />
    </div>
  );
}
