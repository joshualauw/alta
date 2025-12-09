import { describe, expect, it } from "vitest";
import request from "supertest";
import app from "@/index";

describe("User API Integration Test", () => {
    describe("POST /api/user/login", () => {
        it("should login successfuly", async () => {
            const data = {
                email: "admin@mail.com",
                password: "gaspol123"
            };

            const res = await request(app).post("/api/user/login").send(data);

            expect(res.statusCode).toBe(200);
            expect(res.body).toEqual({
                success: true,
                message: "login successful",
                errors: [],
                data: {
                    id: expect.any(Number),
                    name: expect.any(String),
                    email: data.email,
                    role: "ADMIN",
                    token: expect.any(String)
                }
            });
        });

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
