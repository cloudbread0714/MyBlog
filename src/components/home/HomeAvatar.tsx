"use client";

import Image from "next/image";
import { Camera, User, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import type { Dictionary } from "@/i18n/dictionary";
import { uploadImage } from "@/lib/upload";
import { createClient } from "@/lib/supabase/client";

/** 홈 히어로: 가로 11rem 유지, 세로만 프로필 비율로 확장 */
const COMPACT_AVATAR_WIDTH = 176;
const COMPACT_AVATAR_HEIGHT = 224;

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
          ? "mx-auto shrink-0 sm:mx-0"
          : "flex shrink-0 flex-col items-center gap-3 sm:items-start"
      }
    >
      <div className={`relative ${compact ? "w-44 pb-1 pr-1" : "mx-auto w-full sm:mx-0"}`}>
        <div
          className={`overflow-hidden border-2 border-border bg-card shadow-md ring-1 ring-black/5 dark:ring-white/10 ${
            compact
              ? "h-56 w-44 rounded-2xl"
              : "aspect-square w-full max-h-44 max-w-[11rem] rounded-2xl"
          }`}
        >
          {avatarUrl ? (
            <Image
              src={avatarUrl}
              alt={labels.photoAlt}
              width={compact ? COMPACT_AVATAR_WIDTH : 176}
              height={compact ? COMPACT_AVATAR_HEIGHT : 176}
              className="h-full w-full object-cover"
              priority
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-muted">
              <User
                className={compact ? "h-10 w-10 opacity-40" : "h-12 w-12 opacity-40"}
                strokeWidth={1.25}
              />
              {!compact && (
                <span className="px-3 text-center font-mono text-xs">{labels.photoPlaceholder}</span>
              )}
            </div>
          )}
        </div>
        {isAdmin && (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className={`absolute flex items-center justify-center rounded-full border border-border bg-card text-foreground shadow-md transition-colors hover:border-accent hover:text-accent disabled:opacity-50 ${
              compact
                ? "-bottom-0.5 -right-0.5 h-8 w-8"
                : "-bottom-2 -right-2 h-9 w-9"
            }`}
            title={labels.changePhoto}
          >
            <Camera className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
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
