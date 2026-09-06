import { SITE_URL } from "astro:env/server";
import { Readable } from "node:stream";
import type { APIRoute } from "astro";
import { SitemapStream, streamToPromise } from "sitemap";
import {
  glossaryTermSlug,
  glossaryTerms,
  pageEntries,
  urlPathForEntry,
} from "src/lib/content";

export const prerender = true;

const HOSTNAME = SITE_URL;

const STATIC_PATHS = [
  "/",
  "/tools",
  "/tools/savings-calculator",
  "/tools/student-loan-repayment",
  "/tools/take-home-pay",
  "/glossary",
];

type SitemapItem = {
  url: string;
  lastmod?: string;
  changefreq?: "weekly" | "monthly";
};

export const GET: APIRoute = async () => {
  const items: SitemapItem[] = STATIC_PATHS.map((url) => ({
    url,
    changefreq: "monthly",
  }));

  for (const entry of await pageEntries()) {
    items.push({
      url: urlPathForEntry(entry),
      lastmod: entry.data.lastChangedDate.toISOString(),
      changefreq: "weekly",
    });
  }

  for (const entry of await glossaryTerms()) {
    items.push({
      url: `/glossary/${glossaryTermSlug(entry)}`,
      lastmod: entry.data.lastChangedDate.toISOString(),
      changefreq: "monthly",
    });
  }

  const stream = new SitemapStream({
    hostname: HOSTNAME,
    xmlns: { xhtml: false, news: false, image: false, video: false },
  });

  const xml = await streamToPromise(Readable.from(items).pipe(stream));

  return new Response(xml.toString(), {
    status: 200,
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
};
