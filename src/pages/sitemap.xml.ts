import { Readable } from "node:stream";
import type { APIRoute } from "astro";
import { SitemapStream, streamToPromise } from "sitemap";
import {
	entriesForLocale,
	glossaryTermSlug,
	glossaryTermsForLocale,
	parseEntryId,
	urlPathForEntry,
} from "src/lib/content";
import { DEFAULT_LOCALE, htmlLangFor, LOCALES } from "src/lib/i18n/locales";
import { localePath } from "src/lib/i18n/urls";

export const prerender = true;

const HOSTNAME = import.meta.env.SITE_URL ?? "https://moneymanual.org.uk";

const STATIC_PATHS = [
	"",
	"tools",
	"tools/savings-calculator",
	"tools/student-loan-repayment",
	"tools/take-home-pay",
	"glossary",
];

type SitemapItem = {
	url: string;
	lastmod?: string;
	changefreq?: "daily" | "weekly" | "monthly";
	links: { lang: string; url: string }[];
};

const alternateLinksFor = (logicalPath: string) => {
	const links = LOCALES.map((locale) => ({
		lang: htmlLangFor(locale),
		url: `${HOSTNAME}${localePath(locale, logicalPath)}`,
	}));
	links.push({
		lang: "x-default",
		url: `${HOSTNAME}${localePath(DEFAULT_LOCALE, logicalPath)}`,
	});
	return links;
};

export const GET: APIRoute = async () => {
	const entries = await entriesForLocale(DEFAULT_LOCALE);

	const items: SitemapItem[] = [];

	for (const path of STATIC_PATHS) {
		items.push({
			url: localePath(DEFAULT_LOCALE, path),
			changefreq: "monthly",
			links: alternateLinksFor(path),
		});
	}

	for (const entry of entries) {
		const parsed = parseEntryId(entry.id);
		if (!parsed) continue;
		const logical = parsed.isSection
			? parsed.topic
			: `${parsed.topic}/${parsed.rest}`;
		items.push({
			url: urlPathForEntry(entry),
			lastmod: entry.data.lastChangedDate.toISOString(),
			changefreq: "weekly",
			links: alternateLinksFor(logical),
		});
	}

	const glossaryTerms = await glossaryTermsForLocale(DEFAULT_LOCALE);
	for (const entry of glossaryTerms) {
		const slug = glossaryTermSlug(entry);
		const logical = `glossary/${slug}`;
		items.push({
			url: localePath(DEFAULT_LOCALE, logical),
			lastmod: entry.data.lastChangedDate.toISOString(),
			changefreq: "monthly",
			links: alternateLinksFor(logical),
		});
	}

	const stream = new SitemapStream({
		hostname: HOSTNAME,
		xmlns: { xhtml: true, news: false, image: false, video: false },
	});

	const xml = await streamToPromise(Readable.from(items).pipe(stream));

	return new Response(xml.toString(), {
		status: 200,
		headers: {
			"Content-Type": "application/xml; charset=utf-8",
		},
	});
};
