import { vi } from "vitest";

vi.mock("@/modules/source/services/ragSearchService", async (importOriginal) => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        search: vi.fn().mockResolvedValue({
            answer: "mock answer",
            responseTimeMs: 100,
            readUnitCost: 1,
            rerankUnitCost: 1,
            embeddingTokenCost: 1,
            chunksRetrieved: [],
            chunksReranked: [],
            chunksReferences: ["1", "2"]
        })
    };
});

vi.mock("@/modules/source/services/ragIngestionService", async (importOriginal) => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        ingest: vi.fn(),
        remove: vi.fn()
    };
});

vi.mock("@/lib/bullmq", async () => {
    return {
        sourceQueue: {
            addBulk: vi.fn()
        },
        searchLogQueue: {
            add: vi.fn()
        }
    };
});
