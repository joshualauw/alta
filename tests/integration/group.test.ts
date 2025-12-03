import { MOCK_API_KEY } from "./mock";
import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../../src";

describe("Group API Integration Test", async () => {
    //let createdGroupId: number = 0;

    describe("POST /api/group/create", () => {
        it("should create a new group", async () => {
            const res = await request(app).post("/api/group/create").set("x-api-key", MOCK_API_KEY).send({
                name: "Group 1",
                colorCode: "#ffffff"
            });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("create group successful");

            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data.name).toBe("Group 1");
            expect(res.body.data.colorCode).toBe("#ffffff");
            expect(res.body.data).toHaveProperty("createdAt");
            expect(new Date(res.body.data.createdAt).toISOString()).toBe(res.body.data.createdAt);

            //createdGroupId = res.body.data.id;
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

    describe("GET /api/group/getAll", () => {
        it("should get all group", async () => {
            const res = await request(app).get("/api/group/getAll").set("x-api-key", MOCK_API_KEY);

            expect(res.statusCode).toBe(200);
            expect(res.body.success).toBe(true);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("get all group successful");
        });
    });
});
