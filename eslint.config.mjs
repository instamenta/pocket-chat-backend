import eslint from "@eslint/js";
import tslint from "typescript-eslint";

export default tslint.config(
  {
    files: ["**/*.ts"],
    ignores: ['dist/**'],
    extends: [
      eslint.configs.recommended,
      tslint.configs.strictTypeChecked,
      tslint.configs.stylisticTypeChecked,
    ]
  },
  { languageOptions: { parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname } } },
  { // TODO: USE IMPORT PLUGIN eslint-plugin-import
    files: ["**/*.ts"],
    ignores: ['dist/**'],
    rules: {
      radix: "error",
      camelcase: "error",
      "no-console": "error"
    }
  }
);

