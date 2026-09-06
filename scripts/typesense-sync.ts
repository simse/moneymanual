import type { ArticleDocument } from "./article-documents.ts";

const fields = [
  { name: "title", type: "string" },
  { name: "description", type: "string" },
  { name: "body", type: "string" },
  { name: "searchPhrases", type: "string[]" },
  { name: "url", type: "string", index: false },
];

const jsonLines = (text: string): Record<string, unknown>[] => {
  if (!text.trim()) {
    return [];
  }

  return text
    .trim()
    .split("\n")
    .map((line) => {
      const value = JSON.parse(line);

      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new Error("Invalid JSONL response");
      }

      return value;
    });
};

export const syncArticles = async (
  documents: ArticleDocument[],
  config: { url: string; key: string; name: string },
): Promise<void> => {
  const base = new URL(config.url);

  if (
    !["http:", "https:"].includes(base.protocol) ||
    base.username ||
    base.password ||
    base.search ||
    base.hash
  ) {
    throw new Error(
      "TYPESENSE_API_URL must be an HTTP(S) base URL without credentials, query, or fragment",
    );
  }

  base.pathname = `${base.pathname.replace(/\/$/, "")}/`;
  const collection = `collections/${encodeURIComponent(config.name)}`;

  const request = async (
    path: string,
    method = "GET",
    body?: string,
    allowMissing = false,
  ) => {
    const requestInit: RequestInit = {
      method,
      redirect: "error",
      headers: {
        "X-TYPESENSE-API-KEY": config.key,
        "Content-Type": path.includes("/import?")
          ? "text/plain"
          : "application/json",
      },
      signal: AbortSignal.timeout(60_000),
    };

    if (body !== undefined) {
      requestInit.body = body;
    }

    const response = await fetch(new URL(path, base), requestInit);

    const text = await response.text();

    if (allowMissing && response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(
        `Typesense ${method} request failed (HTTP ${response.status})`,
      );
    }

    return text;
  };

  const existing = await request(collection, "GET", undefined, true);

  if (existing === null) {
    await request(
      "collections",
      "POST",
      JSON.stringify({ name: config.name, fields }),
    );

    console.log("Created article collection");
  } else {
    const schema = JSON.parse(existing);

    if (!Array.isArray(schema.fields)) {
      throw new Error("Invalid collection schema response");
    }

    const legacyLocale = schema.fields.find(
      (field: { name: string }) => field.name === "locale",
    );

    if (legacyLocale?.type !== undefined && legacyLocale.type !== "string") {
      throw new Error(
        "Incompatible collection field: locale; collection was not changed",
      );
    }

    const currentFields = schema.fields.filter(
      (field: { name: string }) => field.name !== "locale",
    );

    for (const expected of fields) {
      const actual = currentFields.find(
        (field: { name: string }) => field.name === expected.name,
      );

      if (
        !actual ||
        actual.type !== expected.type ||
        (actual.index ?? true) !== (expected.index ?? true)
      ) {
        throw new Error(
          `Incompatible collection field: ${expected.name}; collection was not changed`,
        );
      }
    }

    const names = new Set(["id", ...fields.map((field) => field.name)]);

    if (
      currentFields.some(
        (field: { name: string; optional?: boolean }) =>
          !names.has(field.name) && !field.optional,
      )
    ) {
      throw new Error(
        "Collection has additional required fields; collection was not changed",
      );
    }

    if (legacyLocale) {
      await request(
        collection,
        "PATCH",
        JSON.stringify({ fields: [{ name: "locale", drop: true }] }),
      );

      console.log("Removed legacy locale field from article collection");
    }
  }

  for (let offset = 0; offset < documents.length; offset += 100) {
    const batch = documents.slice(offset, offset + 100);

    const response = await request(
      `${collection}/documents/import?action=upsert`,
      "POST",
      batch.map((document) => JSON.stringify(document)).join("\n"),
    );

    const results = jsonLines(response ?? "");

    if (results.length !== batch.length) {
      throw new Error("Import response count mismatch; stale deletion skipped");
    }

    const failed = results.flatMap((result, index) =>
      result.success === true ? [] : [batch[index].id],
    );

    if (failed.length) {
      throw new Error(
        `Import failed for ${failed.join(", ")}; stale deletion skipped`,
      );
    }
  }

  console.log(`Upserted ${documents.length} articles`);

  const exported = jsonLines(
    (await request(`${collection}/documents/export?include_fields=id`)) ?? "",
  );

  const remoteIds = new Set<string>();

  for (const document of exported) {
    if (
      typeof document.id !== "string" ||
      !document.id ||
      remoteIds.has(document.id)
    ) {
      throw new Error("Invalid exported document ID; stale deletion skipped");
    }

    remoteIds.add(document.id);
  }

  const localIds = new Set(documents.map((document) => document.id));

  if (documents.some((document) => !remoteIds.has(document.id))) {
    throw new Error(
      "Export is missing imported documents; stale deletion skipped",
    );
  }

  let deleted = 0;

  for (const id of remoteIds) {
    if (localIds.has(id)) {
      continue;
    }

    await request(
      `${collection}/documents/${encodeURIComponent(id)}`,
      "DELETE",
      undefined,
      true,
    );

    deleted++;
  }

  console.log(`Deleted ${deleted} stale articles`);
};
