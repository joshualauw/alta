import { vi } from "vitest";

vi.mock("@/lib/openai", async () => {
    return {
        generateRagResponse: vi.fn().mockResolvedValue("")
    };
});

vi.mock("@/lib/bullmq", async () => {
    return {
        addSourceJobs: vi.fn()
    };
});

vi.mock("@/lib/pinecone", async () => {
    return {
        upsertText: vi.fn(),
        deleteByFilter: vi.fn(),
        searchAndRerank: vi.fn().mockResolvedValue([])
    };
});
