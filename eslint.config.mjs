import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "_next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "*.html",
    "*.txt",
    "404.html",
    "_not-found/**",
    "about/**",
    "cart/**",
    "categories/**",
    "checkout/**",
    "contact/**",
    "privacy-policy/**",
    "products/**",
    "shop/**",
    "terms-and-conditions/**",
  ]),
]);

export default eslintConfig;
