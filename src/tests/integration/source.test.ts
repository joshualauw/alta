import request from "supertest";
import { afterAll, describe, expect, it } from "vitest";
import { createSourceFactory } from "@/tests/prisma";
import app from "@/index";
import { vi } from "vitest";
import { ingest, remove } from "@/modules/source/services/ragIngestionService";
import { search } from "@/modules/source/services/ragSearchService";
import { addSearchLogJob, addSourceJobs } from "@/lib/bullmq";

describe("Source API Integration Test", () => {
    const MOCK_API_KEY = process.env.ALTA_API_KEY || "";

    afterAll(() => {
        vi.clearAllMocks();
    });

    describe("POST /api/source/create", () => {
        it("should create a new source", async () => {
            const data = {
                name: "General",
                content: "This is a general document about general stuff.",
                metadata: {
                    type: "general"
                }
            };

            const res = await request(app)
                .post("/api/source/create?preset=default")
                .set("x-api-key", MOCK_API_KEY)
                .send(data);

            expect(res.statusCode).toBe(201);
            expect(ingest).toBeCalled();
            expect(res.body).toEqual({
                success: true,
                message: "create source successful",
                errors: [],
                data: {
                    id: expect.any(Number),
                    name: data.name,
                    createdAt: expect.any(String)
                }
            });
        });

        it("should block empty body", async () => {
            const data = {
                name: "",
                content: ""
            };

            const res = await request(app)
                .post("/api/source/create?preset=default")
                .set("x-api-key", MOCK_API_KEY)
                .send(data);

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: "validation failed at body",
                data: null,
                errors: expect.any(Array)
            });
        });
    });

    describe("POST /api/source/create/bulk", () => {
        it("should create source in bulk", async () => {
            const data = [
                {
                    name: "General",
                    content: "This is a general document about general stuff."
                }
            ];
            const res = await request(app)
                .post("/api/source/create/bulk?preset=default")
                .set("x-api-key", MOCK_API_KEY)
                .send(data);

            expect(res.statusCode).toBe(201);
            expect(addSourceJobs).toBeCalled();
            expect(res.body).toEqual({
                success: true,
                message: "create bulk source successful",
                errors: [],
                data: {
                    createdAt: expect.any(String)
                }
            });
        });
    });

    describe("GET /api/source/getDetail/:id", () => {
        it("should get source detail", async () => {
            const source = await createSourceFactory();
            const res = await request(app).get(`/api/source/getDetail/${source.id}`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "get source detail successful",
                data: {
                    id: expect.any(Number),
                    name: expect.any(String),
                    content: expect.any(String),
                    fileUrl: expect.toBeOneOf([String, null]),
                    status: expect.toBeOneOf(["PENDING", "FAILED", "DONE"]),
                    statusReason: expect.toBeOneOf([String, null]),
                    groupId: expect.toBeOneOf([Number, null]),
                    groupName: expect.toBeOneOf([String, null]),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            });
        });

        it("should not found source detail", async () => {
            const res = await request(app).get(`/api/source/getDetail/-1`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({
                success: false,
                errors: [],
                data: null,
                message: "source not found"
            });
        });
    });

    describe("PUT /api/source/update/:id", () => {
        it("should update source", async () => {
            const source = await createSourceFactory();

            const data = {
                name: "Updated"
            };
            const res = await request(app)
                .put(`/api/source/update/${source.id}`)
                .set("x-api-key", MOCK_API_KEY)
                .send(data);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "update source successful",
                data: {
                    id: source.id,
                    name: data.name,
                    updatedAt: expect.any(String)
                }
            });
        });

        it("should not found source to update", async () => {
            const data = {
                name: "Updated"
            };
            const res = await request(app).put(`/api/source/update/-1`).set("x-api-key", MOCK_API_KEY).send(data);

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({
                success: false,
                errors: [],
                data: null,
                message: "source not found"
            });
        });

        it("should block empty body", async () => {
            const source = await createSourceFactory();

            const data = {
                name: ""
            };
            const res = await request(app)
                .put(`/api/source/update/${source.id}`)
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

    describe("DELETE /api/source/delete/:id", () => {
        it("should delete source", async () => {
            const source = await createSourceFactory();
            const res = await request(app).delete(`/api/source/delete/${source.id}`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(remove).toBeCalled();
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "delete source successful",
                data: {
                    id: source.id
                }
            });
        });

        it("should not found source to delete", async () => {
            const res = await request(app).delete(`/api/source/delete/-1`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({
                success: false,
                errors: [],
                data: null,
                message: "source not found"
            });
        });
    });

    describe("GET /api/source/getAll", () => {
        it("should get all source", async () => {
            const res = await request(app).get("/api/source/getAll").set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                data: {
                    items: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            fileUrl: expect.toBeOneOf([String, null]),
                            status: expect.toBeOneOf(["PENDING", "FAILED", "DONE"]),
                            groupId: expect.toBeOneOf([Number, null]),
                            groupName: expect.toBeOneOf([String, null]),
                            createdAt: expect.any(String)
                        })
                    ]),
                    totalItems: expect.any(Number),
                    totalPages: expect.any(Number),
                    hasNextPage: expect.any(Boolean),
                    hasPrevPage: expect.any(Boolean)
                },
                message: "get all source successful"
            });
        });
    });

    describe("POST /api/source/filter", () => {
        it("should filter source", async () => {
            const data = {
                property: { $eq: "test" }
            };

            const res = await request(app).post("/api/source/filter").set("x-api-key", MOCK_API_KEY).send(data);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "filter source successful",
                data: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(Number),
                        name: expect.any(String),
                        fileUrl: expect.toBeOneOf([String, null]),
                        status: expect.toBeOneOf(["PENDING", "FAILED", "DONE"]),
                        groupId: expect.toBeOneOf([Number, null]),
                        groupName: expect.toBeOneOf([String, null]),
                        createdAt: expect.any(String)
                    })
                ])
            });
        });
    });

    describe("POST /api/source/search", () => {
        it("should search source", async () => {
            const data = {
                question: "who is obama?",
                filters: {
                    property: { $eq: "test" }
                }
            };

            const res = await request(app)
                .post("/api/source/search?rerank=0&preset=default&tone=normal")
                .set("x-api-key", MOCK_API_KEY)
                .send(data);

            expect(res.statusCode).toBe(200);
            expect(search).toBeCalled();
            expect(addSearchLogJob).toBeCalled();
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "search source successful",
                data: {
                    answer: expect.any(String),
                    references: expect.any(Array)
                }
            });
        });
    });
});
