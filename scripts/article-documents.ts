import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import remarkGfm from "remark-gfm";
import remarkMdx from "remark-mdx";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { parse } from "yaml";

export type ArticleDocument = {
  id: string;
  title: string;
  description: string;
  body: string;
  searchPhrases: string[];
  url: string;
};

type TextNode = {
  type: string;
  value?: string;
  alt?: string | null;
  children?: TextNode[];
};

const plainText = (node: TextNode): string => {
  if (node.type === "mdxjsEsm" || node.type.endsWith("Expression")) {
    return "";
  }

  if (node.type === "html" || node.type === "definition") {
    return "";
  }

  if (node.type === "image") {
    return node.alt ?? "";
  }

  if (node.value !== undefined) {
    return node.value;
  }

  const separator = [
    "paragraph",
    "heading",
    "link",
    "emphasis",
    "strong",
    "delete",
    "mdxJsxTextElement",
  ].includes(node.type)
    ? ""
    : "\n";

  return node.children?.map(plainText).join(separator) ?? "";
};

const files = async function* (
  directory: string,
  prefix = "",
): AsyncGenerator<string> {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;

    if (entry.isDirectory()) {
      yield* files(join(directory, entry.name), `${relative}/`);
    } else if (entry.isFile() && /\.(md|mdx)$/.test(entry.name)) {
      yield relative;
    }
  }
};

export const readArticles = async (
  directory: string,
): Promise<ArticleDocument[]> => {
  const documents: ArticleDocument[] = [];
  const ids = new Set<string>();

  for await (const file of files(directory)) {
    try {
      const source = await readFile(join(directory, file), "utf8");
      const match = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/.exec(source);

      if (!match) {
        throw new Error("Missing YAML frontmatter");
      }

      const data = parse(match[1]);

      if (!data || typeof data !== "object") {
        throw new Error("Invalid frontmatter");
      }

      for (const field of ["title", "description"]) {
        if (typeof data[field] !== "string") {
          throw new Error(`Invalid ${field}`);
        }
      }

      for (const field of ["publishedDate", "lastChangedDate"]) {
        if (
          typeof data[field] !== "string" ||
          !Number.isFinite(Date.parse(data[field]))
        ) {
          throw new Error(`Invalid ${field}`);
        }
      }

      if (data.type !== undefined && !["page", "section"].includes(data.type)) {
        throw new Error("Invalid type");
      }

      if (
        data.sortOrderHint !== undefined &&
        (typeof data.sortOrderHint !== "number" ||
          !Number.isFinite(data.sortOrderHint))
      ) {
        throw new Error("Invalid sortOrderHint");
      }

      const searchPhrases = data.searchPhrases ?? [];

      if (
        !Array.isArray(searchPhrases) ||
        !searchPhrases.every((phrase) => typeof phrase === "string")
      ) {
        throw new Error("Invalid searchPhrases");
      }

      const id = file.replace(/\.(md|mdx)$/, "").replace(/\/index$/, "");

      if (data.slug !== undefined || !/^[a-z0-9/-]+$/.test(id)) {
        throw new Error(
          "Unsupported article slug; must match the lowercase file path",
        );
      }

      if (ids.has(id)) {
        throw new Error(`Duplicate ID: ${id}`);
      }

      ids.add(id);
      const parser = unified().use(remarkParse).use(remarkGfm);

      if (file.endsWith(".mdx")) {
        parser.use(remarkMdx);
      }

      const body = plainText(parser.parse(source.slice(match[0].length)))
        .replace(/\s+/g, " ")
        .trim();

      documents.push({
        id,
        title: data.title,
        description: data.description,
        body,
        searchPhrases,
        url: `/${id}`,
      });
    } catch (error) {
      throw new Error(
        `${file}: ${error instanceof Error ? error.message : "Invalid article"}`,
      );
    }
  }

  if (!documents.length) {
    throw new Error("No articles found; refusing to sync an empty source set");
  }

  return documents.sort((a, b) => a.id.localeCompare(b.id));
};
