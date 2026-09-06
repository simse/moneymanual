import { defineConfig } from "oxlint";

export default defineConfig({
  plugins: ["typescript", "unicorn", "oxc"],
  jsPlugins: ["./oxlint-plugin/index.mjs"],
  categories: {
    correctness: "error",
  },
  rules: {
    curly: ["error", "all"],
    "func-style": ["error", "expression"],
    "moneymanual/padding-around-multiline-statements": "error",
  },
});
