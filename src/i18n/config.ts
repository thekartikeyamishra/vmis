export const locales = ["en", "hi"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export type Localized<T = string> = { en: T; hi: T };

export function isLocale(value: string | undefined | null): value is Locale {
  return !!value && (locales as readonly string[]).includes(value);
}

export function L(en: string, hi: string): Localized {
  return { en, hi };
}

export function t<T>(value: Localized<T>, locale: Locale): T {
  return value[locale];
}

export function otherLocale(locale: Locale): Locale {
  return locale === "en" ? "hi" : "en";
}

/** Swap the locale prefix of a pathname, preserving the rest of the path. */
export function switchLocalePath(pathname: string, target: Locale): string {
  const parts = pathname.split("/");
  if (isLocale(parts[1])) parts[1] = target;
  else parts.splice(1, 0, target);
  const out = parts.join("/");
  return out === `/${target}/` ? `/${target}` : out;
}
