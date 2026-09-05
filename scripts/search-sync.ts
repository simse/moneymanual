import { existsSync } from "node:fs";
import { loadEnvFile } from "node:process";
import { fileURLToPath } from "node:url";
import { readArticles } from "./article-documents.ts";
import { syncArticles } from "./typesense-sync.ts";

try {
	const args = process.argv.slice(2);
	if (args.some((arg) => arg !== "--dry-run"))
		throw new Error("Usage: pnpm run search:sync [--dry-run]");
	const envFile = fileURLToPath(new URL("../.env", import.meta.url));
	if (existsSync(envFile)) loadEnvFile(envFile);
	const documents = await readArticles(
		fileURLToPath(new URL("../content/articles", import.meta.url)),
	);
	console.log(
		`Validated ${documents.length} English articles (${documents.reduce((total, document) => total + document.body.length, 0)} body characters)`,
	);
	if (!args.includes("--dry-run")) {
		const required = (name: string): string => {
			const value = process.env[name]?.trim();
			if (!value) throw new Error(`Missing environment variable: ${name}`);
			return value;
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
