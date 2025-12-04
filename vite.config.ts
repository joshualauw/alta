import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globalSetup: ["src/tests/setup.ts", "src/tests/prisma.ts"],
        setupFiles: ["src/tests/mock.ts"],
        pool: "forks",
        exclude: ["**/node_modules/**", "**/dist/**"]
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    }
});
