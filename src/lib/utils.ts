export function formatDate(date: string, locale: "ko" | "en" = "ko") {
  return new Date(date).toLocaleDateString(locale === "en" ? "en-US" : "ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function readingTime(html: string): number {
  const text = html.replace(/<[^>]*>/g, "");
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

export function cn(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes == null || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let i = 0;
  while (size >= 1024 && i < units.length - 1) {
    size /= 1024;
    i += 1;
  }
  return `${size < 10 && i > 0 ? size.toFixed(1) : Math.round(size)} ${units[i]}`;
}
