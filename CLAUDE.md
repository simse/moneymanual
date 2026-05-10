# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Money Manual (moneymanual.org.uk / moneymanual.uk) is a free, open-source encyclopedia of money, personal finance and the British economy aimed at the general British public. There is an intense focus on keeping the site lightweight and fast.

## Commands

```bash
pnpm dev                # Astro dev server (run via tmux — see below)
pnpm build              # Static build to ./dist (consumed by the Cloudflare Worker)
pnpm preview            # Preview the built site
pnpm check              # astro check (type-check .astro files)
pnpm lint               # biome check .
pnpm format             # biome check --write . (autofix + organize imports)
pnpm deploy             # wrangler deploy (Cloudflare Workers)
```

Toolchain pins live in `.prototools` (pnpm 10.15.0, node 24.6.0). CI (`.github/workflows/pr-checks.yml`) runs `lint`, `build`, and `astro check` on PRs — all three must pass.

## Running the dev server (tmux)

The Astro dev server must run inside a tmux session named `moneymanual-dev` so there is exactly one instance and it can be controlled non-interactively. Never run `pnpm dev` in the foreground or background-shell — always go through tmux.

- Start: `tmux new-session -d -s moneymanual-dev 'cd /Users/simon/Projects/moneymanual && pnpm dev'`
- Check it's up: `tmux list-sessions | grep moneymanual-dev`
- Tail logs: `tmux capture-pane -t moneymanual-dev -p | tail -100`
- Restart / stop: `tmux kill-session -t moneymanual-dev` (then re-create if restarting)

Before starting, always run `tmux list-sessions` first to confirm one isn't already running. If you need to apply a config change, kill and recreate — don't spawn a second session.

## Testing changes

When verifying a change, use the Playwright MCP tools (`mcp__playwright__browser_*`) to drive a real browser against the running dev server (default `http://localhost:4321`). Don't rely on type-check / build success alone for UI work — navigate to the affected page, exercise the feature, and check the console. Type checks and `pnpm build` verify code correctness, not feature correctness.

## Architecture

**Static-first Astro site deployed to a Cloudflare Worker.** `astro.config.mjs` sets `output: 'static'` with the `@astrojs/cloudflare` adapter; `pnpm build` produces `./dist`, and `wrangler.toml` points the Worker's `main` at `./dist/_worker.js/index.js` with `ASSETS` bound to `./dist`. The site renders almost entirely at build time; only a few endpoints opt into SSR via `export const prerender = false`.

**Content layer.** All content is MDX under `src/content/<section>/...mdx`, registered through `src/content.config.ts` as a single `pages` collection (Astro Content Collections, glob loader). Each entry's frontmatter is validated against a Zod schema (`title`, `description`, `publishedDate`, `lastChangedDate`, `type: 'section' | 'page'`, `sortOrderHint`, optional `searchPhrases`). There is no CMS — every content change requires a redeploy.

**Routing.**
- `src/pages/[...slug].astro` is the catch-all that statically generates one page per content entry. If `data.type === 'section'` it renders `src/templates/SectionPage.astro` (a list of child pages, derived by prefix-matching slugs); otherwise it renders the article body with a `TableOfContents` sidebar.
- `src/pages/index.astro` is the homepage; `src/pages/tools/*` hosts interactive tools; `src/pages/search.astro` renders the search UI.
- `src/layouts/Layout.astro` is the single shared layout (loads sections for the navbar dropdown, includes Cloudflare Web Analytics).

**Search.** Built on [MiniSearch](https://lucaong.github.io/minisearch/), with two indexes pre-built into the static asset bundle:
- `src/pages/index/search.json.ts` and `autocomplete.json.ts` are *prerendered* endpoints — at build time they call `createIndex(...)` from `src/lib/minisearch.ts` and emit serialized MiniSearch JSON to `/index/search.json` and `/index/autocomplete.json`.
- `src/pages/api/search.ts` and `api/search-autocomplete.ts` are *SSR* endpoints. They call `getIndex(locals, ...)` which fetches the prebuilt index from the `ASSETS` binding (`locals.runtime.env.ASSETS.fetch('https://assets.local/index/...')`), `MiniSearch.loadJSON`s it, and caches the instance in module scope for the Worker isolate's lifetime. When you change the search schema, update both the prerendered index files and the runtime `fields` in `indexMap`.

**Interactivity.** Svelte 5 (runes — `$state`, `$props`, `$derived`) is used only where state/logic are required (Navbar dropdown, Search box, Take-Home Pay calculator). Everything else is plain Astro. Icons come from `unplugin-icons` via `virtual:icons/...` imports (Boxicons / Material Symbols).

**Styling.** Tailwind v4 via the `@tailwindcss/vite` plugin; global styles in `src/styles/global.css` register the `typography` and `forms` plugins and set the Archivo font. There is no `tailwind.config` — theme tokens go in `@theme` blocks in CSS.

## Conventions

- **TypeScript strict, no `any`.** `tsconfig.json` extends `astro/tsconfigs/strict`. Path alias: `@components/*` → `src/components/*`.
- **Svelte vs Astro components.** Only reach for Svelte if a component needs state or logic; otherwise write a `.astro` component. Svelte components must use runes syntax (the codebase is on Svelte 5).
- **Tailwind discipline.** Stick to the default design tokens. Avoid arbitrary values like `p-[21px]` and don't add custom CSS classes unless truly unavoidable. Compose components thoughtfully to avoid styling repetition.
- **Lightweight by default.** Keep the JS shipped to the browser small — prefer Astro components, lazy-hydrate Svelte islands (`client:load` only when interaction is needed on first paint), and avoid pulling in heavy dependencies.
- **Dependencies.** Avoid adding new ones. When you must, pin the exact version (no `^`/`~`) and use the latest. Note: `package.json` already follows this convention.
- **Documentation — look it up, don't guess.** JS framework APIs change quickly and Cloudflare's platform evolves constantly. Before assuming syntax, config, or behaviour, fetch current docs:
  - **Context7 MCP** (`mcp__context7__resolve-library-id` → `mcp__context7__query-docs`) for Astro, Svelte, Tailwind, MiniSearch, and any other library. Use it even for things you "know" — your training data may be stale.
  - **Cloudflare docs MCP** (`mcp__plugin_cloudflare_cloudflare-docs__search_cloudflare_documentation`) for anything Workers / Wrangler / `wrangler.toml` / bindings / `@astrojs/cloudflare` adapter related. Prefer it over web search and over memory.
- **Biome.** Tab indent, double quotes, recommended lint rules. `.svelte` and `.astro` files relax `useConst`, `useImportType`, and unused-var rules — don't reintroduce those rules globally.

## Source Control
This project uses Gitbutler locally instead of git directly. Use the `but` MCP tools to interact with source control when needed. Do not make commits yourself, leave that to the engineer instead.
