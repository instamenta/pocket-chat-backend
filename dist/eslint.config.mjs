import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
export default defineConfig([
    { files: ["**/*.ts"], ignores: ['dist/**'], plugins: { js }, extends: ["js/recommended"] },
    { files: ["**/*.ts"], ignores: ['dist/**'], languageOptions: { globals: globals.browser } },
    // @ts-expect-error - to assign config
    tseslint.configs.strictTypeChecked,
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
    }
]);
