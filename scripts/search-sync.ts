import { validateEnvVariable } from "astro/env/runtime";
import { envSchema } from "../env.schema.mjs";
import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { readArticles } from "./article-documents.ts";
import { syncArticles } from "./typesense-sync.ts";

try {
  const args = process.argv.slice(2);

  if (args.some((arg) => arg !== "--dry-run")) {
    throw new Error("Usage: pnpm run search:sync [--dry-run]");
  }

  const envFile = fileURLToPath(new URL("../.env", import.meta.url));

  if (existsSync(envFile)) {
    loadEnvFile(envFile);
  }

  const documents = await readArticles(
    fileURLToPath(new URL("../content/articles", import.meta.url)),
  );

  console.log(
    `Validated ${documents.length} articles (${documents.reduce((total, document) => total + document.body.length, 0)} body characters)`,
  );

  if (!args.includes("--dry-run")) {
    const required = (
      name: "TYPESENSE_API_URL" | "TYPESENSE_API_KEY" | "TYPESENSE_INDEX_NAME",
    ): string => {
      const result = validateEnvVariable(process.env[name]?.trim(), {
        ...envSchema[name],
        optional: false,
      });

      if (!result.ok || typeof result.value !== "string") {
        throw new Error(`Invalid or missing environment variable: ${name}`);
      }

      return result.value;
    };

    await syncArticles(documents, {
      url: required("TYPESENSE_API_URL"),
      key: required("TYPESENSE_API_KEY"),
      name: required("TYPESENSE_INDEX_NAME"),
    });
  }
} catch (error) {
  const message = error instanceof Error ? error.message : "Unknown sync error";
  const key = process.env.TYPESENSE_API_KEY;

  console.error(
    `Article sync failed: ${key ? message.replaceAll(key, "[redacted]") : message}`,
  );

  process.exitCode = 1;
}
