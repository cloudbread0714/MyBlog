"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocale } from "@/app/actions/locale";
import type { Locale } from "@/i18n/config";
import { cn } from "@/lib/utils";

export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const switchLocale = (next: Locale) => {
    if (next === locale) return;
    startTransition(async () => {
      await setLocale(next);
      router.refresh();
    });
  };

  return (
    <div
      className={cn(
        "ml-1 flex rounded-md border border-border p-0.5 font-mono text-xs",
        pending && "opacity-60",
      )}
      role="group"
      aria-label="Language"
    >
      {(["ko", "en"] as const).map((code) => (
        <button
          key={code}
          type="button"
          disabled={pending}
          onClick={() => switchLocale(code)}
          className={cn(
            "rounded px-2.5 py-1.5 text-sm uppercase tracking-wide transition-colors",
            locale === code
              ? "bg-foreground text-background"
              : "text-muted hover:text-foreground",
          )}
        >
          {code}
        </button>
      ))}
    </div>
  );
}
