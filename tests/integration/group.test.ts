import { MOCK_API_KEY } from "./mock";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src";

describe("Group API Integration Test", async () => {
    let createdGroupId: number = 0;

    describe("POST /api/group/create", () => {
        it("should create a new group", async () => {
            const res = await request(app).post("/api/group/create").set("x-api-key", MOCK_API_KEY).send({
                name: "Group 1",
                colorCode: "#ffffff"
            });

            createdGroupId = res.body.data.id;

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("create group successful");

            expect(res.body.data.id).toBe(createdGroupId);
            expect(res.body.data.name).toBe("Group 1");
            expect(res.body.data.colorCode).toBe("#ffffff");
            expect(res.body.data).toHaveProperty("createdAt");
            expect(new Date(res.body.data.createdAt).toISOString()).toBe(res.body.data.createdAt);
        });

        it("should block empty body", async () => {
            const res = await request(app).post("/api/group/create").set("x-api-key", MOCK_API_KEY).send({
                name: "",
                colorCode: ""
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.message).toBe("validation failed at body");
        });
    });

    describe("GET /api/group/getDetail/:id", () => {
        it("should get group detail", async () => {
            const res = await request(app).get(`/api/group/getDetail/${createdGroupId}`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("get group detail successful");

            expect(res.body.data.id).toBe(createdGroupId);
            expect(res.body.data.name).toBe("Group 1");
            expect(res.body.data.colorCode).toBe("#ffffff");
            expect(new Date(res.body.data.createdAt).toISOString()).toBe(res.body.data.createdAt);
            expect(new Date(res.body.data.updatedAt).toISOString()).toBe(res.body.data.updatedAt);
        });

        it("should not found group detail", async () => {
            const res = await request(app).get(`/api/group/getDetail/-1`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("group not found");
        });
    });

    describe("PUT /api/group/update/:id", () => {
        it("should update group", async () => {
            const res = await request(app)
                .put(`/api/group/update/${createdGroupId}`)
                .set("x-api-key", MOCK_API_KEY)
                .send({
                    name: "Group 1 Updated",
                    colorCode: "#bbbbbb"
                });

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("update group successful");

            expect(res.body.data.id).toBe(createdGroupId);
            expect(res.body.data.name).toBe("Group 1 Updated");
            expect(res.body.data.colorCode).toBe("#bbbbbb");
            expect(new Date(res.body.data.updatedAt).toISOString()).toBe(res.body.data.updatedAt);
        });

        it("should not found group to update", async () => {
            const res = await request(app).put(`/api/group/update/-1`).set("x-api-key", MOCK_API_KEY).send({
                name: "Group 1 Updated",
                colorCode: "#bbbbbb"
            });

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("group not found");
        });

        it("should block empty body", async () => {
            const res = await request(app)
                .put(`/api/group/update/${createdGroupId}`)
                .set("x-api-key", MOCK_API_KEY)
                .send({
                    name: "",
                    colorCode: ""
                });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.message).toBe("validation failed at body");
        });
    });

    describe("DELETE /api/group/delete/:id", () => {
        it("should delete group", async () => {
            const res = await request(app).delete(`/api/group/delete/${createdGroupId}`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("delete group successful");

            expect(res.body.data.id).toBe(createdGroupId);
        });

        it("should not found group to delete", async () => {
            const res = await request(app).delete(`/api/group/delete/${createdGroupId}`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(404);
            expect(res.body.success).toBe(false);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("group not found");
        });
    });

    describe("GET /api/group/getAll", () => {
        it("should get all group", async () => {
            const res = await request(app).get("/api/group/getAll").set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("get all group successful");

            expect(Array.isArray(res.body.data)).toBe(true);
            expect(res.body.data.length).toBe(0);
        });
    });
});
