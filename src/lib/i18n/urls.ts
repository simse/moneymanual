import { DEFAULT_LOCALE, LOCALES, type Locale } from "./locales";

const NON_DEFAULT_LOCALES = LOCALES.filter(
	(locale) => locale !== DEFAULT_LOCALE,
);

export const localePath = (locale: Locale, rest = ""): string => {
	const trimmed = rest.replace(/^\/+/, "").replace(/\/+$/, "");
	const suffix = trimmed ? `/${trimmed}` : "";
	if (locale === DEFAULT_LOCALE) {
		return suffix || "/";
	}
	return `/${locale}${suffix || "/"}`;
};

export const localeFromPathname = (pathname: string): Locale => {
	for (const locale of NON_DEFAULT_LOCALES) {
		if (pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)) {
			return locale;
		}
	}
	return DEFAULT_LOCALE;
};

const stripLocalePrefix = (pathname: string): string => {
	for (const locale of NON_DEFAULT_LOCALES) {
		if (pathname === `/${locale}`) return "/";
		if (pathname.startsWith(`/${locale}/`)) {
			return pathname.slice(locale.length + 1) || "/";
		}
	}
	return pathname;
};

export const alternateUrlFor = (
	currentPathname: string,
	target: Locale,
): string => {
	const base = stripLocalePrefix(currentPathname);
	const cleaned = base.replace(/^\/+/, "");
	return localePath(target, cleaned);
};
