import { DEFAULT_LOCALE, type Locale } from "./locales";

const PATHS_WITHOUT_WELSH_VERSION = ["/tools"];

export const localePath = (locale: Locale, rest = ""): string => {
	const trimmed = rest.replace(/^\/+/, "").replace(/\/+$/, "");
	const suffix = trimmed ? `/${trimmed}` : "";
	if (locale === DEFAULT_LOCALE) {
		return suffix || "/";
	}
	return `/${locale}${suffix || "/"}`;
};

export const localeFromPathname = (pathname: string): Locale => {
	if (pathname === "/cy" || pathname.startsWith("/cy/")) return "cy";
	return DEFAULT_LOCALE;
};

const stripLocalePrefix = (pathname: string): string => {
	if (pathname === "/cy") return "/";
	if (pathname.startsWith("/cy/")) return pathname.slice(3) || "/";
	return pathname;
};

const hasLocalisedRoute = (basePath: string, target: Locale): boolean => {
	if (target === DEFAULT_LOCALE) return true;
	return !PATHS_WITHOUT_WELSH_VERSION.some(
		(prefix) => basePath === prefix || basePath.startsWith(`${prefix}/`),
	);
};

export const alternateUrlFor = (
	currentPathname: string,
	target: Locale,
): string => {
	const base = stripLocalePrefix(currentPathname);
	if (!hasLocalisedRoute(base, target)) {
		return localePath(target);
	}
	const cleaned = base.replace(/^\/+/, "");
	return localePath(target, cleaned);
};
