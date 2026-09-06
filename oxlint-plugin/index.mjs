import { eslintCompatPlugin } from "@oxlint/plugins";

import paddingAroundMultilineStatements from "./padding-around-multiline-statements.mjs";

export default eslintCompatPlugin({
  meta: { name: "moneymanual" },
  rules: {
    "padding-around-multiline-statements": paddingAroundMultilineStatements,
  },
});
