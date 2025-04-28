import eslint from "@eslint/js";
import tslint from "typescript-eslint";
import esimport from "eslint-plugin-import";

export default tslint.config(
  {
    files: ["**/*.ts"],
    ignores: ["dist/**"],
    extends: [
      eslint.configs.recommended,
      tslint.configs.strictTypeChecked,
      tslint.configs.stylisticTypeChecked,
      esimport.flatConfigs.typescript,
      esimport.flatConfigs.errors,
    ],
    plugins: {},
  },
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
        project: './tsconfig.json',
      },
    },
  },
  {
    files: ["**/*.ts"],
    ignores: ["dist/**"],
    rules: {
      radix: "error",
      camelcase: "error",
      "no-console": "error",

      // typescript
      "@typescript-eslint/explicit-member-accessibility": "error",

      // import
      "import/consistent-type-specifier-style": "error",
      "import/no-duplicates": "error",
      "import/no-extraneous-dependencies": "error",
      "import/no-unused-modules": "error",
      "import/no-default-export": "error",
    },
  },
);
