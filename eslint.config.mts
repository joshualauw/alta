import { defineConfig, globalIgnores } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";
import js from "@eslint/js";

export default defineConfig([
    globalIgnores(["node_modules", "dist"]),
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        rules: {
            "@typescript-eslint/no-empty-object-type": [
                "off",
                {
                    allowObjectTypes: "always"
                }
            ],
            "@typescript-eslint/no-explicit-any": "warn",
            "@typescript-eslint/no-unused-vars": [
                "error",
                {
                    argsIgnorePattern: "^_",
                    varsIgnorePattern: "^_",
                    caughtErrorsIgnorePattern: "^_"
                }
            ],
            "no-unused-vars": "warn",
            "no-undef": "warn"
        },
        languageOptions: { globals: globals.browser }
    },
    tseslint.configs.recommended
]);
