export const LOCALES = ["en-gb", "cy"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en-gb";

export const isLocale = (value: string): value is Locale =>
	(LOCALES as readonly string[]).includes(value);

export const htmlLangFor = (locale: Locale): string =>
	locale === "en-gb" ? "en-GB" : "cy";

export const labelFor = (locale: Locale): string =>
	locale === "en-gb" ? "English" : "Cymraeg";
