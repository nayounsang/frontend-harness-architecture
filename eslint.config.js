import eslint from "@eslint/js";
import modulePlugin from "./eslint-plugin-module/index.js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    {
        ignores: ["dist/**", "node_modules/**"],
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    {
        files: ["src/**/*.{ts,tsx}"],
        plugins: {
            module: modulePlugin,
        },
        rules: {
            "module/utils-no-hooks": "error",
            "module/ui-implicit-return": "error",
            "module/condition-if-return": "error",
            "module/condition-ui-switch": "error",
            "module/use-global-hooks-only": [
                "error",
                { globalStateHooks: ["useSession"] },
            ],
            "module/use-hooks-no-global-hooks": [
                "error",
                { globalStateHooks: ["useSession"] },
            ],
        },
    },
);
