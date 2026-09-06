import { envField } from "astro/config";

export const envSchema = {
  SITE_URL: envField.string({
    context: "server",
    access: "public",
    url: true,
    default: "https://moneymanual.org.uk",
  }),
  // Secret access reads Worker bindings at runtime, rather than build-time values.
  ENVIRONMENT: envField.enum({
    context: "server",
    access: "secret",
    values: ["dev", "staging", "prod"],
    default: "dev",
  }),
  TYPESENSE_API_URL: envField.string({
    context: "server",
    access: "secret",
    url: true,
    optional: true,
  }),
  TYPESENSE_API_KEY: envField.string({
    context: "server",
    access: "secret",
    min: 1,
    optional: true,
  }),
  TYPESENSE_INDEX_NAME: envField.string({
    context: "server",
    access: "secret",
    min: 1,
    optional: true,
  }),
};
