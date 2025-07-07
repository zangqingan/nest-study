import js from "@eslint/js";
import globals from "globals";
import pluginPrettier from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
  // 将 Prettier 作为规则插入到 ESLint 里面
  {
    plugins: {
      prettier: pluginPrettier,
    },
    rules: {
      "prettier/prettier": "error",
    },
  },
  // 配置忽略检查文件
  {
    ignores: ["**/node_modules", "**/public", "**/assets", "**/dist", "**/package-lock.json", "**/yarn.lock", "**/pnpm-lock.yaml"],
  },
];
