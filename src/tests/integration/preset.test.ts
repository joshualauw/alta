import request from "supertest";
import { describe, expect, it } from "vitest";
import { createPresetFactory } from "@/tests/prisma";
import app from "@/index";

describe("Preset API Integration Test", () => {
    const MOCK_API_KEY = process.env.ALTA_API_KEY || "";

    describe("POST /api/preset/create", () => {
        it("should create a new preset", async () => {
            const data = {
                name: "Complex",
                chunkSplitSize: 400,
                chunkSplitOverlap: 40,
                topK: 10,
                topN: 5,
                minSimilarityScore: 0.1,
                maxResponseTokens: 512,
                rerankModel: "aaa",
                responsesModel: "bbb"
            };
            const res = await request(app).post("/api/preset/create").set("x-api-key", MOCK_API_KEY).send(data);

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({
                success: true,
                message: "create preset successful",
                errors: [],
                data: {
                    id: expect.any(Number),
                    name: data.name,
                    code: expect.any(String),
                    chunkSplitSize: data.chunkSplitSize,
                    chunkSplitOverlap: data.chunkSplitOverlap,
                    topK: data.topK,
                    topN: data.topN,
                    minSimilarityScore: data.minSimilarityScore,
                    maxResponseTokens: data.maxResponseTokens,
                    rerankModel: data.rerankModel,
                    responsesModel: data.responsesModel,
                    createdAt: expect.any(String)
                }
            });
        });

        it("should block empty body", async () => {
            const data = {
                name: null,
                chunkSplitSize: null,
                chunkSplitOverlap: null,
                topK: null,
                topN: null,
                minSimilarityScore: null,
                maxResponseTokens: null,
                rerankModel: null,
                responsesModel: null
            };
            const res = await request(app).post("/api/preset/create").set("x-api-key", MOCK_API_KEY).send(data);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: "validation failed at body",
                data: null,
                errors: expect.any(Array)
            });
        });
    });

    describe("GET /api/preset/getDetail/:id", () => {
        it("should get preset detail", async () => {
            const preset = await createPresetFactory();
            const res = await request(app).get(`/api/preset/getDetail/${preset.id}`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "get preset detail successful",
                data: {
                    id: expect.any(Number),
                    name: expect.any(String),
                    code: expect.any(String),
                    chunkSplitSize: expect.any(Number),
                    chunkSplitOverlap: expect.any(Number),
                    topK: expect.any(Number),
                    topN: expect.any(Number),
                    minSimilarityScore: expect.any(Number),
                    maxResponseTokens: expect.any(Number),
                    rerankModel: expect.any(String),
                    responsesModel: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            });
        });

        it("should not found preset detail", async () => {
            const res = await request(app).get(`/api/preset/getDetail/-1`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({
                success: false,
                errors: [],
                data: null,
                message: "preset not found"
            });
        });
    });

    describe("PUT /api/preset/update/:id", () => {
        it("should update preset", async () => {
            const preset = await createPresetFactory();

            const data = {
                name: "Updated",
                chunkSplitSize: 400,
                chunkSplitOverlap: 40,
                topK: 10,
                topN: 5,
                minSimilarityScore: 0.1,
                maxResponseTokens: 512,
                rerankModel: "aaa",
                responsesModel: "bbb"
            };
            const res = await request(app)
                .put(`/api/preset/update/${preset.id}`)
                .set("x-api-key", MOCK_API_KEY)
                .send(data);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "update preset successful",
                data: {
                    id: expect.any(Number),
                    name: data.name,
                    code: expect.any(String),
                    chunkSplitSize: data.chunkSplitSize,
                    chunkSplitOverlap: data.chunkSplitOverlap,
                    topK: data.topK,
                    topN: data.topN,
                    minSimilarityScore: data.minSimilarityScore,
                    maxResponseTokens: data.maxResponseTokens,
                    rerankModel: data.rerankModel,
                    responsesModel: data.responsesModel,
                    updatedAt: expect.any(String)
                }
            });
        });

        it("should not found preset to update", async () => {
            const data = {
                name: "Updated",
                chunkSplitSize: 400,
                chunkSplitOverlap: 40,
                topK: 10,
                topN: 5,
                minSimilarityScore: 0.1,
                maxResponseTokens: 512,
                rerankModel: "aaa",
                responsesModel: "bbb"
            };
            const res = await request(app).put(`/api/preset/update/-1`).set("x-api-key", MOCK_API_KEY).send(data);

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({
                success: false,
                errors: [],
                data: null,
                message: "preset not found"
            });
        });

        it("should block empty body", async () => {
            const preset = await createPresetFactory();

            const data = {
                name: null,
                chunkSplitSize: null,
                chunkSplitOverlap: null,
                topK: null,
                topN: null,
                minSimilarityScore: null,
                maxResponseTokens: null,
                rerankModel: null,
                responsesModel: null
            };
            const res = await request(app)
                .put(`/api/preset/update/${preset.id}`)
                .set("x-api-key", MOCK_API_KEY)
                .send(data);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                success: false,
                data: null,
                errors: expect.any(Array),
                message: "validation failed at body"
            });
        });
    });

    describe("DELETE /api/preset/delete/:id", () => {
        it("should delete preset", async () => {
            const preset = await createPresetFactory();
            const res = await request(app).delete(`/api/preset/delete/${preset.id}`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "delete preset successful",
                data: {
                    id: preset.id
                }
            });
        });

        it("should not found preset to delete", async () => {
            const res = await request(app).delete(`/api/preset/delete/-1`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({
                success: false,
                errors: [],
                data: null,
                message: "preset not found"
            });
        });
    });

    describe("GET /api/preset/getAll", () => {
        it("should get all preset", async () => {
            const res = await request(app).get("/api/preset/getAll").set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                data: {
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            code: expect.any(String),
                            createdAt: expect.any(String)
                        })
                    ]),
                    totalItems: expect.any(Number),
                    totalPages: expect.any(Number),
                    hasNextPage: expect.any(Boolean),
                    hasPrevPage: expect.any(Boolean)
                },
                message: "get all preset successful"
            });
        });
    });
});
