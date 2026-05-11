import type { Locale } from "./locales";

type Strings = {
	siteName: string;
	titleSuffix: string;
	siteTagline: string;
	siteDescription: string;
	home: string;
	topics: string;
	tools: string;
	seeAll: string;
	search: string;
	searchPageHeading: string;
	searchPlaceholder: string;
	findATopic: string;
	heroHeading: string;
	heroSubheading: string;
	homepageDescription: string;
	toolsHeading: string;
	toolsSubheading: string;
	sitemap: string;
	searchTheSite: string;
	footerTagline: string;
	notFinancialAdvice: string;
	copyright: (year: number) => string;
	resultsFound: (count: number, query: string) => string;
	resultsNone: (query: string) => string;
	notFoundTitle: string;
	notFoundHeading: string;
	notFoundBody: string;
	notFoundHomeLink: string;
	languageSwitcherLabel: string;
};

const enGb: Strings = {
	siteName: "MoneyManual.org.uk",
	titleSuffix: " - MoneyManual.org.uk",
	siteTagline: "Welcome to MoneyManual.org.uk",
	siteDescription:
		"Money Manual is an encyclopedia for everything relating to money, finance and the economy.",
	home: "Home",
	topics: "Topics",
	tools: "Tools",
	seeAll: "See all →",
	search: "Search",
	searchPageHeading: "Search on MoneyManual.org.uk",
	searchPlaceholder: "Search MoneyManual",
	findATopic: "Find a topic",
	heroHeading: "Information about money, finance and the UK economy",
	heroSubheading:
		"Free guides to help you save money, manage debt and understand your finances.",
	homepageDescription:
		"Money Manual is an encyclopedia for everything relating to money, finance and the economy.",
	toolsHeading: "Tools and Calculators",
	toolsSubheading:
		"A collection of useful finance tools and money calculators.",
	sitemap: "Sitemap",
	searchTheSite: "Search the site",
	footerTagline:
		"Free, plain-English guides to money, finance and the UK economy.",
	notFinancialAdvice: "Information only — not financial advice.",
	copyright: (year) => `© ${year} MoneyManual.org.uk`,
	resultsFound: (count, query) => `Found ${count} results for "${query}"`,
	resultsNone: (query) => `No results found for "${query}".`,
	notFoundTitle: "404",
	notFoundHeading: "Page not found",
	notFoundBody: "We couldn't find the page you were looking for.",
	notFoundHomeLink: "Back to home",
	languageSwitcherLabel: "Language",
};

const cy: Strings = {
	siteName: "MoneyManual.org.uk",
	titleSuffix: " - MoneyManual.org.uk",
	siteTagline: "Croeso i MoneyManual.org.uk",
	siteDescription:
		"Mae Money Manual yn wyddoniadur ar gyfer popeth sy'n ymwneud ag arian, cyllid a'r economi.",
	home: "Hafan",
	topics: "Pynciau",
	tools: "Offer",
	seeAll: "Gweld y cyfan →",
	search: "Chwilio",
	searchPageHeading: "Chwilio ar MoneyManual.org.uk",
	searchPlaceholder: "Chwilio MoneyManual",
	findATopic: "Dewch o hyd i bwnc",
	heroHeading: "Gwybodaeth am arian, cyllid ac economi'r DU",
	heroSubheading:
		"Canllawiau am ddim i'ch helpu i arbed arian, rheoli dyledion a deall eich cyllid.",
	homepageDescription:
		"Mae Money Manual yn wyddoniadur ar gyfer popeth sy'n ymwneud ag arian, cyllid a'r economi.",
	toolsHeading: "Offer a Chyfrifianellau",
	toolsSubheading:
		"Casgliad o offer cyllid a chyfrifianellau arian defnyddiol.",
	sitemap: "Map o'r safle",
	searchTheSite: "Chwilio'r safle",
	footerTagline:
		"Canllawiau am ddim, mewn iaith glir, i arian, cyllid ac economi'r DU.",
	notFinancialAdvice: "Gwybodaeth yn unig — nid cyngor ariannol.",
	copyright: (year) => `© ${year} MoneyManual.org.uk`,
	resultsFound: (count, query) =>
		`Wedi dod o hyd i ${count} canlyniad ar gyfer "${query}"`,
	resultsNone: (query) => `Dim canlyniadau ar gyfer "${query}".`,
	notFoundTitle: "404",
	notFoundHeading: "Heb ddod o hyd i'r dudalen",
	notFoundBody: "Ni allwn ddod o hyd i'r dudalen yr oeddech yn chwilio amdani.",
	notFoundHomeLink: "Yn ôl i'r hafan",
	languageSwitcherLabel: "Iaith",
};

const DICT: Record<Locale, Strings> = {
	"en-gb": enGb,
	cy,
};

export const t = <K extends keyof Strings>(
	locale: Locale,
	key: K,
): Strings[K] => DICT[locale][key];
