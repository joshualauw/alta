import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "@/index";
import { createSearchLogFactory } from "@/tests/prisma";

describe("Analytics API Integration Test", () => {
    const MOCK_API_KEY = process.env.ALTA_API_KEY || "";

    describe("GET /api/analytics/dashboard", () => {
        it("should get dashboard statistics", async () => {
            await createSearchLogFactory();

            const res = await request(app).get("/api/analytics/dashboard").set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                data: {
                    statistics: {
                        totalSources: expect.any(Number),
                        totalSearches: expect.any(Number),
                        totalGroups: expect.any(Number)
                    },
                    monthlyTopSources: expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(Number),
                            name: expect.any(String),
                            count: expect.any(Number)
                        })
                    ]),
                    weeklySearches: expect.arrayContaining([
                        expect.objectContaining({
                            date: expect.any(String),
                            count: expect.any(Number)
                        })
                    ])
                },
                message: "get dashboard statistics successful"
            });
        });
    });
});
