import { vi } from "vitest";

export const MOCK_API_KEY = "alta_hr20kKzRhcsvpiGkeglVq6qoCWp8Oq50";

vi.mock("@/modules/source/services/ragService", async (importOriginal) => {
    const actual: object = await importOriginal();
    return {
        ...actual,
        ingest: vi.fn(),
        remove: vi.fn(),
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
