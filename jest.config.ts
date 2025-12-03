import type { Config } from "jest";
import { createDefaultPreset } from "ts-jest";

const config: Config = {
    ...createDefaultPreset(),
    moduleNameMapper: {
        "^@/(.*)$": "<rootDir>/src/$1"
    }
};

export default config;
