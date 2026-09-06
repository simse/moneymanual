Articles are written in MDX and stored in `articles`.

The writing style guide is stored in `writing-style-guide.md`.

Short term definitions live in the `glossary` content collection under `glossary/<slug>.mdx` and render at `/glossary` (overview) and `/glossary/<slug>` (per-term, two-pane reader). Frontmatter:

- `term` (required) — the heading, e.g. "ISA".
- `name` (optional) — long form, e.g. "Individual Savings Account".
- `short` (optional) — alternate abbreviation, e.g. "CGT".
- `topic` (required) — one of the IDs in `src/lib/glossary-topics.ts` (`investing`, `savings`, `tax`, `borrowing`, `economy`).
- `prominentLinks` (optional) — array of `{title, description, href, icon?}`. `icon` is a key from `src/lib/glossary-icons.ts`.
- `lastChangedDate` (required).

The MDX body is the definition. You can import `Callout` from `@components/common/Callout.astro` for worked-example boxes. Related terms ("See also") are auto-derived from shared `topic` — no frontmatter field needed.

When updating an article, update the `lastChangedDate` field to the current date.

`sortOrderHint` is used for sorting articles correctly on section pages.

All articles should have `searchPhrases` which are used as auto suggest for the search. If an article is missing them, add them in when updating. The phrases should be all lowercase without punctuation.
