import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "@/index";

describe("User API Integration Test", () => {
    const MOCK_API_KEY = process.env.ALTA_API_KEY || "";

    describe("POST /api/user/login", () => {
        it("should login and get token", async () => {
            const data = {
                email: process.env.ADMIN_EMAIL || "",
                password: process.env.ADMIN_PASSWORD || ""
            };

            const res = await request(app).post("/api/user/login").set("x-api-key", MOCK_API_KEY).send(data);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "login successful",
                errors: [],
                data: {
                    userId: expect.any(Number),
                    token: expect.any(String)
                }
            });
        });

        it("should failed login with wrong credentials", async () => {
            const data = {
                email: "fake@mail.com",
                password: "fake-password"
            };

            const res = await request(app).post("/api/user/login").set("x-api-key", MOCK_API_KEY).send(data);

            expect(res.statusCode).toBe(401);
            expect(res.body).toEqual({
                success: false,
                message: "invalid credentials",
                errors: [],
                data: null
            });
        });
    });
});
