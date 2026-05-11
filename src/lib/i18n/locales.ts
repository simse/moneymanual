export const LOCALES = ["en-gb", "cy", "sco"] as const;
export type Locale = (typeof LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "en-gb";

export const isLocale = (value: string): value is Locale =>
	(LOCALES as readonly string[]).includes(value);

const HTML_LANG: Record<Locale, string> = {
	"en-gb": "en-GB",
	cy: "cy",
	sco: "sco",
};

const LABEL: Record<Locale, string> = {
	"en-gb": "English",
	cy: "Cymraeg",
	sco: "Scots",
};

export const htmlLangFor = (locale: Locale): string => HTML_LANG[locale];

export const labelFor = (locale: Locale): string => LABEL[locale];
