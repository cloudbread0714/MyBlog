"use client";

import Image from "next/image";
import { Camera, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { uploadImage } from "@/lib/upload";
import { createClient } from "@/lib/supabase/client";

export function HomeAvatar({
  avatarUrl,
  isAdmin,
  labels,
  compact = false,
}: {
  avatarUrl: string | null;
  isAdmin: boolean;
  labels: Dictionary["home"];
  compact?: boolean;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const saveAvatar = async (url: string | null) => {
    const supabase = createClient();
    const { error: saveError } = await supabase
      .from("about_profile")
      .upsert({ id: 1, avatar_url: url });
    if (saveError) throw saveError;
    router.refresh();
  };

  const handleFile = async (file: File | undefined) => {
    if (!file?.type.startsWith("image/")) return;
    setUploading(true);
    setError("");
    try {
      const url = await uploadImage(file, { type: "profile" });
      await saveAvatar(url);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    setUploading(true);
    setError("");
    try {
      await saveAvatar(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Remove failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      className={
        compact
          ? "mx-auto w-full max-w-[11rem] shrink-0 sm:mx-0"
          : "flex shrink-0 flex-col items-center gap-3 sm:items-start"
      }
    >
      <div className={`relative mx-auto w-full sm:mx-0 ${compact ? "pb-3 pr-3" : ""}`}>
        <div
          className={`aspect-square w-full overflow-hidden rounded-2xl border-2 border-border bg-card shadow-md ring-1 ring-black/5 dark:ring-white/10 ${
            compact ? "" : "max-h-44 max-w-[11rem]"
          }`}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={labels.photoAlt}
              width={176}
              height={176}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-muted">
              <User className="h-12 w-12 opacity-40" strokeWidth={1.25} />
              <span className="px-3 text-center font-mono text-xs">{labels.photoPlaceholder}</span>
            </div>
          )}
        </div>
        {isAdmin && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="absolute -bottom-2 -right-2 flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:border-accent hover:text-accent disabled:opacity-50"
            title={labels.changePhoto}
          >
            <Camera className="h-4 w-4" />
          </button>
        )}
      </div>

      {isAdmin && !compact && (
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="font-mono text-xs text-muted transition-colors hover:text-accent"
          >
            {uploading ? labels.uploadingPhoto : labels.changePhoto}
          </button>
          {avatarUrl && (
            <button
              type="button"
              disabled={uploading}
              onClick={() => void handleRemove()}
              className="inline-flex items-center gap-1 font-mono text-xs text-muted transition-colors hover:text-red-500"
            >
              <X className="h-3 w-3" />
              {labels.removePhoto}
            </button>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />

      {error && !compact && (
        <p className="max-w-[11rem] text-center text-xs text-red-500">{error}</p>
      )}
    </div>
  );
}
