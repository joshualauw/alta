import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";
import path from "node:path";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globalSetup: ["src/tests/setup.ts", "src/tests/prisma.ts"],
        pool: "forks"
    },
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src")
        }
    }
});
