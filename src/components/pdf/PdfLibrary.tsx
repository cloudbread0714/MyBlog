"use client";

import { ExternalLink, FileText, Trash2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { DOCUMENT_ACCEPT, deleteDocument, uploadDocument } from "@/lib/upload-document";
import { cn, formatDate, formatFileSize } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import type { PdfFile } from "@/types/database";

type PdfLabels = Dictionary["pdf"];

export function PdfLibrary({
  files: initialFiles,
  isAdmin,
  locale,
  labels,
}: {
  files: PdfFile[];
  isAdmin: boolean;
  locale: "ko" | "en";
  labels: PdfLabels;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState(initialFiles);
  const [title, setTitle] = useState("");
  const [note, setNote] = useState("");
  const [pending, setPending] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const addPending = (list: FileList | File[] | null) => {
    if (!list?.length) return;
    const allowed = Array.from(list);
    setPending((prev) => {
      const names = new Set(prev.map((f) => f.name + f.size));
      return [...prev, ...allowed.filter((f) => !names.has(f.name + f.size))];
    });
    setError("");
  };

  const uploadAll = async () => {
    if (!pending.length) return;
    setUploading(true);
    setError("");
    const supabase = createClient();

    try {
      for (let i = 0; i < pending.length; i++) {
        const file = pending[i]!;
        const { url, path } = await uploadDocument(file);
        const displayTitle =
          pending.length === 1 && title.trim()
            ? title.trim()
            : title.trim() && i === 0
              ? title.trim()
              : file.name.replace(/\.[^.]+$/, "");

        const { data, error: insertError } = await supabase
          .from("pdf_files")
          .insert({
            title: displayTitle,
            file_name: file.name,
            file_url: url,
            file_path: path,
            file_size: file.size,
            mime_type: file.type || null,
            note: i === 0 && note.trim() ? note.trim() : null,
          })
          .select()
          .single();

        if (insertError) throw insertError;
        if (data) setFiles((prev) => [data as PdfFile, ...prev]);
      }
      setPending([]);
      setTitle("");
      setNote("");
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : labels.uploadError);
    } finally {
      setUploading(false);
    }
  };

  const downloadFile = async (file: PdfFile) => {
    setDownloadingId(file.id);
    setError("");
    try {
      const res = await fetch(`/api/pdf/download?id=${file.id}`);
      if (!res.ok) throw new Error(labels.downloadError);

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.file_name;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError(labels.downloadError);
    } finally {
      setDownloadingId(null);
    }
  };

  const removeFile = async (file: PdfFile) => {
    if (!confirm(labels.confirmDelete)) return;
    setDeletingId(file.id);
    setError("");
    try {
      await deleteDocument(file.file_path);
      const supabase = createClient();
      const { error: dbError } = await supabase.from("pdf_files").delete().eq("id", file.id);
      if (dbError) throw dbError;
      setFiles((prev) => prev.filter((f) => f.id !== file.id));
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : labels.deleteError);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-10">
      {isAdmin ? (
        <section className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <h2 className="font-mono text-xs uppercase tracking-wide text-muted">{labels.uploadTitle}</h2>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1 block font-mono text-xs text-muted">{labels.displayName}</span>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={labels.displayNamePlaceholder}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="block">
              <span className="mb-1 block font-mono text-xs text-muted">{labels.note}</span>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder={labels.notePlaceholder}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
              />
            </label>
          </div>

          <div
            className={cn(
              "mt-4 flex min-h-[7rem] flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
              dragOver ? "border-accent bg-accent-soft/50" : "border-border",
            )}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              addPending(e.dataTransfer.files);
            }}
          >
            <Upload className="mb-2 h-8 w-8 text-muted opacity-60" strokeWidth={1.25} />
            <p className="text-sm text-muted">{labels.dropHint}</p>
            <p className="mt-1 font-mono text-xs text-muted/80">{labels.formats}</p>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="btn-secondary mt-4"
              disabled={uploading}
            >
              {labels.chooseFiles}
            </button>
            <input
              ref={inputRef}
              type="file"
              multiple
              accept={DOCUMENT_ACCEPT}
              className="hidden"
              onChange={(e) => {
                addPending(e.target.files);
                e.target.value = "";
              }}
            />
          </div>

          {pending.length > 0 && (
            <ul className="mt-4 space-y-2">
              {pending.map((f) => (
                <li
                  key={`${f.name}-${f.size}`}
                  className="flex items-center justify-between gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm"
                >
                  <span className="truncate">{f.name}</span>
                  <span className="shrink-0 font-mono text-xs text-muted">{formatFileSize(f.size)}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void uploadAll()}
              disabled={uploading || pending.length === 0}
              className="btn-primary disabled:opacity-50"
            >
              {uploading ? labels.uploading : labels.upload}
            </button>
            {pending.length > 0 && (
              <button
                type="button"
                onClick={() => setPending([])}
                className="font-mono text-xs text-muted hover:text-foreground"
                disabled={uploading}
              >
                {locale === "ko" ? "선택 취소" : "Clear selection"}
              </button>
            )}
          </div>
        </section>
      ) : null}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <section>
        {files.length === 0 ? (
          <p className="font-mono text-sm text-muted">{labels.empty}</p>
        ) : (
          <ul className="flex flex-col gap-3">
            {files.map((file) => (
              <li
                key={file.id}
                className="flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-accent">
                    <FileText className="h-5 w-5" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium text-foreground">{file.title}</p>
                    <p className="truncate font-mono text-xs text-muted">{file.file_name}</p>
                    {file.note && <p className="mt-1 text-sm text-muted">{file.note}</p>}
                    <p className="mt-1 font-mono text-xs text-muted">
                      {formatDate(file.created_at, locale)} · {formatFileSize(file.file_size)}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
                  {isAdmin && (
                    <a
                      href={file.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-secondary !py-2 !text-sm"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      {labels.open}
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => void downloadFile(file)}
                    disabled={downloadingId === file.id}
                    className="btn-primary !py-2 !text-sm disabled:opacity-50"
                  >
                    {downloadingId === file.id ? labels.downloading : labels.download}
                  </button>
                  {isAdmin && (
                    <button
                      type="button"
                      onClick={() => void removeFile(file)}
                      disabled={deletingId === file.id}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 font-mono text-sm text-muted transition-colors hover:border-red-500/50 hover:text-red-500 disabled:opacity-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      {deletingId === file.id ? labels.deleting : labels.delete}
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
