import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "@/index";

describe("User API Integration Test", () => {
    describe("POST /api/user/login", () => {
        it("should failed at wrong credentials", async () => {
            const data = {
                email: "admin@mail.com",
                password: "wrongpassword"
            };

            const res = await request(app).post("/api/user/login").send(data);

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
