import { defineConfig } from "vitest/config";

export default defineConfig({
    test: {
        setupFiles: ["./src/test-helpers/rule-tester-setup.ts"],
    },
});
