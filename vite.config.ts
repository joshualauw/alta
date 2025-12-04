import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        globalSetup: ["tests/integration/setup.ts"],
        setupFiles: ["tests/integration/prisma.ts"],
        pool: "forks"
    }
});
