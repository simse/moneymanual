import type { APIRoute } from "astro";
import { createIndex, type DataExtractor } from "../../lib/minisearch";

export const prerender = true;

type SearchDoc = {
  id: string;
  title: string;
  description: string;
  searchPhrases: string;
};

const extractor: DataExtractor<SearchDoc> = (page) => {
  return [
    {
      id: page.id,
      title: page.data.title,
      description: page.data.description,
      searchPhrases: page.data.searchPhrases?.join(" ") ?? "",
    },
  ];
};

export const GET: APIRoute = async () => {
  const miniSearch = await createIndex(
    ["title", "description", "searchPhrases"],
    ["title", "description"],
    extractor,
  );

  return new Response(JSON.stringify(miniSearch), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
};
