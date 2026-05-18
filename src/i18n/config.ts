export const LOCALES = ["ko", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "ko";
export const LOCALE_COOKIE = "locale";

export function isLocale(value: string | undefined): value is Locale {
  return value === "ko" || value === "en";
}
