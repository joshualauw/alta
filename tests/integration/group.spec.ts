import * as setup from "./setup";
import request from "supertest";
import app from "../../src/index";

describe("Group API Integration Test", () => {
    describe("POST /api/group/create", async () => {
        it("should create a new group", async () => {
            const res = await request(app).set("x-api-key", setup.API_KEY).post("/api/group/create").send({
                name: "Group #1",
                colorCode: "#ffffff"
            });

            expect(res.statusCode).toBe(201);
            expect(res.body.success).toBe(true);
            expect(res.body.errors.length).toBe(0);
            expect(res.body.message).toBe("create group successful");

            expect(res.body.data).toHaveProperty("id");
            expect(res.body.data.name).toBe("Genshin Impact");
            expect(res.body.data.colorCode).toBe("#ffffff");
            expect(res.body.data).toHaveProperty("createdAt");
            expect(new Date(res.body.data.createdAt).toISOString()).toBe(res.body.data.createdAt);
        });

        it("should block empty body", async () => {
            const res = await request(app).set("x-api-key", setup.API_KEY).post("/api/group/create").send({
                name: "",
                colorCode: ""
            });

            expect(res.statusCode).toBe(400);
            expect(res.body.success).toBe(false);
            expect(res.body.errors.length).toBeGreaterThan(0);
            expect(res.body.message).toBe("validation failed at body");
        });
    });
});
