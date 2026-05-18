import type { Locale } from "@/i18n/config";
import en from "@/i18n/messages/en.json";
import ko from "@/i18n/messages/ko.json";

export type Dictionary = typeof ko;

const dictionaries: Record<Locale, Dictionary> = { ko, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? dictionaries.ko;
}
