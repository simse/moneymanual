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
};
