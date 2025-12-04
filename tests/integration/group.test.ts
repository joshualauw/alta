import request from "supertest";
import { describe, expect, it } from "vitest";
import { MOCK_API_KEY } from "./mock";
import app from "../../src";
import { beforeEach } from "vitest";
import { createGroupFactory, prisma } from "./prisma";

describe("Group API Integration Test", async () => {
    beforeEach(async () => {
        await prisma.group.deleteMany();
    });

    it("should fail without API KEY", async () => {
        const res = await request(app).get("/api/group/getAll");

        expect(res.statusCode).toBe(401);
        expect(res.body).toEqual({
            success: false,
            data: null,
            message: "unauthorized access",
            errors: []
        });
    });

    describe("POST /api/group/create", () => {
        it("should create a new group", async () => {
            const data = {
                name: "Group 1",
                colorCode: "#ffffff"
            };

            const res = await request(app).post("/api/group/create").set("x-api-key", MOCK_API_KEY).send(data);

            expect(res.statusCode).toBe(201);
            expect(res.body).toEqual({
                success: true,
                message: "create group successful",
                errors: [],
                data: {
                    id: expect.any(Number),
                    name: data.name,
                    colorCode: data.colorCode,
                    createdAt: expect.any(String)
                }
            });
        });

        it("should block empty body", async () => {
            const res = await request(app).post("/api/group/create").set("x-api-key", MOCK_API_KEY).send({
                name: "",
                colorCode: ""
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                success: false,
                message: "validation failed at body",
                data: null,
                errors: expect.any(Array)
            });
        });
    });

    describe("GET /api/group/getDetail/:id", async () => {
        it("should get group detail", async () => {
            const group = await createGroupFactory();
            const res = await request(app).get(`/api/group/getDetail/${group.id}`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "get group detail successful",
                data: {
                    id: expect.any(Number),
                    name: expect.any(String),
                    colorCode: expect.any(String),
                    createdAt: expect.any(String),
                    updatedAt: expect.any(String)
                }
            });
        });

        it("should not found group detail", async () => {
            const res = await request(app).get(`/api/group/getDetail/-1`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({
                success: false,
                errors: [],
                data: null,
                message: "group not found"
            });
        });
    });

    describe("PUT /api/group/update/:id", async () => {
        it("should update group", async () => {
            const group = await createGroupFactory();

            const data = {
                name: "Group Update",
                colorCode: "#bbbbbb"
            };

            const res = await request(app)
                .put(`/api/group/update/${group.id}`)
                .set("x-api-key", MOCK_API_KEY)
                .send(data);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "update group successful",
                data: {
                    id: group.id,
                    name: data.name,
                    colorCode: data.colorCode,
                    updatedAt: expect.any(String)
                }
            });
        });

        it("should not found group to update", async () => {
            const res = await request(app).put(`/api/group/update/-1`).set("x-api-key", MOCK_API_KEY).send({
                name: "Group 1 Updated",
                colorCode: "#bbbbbb"
            });

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({
                success: false,
                errors: [],
                data: null,
                message: "group not found"
            });
        });

        it("should block empty body", async () => {
            const group = await createGroupFactory();
            const res = await request(app).put(`/api/group/update/${group.id}`).set("x-api-key", MOCK_API_KEY).send({
                name: "",
                colorCode: ""
            });

            expect(res.statusCode).toBe(400);
            expect(res.body).toEqual({
                success: false,
                data: null,
                errors: expect.any(Array),
                message: "validation failed at body"
            });
        });
    });

    describe("DELETE /api/group/delete/:id", async () => {
        it("should delete group", async () => {
            const group = await createGroupFactory();
            const res = await request(app).delete(`/api/group/delete/${group.id}`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                message: "delete group successful",
                data: {
                    id: group.id
                }
            });
        });

        it("should not found group to delete", async () => {
            const res = await request(app).delete(`/api/group/delete/-1`).set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(404);
            expect(res.body).toEqual({
                success: false,
                errors: [],
                data: null,
                message: "group not found"
            });
        });
    });

    describe("GET /api/group/getAll", async () => {
        it("should get all group", async () => {
            const res = await request(app).get("/api/group/getAll").set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                errors: [],
                data: expect.any(Array),
                message: "get all group successful"
            });
        });
    });
});
