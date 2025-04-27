import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config({
      files: ["**/*.ts"], ignores: ['dist/**'], extends: [
        eslint.configs.recommended,
        tseslint.configs.strictTypeChecked,
        tseslint.configs.stylisticTypeChecked,
      ]
    },
    {
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: import.meta.dirname,
        },
      },
    },
    {
      files: ["**/*.ts"], ignores: ['dist/**'],
      rules: {
        '@typescript-eslint/no-extraneous-class': 'off'
      }
    });
