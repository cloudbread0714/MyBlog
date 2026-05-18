"use client";

import { Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { PostCategoryRow } from "@/lib/post-categories";
import { createClient } from "@/lib/supabase/client";

function toSlug(value: string) {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9가-힣-]/g, "")
      .replace(/-+/g, "-")
      .slice(0, 40) || `cat-${Date.now()}`
  );
}

export function CategoryManager({
  categories: initial,
  labels,
}: {
  categories: PostCategoryRow[];
  labels: {
    title: string;
    hint: string;
    nameKo: string;
    nameEn: string;
    slug: string;
    add: string;
    saving: string;
    delete: string;
  };
}) {
  const router = useRouter();
  const [categories, setCategories] = useState(initial);
  const [labelKo, setLabelKo] = useState("");
  const [labelEn, setLabelEn] = useState("");
  const [slugInput, setSlugInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!labelKo.trim()) return;
    setBusy(true);
    setError("");
    const slug = slugInput.trim() || toSlug(labelEn || labelKo);
    const supabase = createClient();
    const sort_order = categories.length;
    const { data, error: insertError } = await supabase
      .from("post_categories")
      .insert({
        slug,
        label_ko: labelKo.trim(),
        label_en: labelEn.trim() || labelKo.trim(),
        sort_order,
      })
      .select()
      .single();
    setBusy(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setCategories((prev) => [...prev, data as PostCategoryRow]);
    setLabelKo("");
    setLabelEn("");
    setSlugInput("");
    router.refresh();
  };

  const handleDelete = async (slug: string) => {
    if (!confirm(`"${slug}" 카테고리를 삭제할까요?`)) return;
    setBusy(true);
    setError("");
    const supabase = createClient();
    const { error: deleteError } = await supabase.from("post_categories").delete().eq("slug", slug);
    setBusy(false);
    if (deleteError) {
      setError(deleteError.message);
      return;
    }
    setCategories((prev) => prev.filter((c) => c.slug !== slug));
    router.refresh();
  };

  return (
    <div className="mb-10 rounded-xl border border-border bg-card p-5">
      <h2 className="font-mono text-sm font-medium">{labels.title}</h2>
      <p className="mt-1 text-sm text-muted">{labels.hint}</p>

      <ul className="mt-4 space-y-2">
        {categories.map((cat) => (
          <li
            key={cat.slug}
            className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2 text-sm"
          >
            <span>
              <span className="font-medium">{cat.label_ko}</span>
              <span className="mx-2 text-muted">·</span>
              <span className="text-muted">{cat.label_en}</span>
              <span className="ml-2 font-mono text-xs text-muted">({cat.slug})</span>
            </span>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleDelete(cat.slug)}
              className="rounded p-1.5 text-muted transition-colors hover:bg-red-500/10 hover:text-red-500"
              title={labels.delete}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        <input
          value={labelKo}
          onChange={(e) => setLabelKo(e.target.value)}
          placeholder={labels.nameKo}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <input
          value={labelEn}
          onChange={(e) => setLabelEn(e.target.value)}
          placeholder={labels.nameEn}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none"
        />
        <input
          value={slugInput}
          onChange={(e) => setSlugInput(e.target.value)}
          placeholder={labels.slug}
          className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm focus:border-accent focus:outline-none"
        />
      </div>
      <button
        type="button"
        disabled={busy || !labelKo.trim()}
        onClick={() => void handleAdd()}
        className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
      >
        <Plus className="h-4 w-4" />
        {busy ? labels.saving : labels.add}
      </button>
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </div>
  );
}
