# moneymanual.org.uk

## Sync articles to Typesense

Use Node 24 and install dependencies with `pnpm install --frozen-lockfile`.
Set these variables in the root `.env` file locally, or inject them into the CI
environment. Existing environment variables take precedence over `.env`.

```dotenv
TYPESENSE_API_URL=https://your-typesense-host:443
TYPESENSE_API_KEY=your-write-key
TYPESENSE_INDEX_NAME=articles
```

Run `pnpm run search:sync`. To validate local content without credentials or
remote requests, run `pnpm run search:sync --dry-run`.

The command creates the collection when missing and bulk upserts all English
articles, including section pages. Documents contain `id`, `title`,
`description`, readable `body` text, `searchPhrases`, `url`, and `locale`.
MDX is parsed without execution. Text inside components is retained, but imports,
attributes, and JavaScript expressions are omitted. Glossary entries and other
languages are excluded.

The configured collection must be dedicated to these English articles. After
every import succeeds, the command deletes remote IDs absent from the content
folder. Invalid content, an empty source set, or import/export errors prevent
deletion. Existing incompatible schemas cause an error; the command does not
recreate collections or migrate schemas.

The key needs `collections:get`, `collections:create`, `documents:import`,
`documents:export`, and `documents:delete` permissions for the configured
collection. Keep the key in local environment files or CI secrets, never in
browser code.

CI can run the same command after dependency installation, with the three
variables injected. No workflow is added here. Serialize all runs against a
collection, including local runs; do not run this from competing CI jobs.
Use separate collection names for staging and production.

Failures exit nonzero. Successful earlier batches or deletions can remain after
a failure; fix the reported problem and rerun to complete the sync. The command
reports validated, upserted, and deleted counts.


## Runtime search

English search and autocomplete use Typesense. Set `TYPESENSE_API_URL`,
`TYPESENSE_API_KEY`, and `TYPESENSE_INDEX_NAME` in the Worker's runtime environment
for staging and production. Locally, the Cloudflare adapter loads these from
`.env`. Use a separate search-only key with `documents:search` permission for the
configured collection at runtime; the sync key needs the write permissions above.
Keep keys in Worker secrets, not public frontend variables.

The server falls back to MiniSearch if configuration is missing or Typesense
fails, returns invalid or incomplete data, or exceeds two seconds across all
pages. Valid empty results do not trigger fallback. Welsh and Scots use
MiniSearch directly. If both providers fail, API routes return a generic 503.

Both endpoints return `{ results, provider, queryTimeMs? }`. The provider is
`typesense` or `minisearch`. Typesense query time is in milliseconds, summed across
result pages; it is omitted if any page has no valid timing. MiniSearch omits
query time. The results page shows timing when present, including zero.

Within `results`, search items contain `title`,
`description`, and `url`; autocomplete items contain `phrase` and `matchedTerms`.
Autocomplete returns up to six unique search phrases. Credentials are never sent to the frontend.
