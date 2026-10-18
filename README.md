# moneymanual.org.uk

## Runtime search

Search and autocomplete run in the Worker with MiniSearch. The indexes are
prerendered at build time as `/index/search.json` and `/index/autocomplete.json`.
If search fails, the API routes return a generic 503.

Both endpoints return `{ results }`. Search items contain `title`,
`description`, and `url`; autocomplete items contain `phrase` and `matchedTerms`.
Autocomplete returns up to six unique search phrases.

## Environment and fonts

`env.schema.mjs` defines the application variables with Astro `envField`.
`SITE_URL` is a validated build-time URL and defaults to the production domain.
`ENVIRONMENT` is a runtime Worker binding: `dev` (the default), `staging`, or
`prod`. Pages include `noindex` unless it is `prod`. Select the matching
`CLOUDFLARE_ENV` when building so prerendered pages use the correct environment.
Supplied values are validated by Astro.

Archivo's Latin variable fonts (normal and italic, weights 100–900) are served
from `public/fonts/`. They were downloaded from Fontsource's CDN; the included
`Archivo-OFL.txt` is the upstream SIL Open Font License.
