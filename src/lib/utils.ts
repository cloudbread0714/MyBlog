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
